/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {Socket} from "../sc/socket";
import {
    CudPackage,
    CudType,
    DATA_BOX_START_INDICATOR,
    DataboxConnectReq,
    DataboxConnectRes,
    DbClientInputAction,
    DbClientInputFetchPackage,
    DbClientInputFetchResponse,
    DbClientInputPackage,
    DBClientInputSessionTarget,
    DbClientOutputClosePackage,
    DbClientOutputCudPackage,
    DbClientOutputEvent,
    DbClientOutputKickOutPackage,
    DbClientOutputPackage,
    DbClientOutputReloadPackage,
    IfContainsOption,
    InfoOption,
    TimestampOption
} from "./dbDefinitions";
import DbStorage, {DbStorageOptions, OnDataChange} from "./storage/dbStorage";
import DbFetchHistoryManager, {FetchHistoryItem}  from "./dbFetchHistoryManager";
import ObjectUtils                                from "../utils/objectUtils";
import {Zation}                                   from "../../core/zation";
import ConnectionUtils, {WaitForConnectionOption} from "../utils/connectionUtils";
import EventManager                               from "../utils/eventManager";
import {RawError}                                 from "../error/rawError";
import {ErrorName}                                from "../constants/errorName";
import DbsHead                                    from "./storage/components/dbsHead";
import DbUtils                                    from "./dbUtils";

export interface DataboxOptions {
    /**
     * Activates that the Databox automatically fetch data after the first connection.
     * @default true
     */
    autoFetch ?: boolean;
    /**
     * The fetch input data for the auto fetch.
     * @default undefined
     */
    autoFetchData ?: any,
    /**
     * The API level of this client for the Databox connection request.
     * If you don't provide one, the server will use the connection API
     * level or the default API level.
     * @default undefined
     */
    apiLevel ?: number | undefined;
    /**
     * The main Databox storage options.
     * Change this option only if you know what you are doing.
     * If you want to have a Storage that only does updates,
     * it is recommended to connect a new DbStorage to the Databox and
     * copy the data from the main storage.
     * @default {}
     */
    mainStorageOptions ?: DbStorageOptions;
    /**
     * With the WaitForConnection option, you can activate that the socket is
     * trying to connect when it is not connected.
     * This option will be used when you try to connect to the Databox.
     * Because then the socket needs to be connected.
     * You have four possible choices:
     * Undefined: It will use the value from the default options (ZationOptions).
     * False: The action will fail and throw a ConnectionRequiredError,
     * when the socket is not connected.
     * For the other options, it is also recommended to have activated the auto-reconnect.
     * Null: The socket will try to connect (if it is not connected) and
     * waits until the connection is made, then it continues the action.
     * Number: Same as null, but now you can specify a timeout (in ms) of
     * maximum waiting time for the connection. If the timeout is reached,
     * it will throw a timeout error.
     * @default undefined
     */
    waitForConnection ?: WaitForConnectionOption;
    /**
     * With the WaitForDbConnection option, you can activate that the Databox is
     * trying to connect (if it's not connected) whenever you want
     * to fetchData.
     * You have four possible choices:
     * Undefined: It will use the value from the default options (ZationOptions).
     * False: The action will fail and throw a ConnectionRequiredError,
     * when the Databox is not connected.
     * For the other options, it is also recommended to have activated the auto-reconnect.
     * Null: The Databox will try to connect (if it is not connected) and
     * waits until the connection is made, then it continues the action.
     * Number: Same as null, but now you can specify a timeout (in ms) of
     * maximum waiting time for the connection. If the timeout is reached,
     * it will throw a timeout error.
     * @default undefined
     */
    waitForDbConnection ?: WaitForConnectionOption;
    /**
     * The init data that the Databox is sent to the server
     * when it's creating a connection.
     * @default undefined
     */
    initData ?: any;
}

interface RequiredDbOptions extends DataboxOptions {
    autoFetch : boolean;
    autoFetchData : any;
    apiLevel : number | undefined;
    mainStorageOptions : DbStorageOptions;
    waitForConnection : WaitForConnectionOption;
    waitForDbConnection : WaitForConnectionOption;
    initData : any;
}

type OnConnect     = () => void | Promise<void>;
type OnDisconnect  = (fromClient : boolean) => void | Promise<void>;
type OnKickOut     = (code : number | string | undefined,data : any) => void | Promise<void>
type OnClose       = (code : number | string | undefined,data : any) => void | Promise<void>
type OnReload      = (code : number | string | undefined,data : any) => void | Promise<void>
type OnCud         = (cudPackage : CudPackage) => void | Promise<void>
type OnNewData     = (db : Databox) => void | Promise<void>

export default class Databox {

    private readonly name: string;
    private readonly id: string | undefined;
    private readonly apiLevel: number | undefined;
    private readonly socket: Socket;
    private readonly zation: Zation;

    private readonly dbStorages: Set<DbStorage> = new Set<DbStorage>();
    private readonly mainDbStorage: DbStorage;
    private readonly tmpReloadDataSets: Set<DbsHead> = new Set<DbsHead>();
    private readonly fetchHistoryManager: DbFetchHistoryManager = new DbFetchHistoryManager();
    private readonly tmpRestoreStroage: DbStorage;

    private readonly initData: any;

    private created: boolean = false;
    private token: string | undefined = undefined;

    /**
     * The current cud id of this Databox.
     */
    private cudId: string | undefined = undefined;
    /**
     * The last server side cud id.
     */
    private serverSideCudId: string | undefined = undefined;

    private reloadProcessPromise: Promise<void> = Promise.resolve();
    private historyFetch: (history: FetchHistoryItem[]) => Promise<DbsHead[]>
        = this._normalHistoryFetch;

    private inputChannel: string;
    private outputChannel: string;
    private outputListener: ((data: any) => void) | undefined = undefined;
    private unregisterSocketStateListener: (() => void) | undefined = undefined;
    private parallelFetch: boolean;
    private connected: boolean = false;

    private connectEvent: EventManager<OnConnect> = new EventManager();
    private disconnectEvent: EventManager<OnDisconnect> = new EventManager();
    private kickOutEvent: EventManager<OnKickOut> = new EventManager();
    private closeEvent: EventManager<OnClose> = new EventManager();
    private reloadEvent: EventManager<OnReload> = new EventManager();
    private cudEvent: EventManager<OnCud> = new EventManager();
    private newDataEvent: EventManager<OnNewData> = new EventManager();

    private dbOptions: RequiredDbOptions = {
        autoFetch: true,
        autoFetchData: undefined,
        mainStorageOptions: {},
        apiLevel: undefined,
        waitForConnection: undefined,
        waitForDbConnection : undefined,
        initData: undefined
    };

    constructor(zation: Zation, options: DataboxOptions, name: string, id ?: string) {
        ObjectUtils.addObToOb(this.dbOptions, options, false);

        this.socket = zation.getSocket();
        this.zation = zation;
        this.apiLevel = this.dbOptions.apiLevel;
        this.name = name;
        this.id = id;
        this.initData = this.dbOptions.initData;

        const tmpRestoreStorageOptions: DbStorageOptions = {
            doAddFetchData: true,
            doUpdate: true,
            doDelete: true,
            doInsert: true
        };
        ObjectUtils.addObToOb(tmpRestoreStorageOptions, this.dbOptions.mainStorageOptions);
        this.tmpRestoreStroage = new DbStorage(tmpRestoreStorageOptions);

        this.mainDbStorage = new DbStorage(this.dbOptions.mainStorageOptions);
        this.dbStorages.add(this.mainDbStorage);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * This method will disconnect the connection to the Databox.
     * It will clean the used memory, remove all listeners,
     * and tell the server to close this Databox connection.
     * You should call this method whenever you no longer need this Databox.
     * But you able to connect later again by calling the connect method.
     * @param clearStorages
     */
    async disconnect(clearStorages: boolean = true) {
        let disconnectResp;
        if (this.connected) {
            disconnectResp = new Promise<void>((res) => {
                this.socket.emit(this.inputChannel, {
                    a: DbClientInputAction.disconnect
                } as DbClientInputPackage, res);
            });
        }
        this._clearListenersAndReset();
        if (clearStorages) {
            this.clearStorages();
        }
        await disconnectResp;
        this.disconnectEvent.emit(true);
    }

    /**
     * Removes all listeners and resets the state data.
     */
    private _clearListenersAndReset() {
        this._unregisterOutputChannel();
        this._unregisterSocketStateHandler();
        this._resetStateData();
    }

    /**
     * Resets the state data of this Databox.
     * @private
     */
    private _resetStateData() {
        this.created = false;
        this.connected = false;
        this.token = undefined;
        this.cudId = undefined;
        this.serverSideCudId = undefined;
        this.fetchHistoryManager.reset();
        this.reloadProcessPromise = Promise.resolve();
    }

    /**
     * This method is used to connect to the Databox on the server-side.
     * Zation will automatically call that method for the first time.
     * You can use the method if you had disconnected the Databox and want to use it again.
     * Whenever the connection is lost, you don't need to call that method.
     * The Databox will reconnect automatically as fast as possible.
     * @throws RawError,TimeoutError,ConnectionRequiredError
     * @param waitForConnection
     * With the WaitForConnection option, you can activate that the socket is
     * trying to connect when it is not connected. You have four possible choices:
     * Undefined: It will use the value from the default options
     * (DataboxOptions and last fall back is ZationOptions).
     * False: The action will fail and throw a ConnectionRequiredError,
     * when the socket is not connected.
     * For the other options, it is also recommended to have activated the auto-reconnect.
     * Null: The socket will try to connect (if it is not connected) and
     * waits until the connection is made, then it continues the action.
     * Number: Same as null, but now you can specify a timeout (in ms) of
     * maximum waiting time for the connection. If the timeout is reached,
     * it will throw a timeout error.
     */
    async connect(waitForConnection: WaitForConnectionOption = undefined): Promise<void> {
        waitForConnection = waitForConnection === undefined ?
            this.dbOptions.waitForConnection : waitForConnection;

        await ConnectionUtils.checkConnection
        (this.zation, waitForConnection, 'To create a Databox.');

        if (!this.created) {
            try {
                this._registerSocketStateHandler();
                await this._connect();
                this._registerOutputChannel();
                this._updateHistoryFetch();
                this.created = true;
            } catch (e) {
                this._clearListenersAndReset();
                throw new RawError('Failed to connect to the Databox', e);
            }

            if (this.dbOptions.autoFetch) {
                try {
                    await this.fetchData(this.dbOptions.autoFetchData);
                } catch (e) {
                }
            }
        } else {
            if (!this.connected) {
                await this._reconnect();
            }
        }
    }

    /**
     * Tries to reconnect the Databox.
     * @private
     * @throws
     */
    private async _reconnect() {
        await this._connect();
        await this._checkCudUpToDate();
    }

    /**
     * Updates the history fetcher.
     * @private
     */
    private _updateHistoryFetch() {
        if (this.parallelFetch) {
            this.historyFetch = this._parallelHistoryFetch;
        } else {
            this.historyFetch = this._normalHistoryFetch;
        }
    }

    /**
     * Sends a connect request to the Databox on the server-side.
     * @private
     */
    private async _connect() {

        const currentToken = this.token;

        return new Promise<void>((resolve, reject) => {
            this.socket.emit(DATA_BOX_START_INDICATOR, {
                al: this.apiLevel,
                d: this.name,
                ...(this.id !== undefined ? {i: this.id} : {}),
                ...(currentToken !== undefined ? {t: currentToken} : {}),
                ...(this.initData !== undefined ? {ii: this.initData} : {})
            } as DataboxConnectReq, async (err, res: DataboxConnectRes) => {

                if (err) {return reject(err);}

                this.connected = true;

                this.serverSideCudId = res.ci;
                if (this.cudId === undefined) {
                    //first register
                    this.cudId = res.ci;
                }

                this.inputChannel = res.i;
                this.parallelFetch = res.pf;
                this.outputChannel = res.o;

                this.connectEvent.emit();

                if (!res.ut && currentToken !== undefined) {
                    (async () => {
                        await this._tryReload();
                    })();
                }

                resolve();
            });
        });
    }

    /**
     * Checks if the Databox is on the latest cud state.
     * @private
     */
    private async _checkCudUpToDate() {
        if (this.cudId !== this.serverSideCudId) {
            //Can not be undefined because the Databox was already registered.
            await this._tryReload();
        }
    }

    /**
     * Registers the socket state handler.
     * @private
     */
    private _registerSocketStateHandler() {
        const disconnectHandler = () => {
            this.connected = false;
            this.disconnectEvent.emit(false);
        };

        const reconnectHandler = async () => {
            if (!this.connected) {
                try {
                    await this._reconnect();
                } catch (e) {
                }
            }
        };

        this.socket.on('connect', reconnectHandler);
        this.socket.on('disconnect', disconnectHandler);
        //try again maybe the socket had no access before.
        this.socket.on('authenticate', reconnectHandler);
        this.unregisterSocketStateListener = () => {
            this.socket.off('connect', reconnectHandler);
            this.socket.off('disconnect', disconnectHandler);
            this.socket.off('authenticate', reconnectHandler);
        };
    }

    /**
     * Unregisters the socket state handler.
     * @private
     */
    private _unregisterSocketStateHandler() {
        if (this.unregisterSocketStateListener) {
            this.unregisterSocketStateListener();
            this.unregisterSocketStateListener = undefined;
        }
    }

    /**
     * Fetch new data from the server.
     * You can pass in the fetch input as a parameter.
     * The method returns true if the data was added to the storage or
     * false if no more data is available.
     * @param data
     * @param waitForDbConnection
     * With the WaitForDbConnection option, you can activate that the Databox is
     * trying to connect (if it's not connected).
     * You have four possible choices:
     * Undefined: It will use the value from the default options
     * (DataboxOptions and last fall back is ZationOptions).
     * False: The action will fail and throw a ConnectionRequiredError,
     * when the Databox is not connected.
     * For the other options, it is also recommended to have activated the auto-reconnect.
     * Null: The Databox will try to connect (if it is not connected) and
     * waits until the connection is made, then it continues the action.
     * Number: Same as null, but now you can specify a timeout (in ms) of
     * maximum waiting time for the connection. If the timeout is reached,
     * it will throw a timeout error.
     * @param addToHistory
     * Indicates if this fetch should be added to the history.
     * You can deactivate this in some cases
     * if you don't want to reload this fetch later (In case of cud missed).
     * But this only will work fine if your fetches
     * do not depend on each other.
     * @throws ConnectionRequiredError,TimeoutError,RawError
     */
    async fetchData(data ?: any, waitForDbConnection: WaitForConnectionOption = undefined, addToHistory : boolean = true): Promise<boolean> {

        waitForDbConnection = waitForDbConnection === undefined ?
            this.dbOptions.waitForDbConnection : waitForDbConnection;

        await ConnectionUtils.checkDbConnection
        (this, this.zation, waitForDbConnection, 'To fetch new data.');

        try {
            const resp = await this._fetchData(data, DBClientInputSessionTarget.mainSession);

            if(addToHistory){
                this.fetchHistoryManager.pushHistory(resp.c, data, resp.d);
            }

            const dbsHead = new DbsHead(resp.d);
            const counter = resp.c;

            for (let dbStorage of this.dbStorages) {
                if (dbStorage.shouldAddFetchData(counter,dbsHead)) {
                    dbStorage.addData(dbsHead);
                }
            }
            this.newDataEvent.emit(this);
            return true;
        } catch (e) {
            const rawError = new RawError('Fetch new data failed.', e);

            if (rawError.isErrorName(ErrorName.NO_MORE_DATA_AVAILABLE)) {
                return false;
            } else {
                throw new RawError('Fetch new data failed.', e);
            }
        }
    }

    /**
     * Sends a fetch request to the server.
     * @param input
     * @param sessionTarget
     * @private
     */
    private async _fetchData(input: any, sessionTarget: DBClientInputSessionTarget): Promise<DbClientInputFetchResponse> {
        return new Promise<DbClientInputFetchResponse>((resolve, reject) => {
            this.socket.emit(this.inputChannel, {
                i: input,
                a: DbClientInputAction.fetchData,
                t: sessionTarget
            } as DbClientInputFetchPackage, (err, res: DbClientInputFetchResponse) => {
                if (err) {
                    reject(err);
                } else {
                    this.token = res.t;
                    resolve(res);
                }
            });
        });
    }

    /**
     * The parallel history fetcher.
     * @param history
     */
    private async _parallelHistoryFetch(history: FetchHistoryItem[]): Promise<DbsHead[]> {
        const promises: Promise<void>[] = [];
        const results: DbsHead[] = [];
        for (let i = 0; i < history.length; i++) {
            promises.push((async () => {
                try {
                    const fetchResult = await this._fetchData(history[i].input, DBClientInputSessionTarget.reloadSession);
                    const dbsHead = new DbsHead(fetchResult.d);
                    results[fetchResult.c] = dbsHead;
                    this.tmpReloadDataSets.add(dbsHead);
                } catch (err) {
                    if ((err.name as ErrorName) !== ErrorName.NO_MORE_DATA_AVAILABLE) {
                        throw err;
                    }
                }
            })());
        }
        await Promise.all(promises);
        return results;
    }

    /**
     * The normal history fetcher.
     * @param history
     */
    private async _normalHistoryFetch(history: FetchHistoryItem[]): Promise<DbsHead[]> {
        const results: DbsHead[] = [];
        for (let i = 0; i < history.length; i++) {
            try {
                const fetchResult = await this._fetchData(history[i].input, DBClientInputSessionTarget.reloadSession);
                const dbsHead = new DbsHead(fetchResult.d);
                results[fetchResult.c] = dbsHead;
                this.tmpReloadDataSets.add(dbsHead);
            } catch (err) {
                if ((err.name as ErrorName) === ErrorName.NO_MORE_DATA_AVAILABLE) {
                    break;
                } else {
                    throw err;
                }
            }
        }
        return results;
    }

    /**
     * Resets the databox by disconnect and connect again.
     * @throws RawError,TimeoutError,ConnectionRequiredError
     */
    async reset() {
        await this.disconnect();
        await this.connect();
    }

    /**
     * Reload the fetched data.
     * A rollback mechanism will get sure that the history will not be damaged in fail case.
     * @throws ConnectionRequiredError,TimeoutError,RawError
     */
    async reload(waitForConnection: WaitForConnectionOption = false) {
        const tmpCudId = this.cudId;
        await ConnectionUtils.checkDbConnection(this, this.zation, waitForConnection, 'To reload Databox');
        this.reloadProcessPromise = this.reloadProcessPromise.then(async () => {
            const history = this.fetchHistoryManager.getHistory();
            if (history.length > 0) {
                await this.sendSessionAction(DbClientInputAction.resetSession, DBClientInputSessionTarget.reloadSession);
                try {
                    const result = await this.historyFetch(history);

                    const missedHistory = this.fetchHistoryManager.getHistory();
                    for (let i = 0; i < missedHistory.length; i++) {
                        result.push(new DbsHead(missedHistory[i].data));
                    }

                    this.tmpRestoreStroage.clear();
                    for (let i = 0; i < result.length; i++) {
                        if (result[i] === undefined) {
                            continue;
                        }
                        this.tmpRestoreStroage.addData(result[i]);
                    }

                    await this.sendSessionAction(DbClientInputAction.copySession, DBClientInputSessionTarget.reloadSession);
                    this.tmpReloadDataSets.clear();
                    this._restoreStorages(this.tmpRestoreStroage);

                    this.fetchHistoryManager.commit();
                    this.newDataEvent.emit(this);

                    //Check is not updated from cud event.
                    if (tmpCudId === this.cudId) {
                        await this._updateCudId();
                    }
                } catch (e) {
                    this.fetchHistoryManager.rollBack();
                    this.tmpReloadDataSets.clear();
                }
            }
        });
    }

    /**
     * Updates the cud id to the latest server side cud id.
     * @private
     */
    private async _updateCudId() {
        try {
            await this._updateServerSideCudId();
        } catch (e) {
        }
        this.cudId = this.serverSideCudId;
    }

    /**
     * Tries to reload the Databox data. It can fail if the Databox is
     * not connected or something changed on the backend.
     * So if it fails, it will mostly have a connection lost,
     * but in this case, this method will ignore it.
     * Because when the Databox is reconnected,
     * it will try to reload again.
     * The history will not be damaged because the
     * history manager provides a rollback mechanism.
     * @private
     */
    private async _tryReload() {
        try {
            await this.reload();
        } catch (e) {
        }
    }

    /**
     * Updates the server side cud id.
     * @private
     */
    private async _updateServerSideCudId(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.socket.emit(this.inputChannel, {
                a: DbClientInputAction.getLastCudId,
            } as DbClientInputPackage, (err, cudId: string) => {
                if (err) {
                    reject(err);
                } else {
                    this.serverSideCudId = cudId;
                }
            });
        });
    }

    /**
     * Send a session action to the Server and update the token.
     * @param action
     * @param target
     */
    private async sendSessionAction(action: DbClientInputAction.resetSession | DbClientInputAction.copySession,
                                    target: DBClientInputSessionTarget): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.socket.emit(this.inputChannel, {
                a: action,
                t: target
            } as DbClientInputPackage, (err, token: string) => {
                if (err) {
                    reject(err);
                } else {
                    this.token = token;
                    resolve();
                }
            });
        });
    }

    /**
     * Process a cud package from the server.
     * @param cudPackage
     * @private
     */
    private _processCudPackage(cudPackage: CudPackage) {
        this.cudId = cudPackage.ci;
        this.serverSideCudId = cudPackage.ci;
        const timestamp = cudPackage.t;
        const actions = cudPackage.a;
        for (let i = 0; i < actions.length; i++) {
            const action = actions[i];
            const {k, v, c, d} = action;
            switch (action.t) {
                case CudType.update:
                    this.update(k, v, {
                        timestamp,
                        code: c,
                        data: d
                    });
                    break;
                case CudType.insert:
                    this.insert(k, v, {
                        timestamp,
                        code: c,
                        data: d,
                        ifContains: action.i
                    });
                    break;
                case CudType.delete:
                    this.delete(k, {
                        timestamp,
                        code: c,
                        data: d
                    });
                    break;
            }
        }
    }

    /**
     * Handler for kickout.
     * @private
     */
    private _kickout(code: number | string | undefined, data: any) {
        this._clearListenersAndReset();
        this._storageIfClear((s) => s.shouldClearOnKickOut(code,data));
        this.kickOutEvent.emit(code, data);
    }

    /**
     * Handler for close.
     */
    private async _close(code: number | string | undefined, data: any) {
        this._clearListenersAndReset();
        this._storageIfClear((s) => s.shouldClearOnClose(code,data));
        this.closeEvent.emit(code, data);
    }

    /**
     * Registers the output handler.
     * @private
     */
    private _registerOutputChannel() {
        const outputListener = async (outputPackage: DbClientOutputPackage) => {
            switch (outputPackage.a) {
                case DbClientOutputEvent.cud:
                    const cudPackage = (outputPackage as DbClientOutputCudPackage).d;
                    this._processCudPackage(cudPackage);
                    this.cudEvent.emit(cudPackage);
                    break;
                case DbClientOutputEvent.close:
                    const closePackage = (outputPackage as DbClientOutputClosePackage);
                    await this._close(closePackage.c, closePackage.d);
                    break;
                case DbClientOutputEvent.kickOut:
                    const kickOutPackage = (outputPackage as DbClientOutputKickOutPackage);
                    this._kickout(kickOutPackage.c, kickOutPackage.d);
                    break;
                case DbClientOutputEvent.reload:
                    const reloadPackage = (outputPackage as DbClientOutputReloadPackage);
                    await this._tryReload();
                    this.reloadEvent.emit(reloadPackage.c, reloadPackage.d);
                    break;
            }
        };
        this.outputListener = outputListener;
        this.socket.on(this.outputChannel, outputListener);
    }

    /**
     * Unregisters the output handler.
     * @private
     */
    private _unregisterOutputChannel() {
        if (this.outputListener) {
            this.socket.off(this.outputChannel, this.outputListener);
        }
        this.outputListener = undefined;
    }

    /**
     *
     * @param restoreStorage
     * @private
     */
    private _restoreStorages(restoreStorage: DbStorage) {
        for (let dbStorage of this.dbStorages) {
            if(dbStorage.shouldReload(restoreStorage)){
                dbStorage.copyFrom(restoreStorage);
            }
        }
    }

    /**
     * Do an insert operation on all connected storages.
     * This method is used internally.
     * Notice if you do a cud operation locally on the client,
     * that this operation is not done on the server-side.
     * So if the Databox reloads the data or resets the changes are lost.
     * Insert behavior:
     * Without ifContains (ifContains exists):
     * Base (with keyPath [] or '') -> Nothing
     * KeyArray -> Inserts the value at the end with the key
     * (if the key does not exist). But if you are using a compare function,
     * it will insert the value in the correct position.
     * Object -> Inserts the value with the key (if the key does not exist).
     * Array -> Key will be parsed to int if it is a number then it will be inserted at the index.
     * Otherwise, it will be added at the end.
     * With ifContains (ifContains exists):
     * Base (with keyPath [] or '') -> Nothing
     * KeyArray -> Inserts the value before the ifContains element with the key
     * (if the key does not exist). But if you are using a compare function,
     * it will insert the value in the correct position.
     * Object -> Inserts the value with the key (if the key does not exist).
     * Array -> Key will be parsed to int if it is a number then it will be inserted at the index.
     * Otherwise, it will be added at the end.
     * @param keyPath
     * The keyPath can be a string array or a
     * string where you can separate the keys with a dot.
     * @param value
     * @param options
     */
    insert(keyPath: string[], value: any, options: IfContainsOption & InfoOption & TimestampOption = {}): Databox {
        for (let dbStorage of this.dbStorages) {
            dbStorage.insert(keyPath, value, options);
        }
        for (let dataSet of this.tmpReloadDataSets) {
            dataSet.insert(keyPath, value, DbUtils.processTimestamp(options.timestamp), options.ifContains);
        }
        this.newDataEvent.emit(this);
        return this;
    }

    /**
     * Do an update operation on all connected storages.
     * This method is used internally.
     * Notice if you do a cud operation locally on the client,
     * that this operation is not done on the server-side.
     * So if the Databox reloads the data or resets the changes are lost.
     * Update behavior:
     * Base (with keyPath [] or '') -> Updates the complete structure.
     * KeyArray -> Updates the specific value (if the key does exist).
     * Object -> Updates the specific value (if the key does exist).
     * Array -> Key will be parsed to int if it is a number it will
     * update the specific value (if the index exist).
     * @param keyPath
     * The keyPath can be a string array or a
     * string where you can separate the keys with a dot.
     * @param value
     * @param options
     */
    update(keyPath: string[], value: any, options: InfoOption & TimestampOption = {}): Databox {
        for (let dbStorage of this.dbStorages) {
            dbStorage.update(keyPath, value, options);
        }
        for (let dataSet of this.tmpReloadDataSets) {
            dataSet.update(keyPath, value, DbUtils.processTimestamp(options.timestamp));
        }
        this.newDataEvent.emit(this);
        return this;
    }

    /**
     * Do an delete operation on all connected storages.
     * This method is used internally.
     * Notice if you do a cud operation locally on the client,
     * that this operation is not done on the server-side.
     * So if the Databox reloads the data or resets the changes are lost.
     * Delete behavior:
     * Base (with keyPath [] or '') -> Deletes the complete structure.
     * KeyArray -> Deletes the specific value (if the key does exist).
     * Object -> Deletes the specific value (if the key does exist).
     * Array -> Key will be parsed to int if it is a number it will delete the
     * specific value (if the index does exist). Otherwise, it will delete the last item.
     * @param keyPath
     * The keyPath can be a string array or a
     * string where you can separate the keys with a dot.
     * @param options
     */
    delete(keyPath: string[], options: InfoOption & TimestampOption = {}): Databox {
        for (let dbStorage of this.dbStorages) {
            dbStorage.delete(keyPath, options);
        }
        for (let dataSet of this.tmpReloadDataSets) {
            dataSet.delete(keyPath, DbUtils.processTimestamp(options.timestamp));
        }
        this.newDataEvent.emit(this);
        return this;
    }

    /**
     * This method will clear all connected db storages.
     */
    clearStorages(): Databox {
        for (let dbStorage of this.dbStorages) {
            dbStorage.clear();
        }
        return this;
    }

    /**
     * Clear every storage that meets conditions.
     * @private
     */
    private _storageIfClear(func: (storage: DbStorage) => boolean) {
        for (let dbStorage of this.dbStorages) {
            if (func(dbStorage)) {
                dbStorage.clear();
            }
        }
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns the main storage of this Databox.
     */
    get mainStorage(): DbStorage {
        return this.mainDbStorage;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns all storages of this Databox in an array.
     */
    get storages(): DbStorage[] {
        return Array.from(this.dbStorages);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Do something for each storage.
     * @param func
     */
    forEachStorage(func: (storage: DbStorage) => void): Databox {
        for (let dbStorage of this.dbStorages) {
            func(dbStorage);
        }
        return this;
    }

    /**
     * Returns if this Databox is connected to the server-side.
     */
    isConnected(): boolean {
        return this.connected;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns if the Databox is created.
     */
    isCreated(): boolean {
        return this.created;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns the current cud id.
     */
    getCurrentCudId() : string | undefined {
        return this.cudId;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Connect a new Storage to the Databox.
     * @param dbStorage
     */
    connectStorage(dbStorage : DbStorage) : Databox {
        this.dbStorages.add(dbStorage);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Disconnect a Storage from the Databox.
     * @param dbStorage
     */
    disconnectStorage(dbStorage : DbStorage) : Databox {
        this.dbStorages.delete(dbStorage);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns the data from the main storage.
     * @param directAccess
     * The direct access is dangerous if you modify something on the data,
     * it can break the whole storage.
     * The only advantage is that it is faster because the
     * storage doesn't need to create a copy from the entire structure.
     * You can use it if you need extreme performance.
     * But you need to be careful that you only read from the data.
     */
    getData<T = any>(directAccess : boolean = false) : T {
        return this.mainDbStorage.getData<T>(directAccess);
    }

    //events
    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a listener that gets triggered
     * whenever the Databox is connected to the server.
     * That also includes reconnections.
     * @param listener
     */
    onConnect(listener : OnConnect) : Databox {
        this.connectEvent.on(listener);
        return this;
    }

    /**
     * Adds a once listener that gets triggered when
     * the Databox is connected to the server.
     * That also includes reconnections.
     * @param listener
     */
    onceConnect(listener : OnConnect) : Databox {
        this.connectEvent.once(listener);
        return this;
    }

    /**
     * Removes a listener of the connect event.
     * Can be a once or normal listener.
     * @param listener
     */
    offConnect(listener : OnConnect){
        this.connectEvent.off(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a listener that gets triggered
     * whenever the Databox is disconnected from the server.
     * @param listener
     */
    onDisconnect(listener : OnDisconnect) : Databox {
        this.disconnectEvent.on(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a once listener that gets triggered when
     * the Databox is disconnected from the server.
     * @param listener
     */
    onceDiconnect(listener : OnDisconnect) : Databox {
        this.disconnectEvent.once(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Removes a listener of the disconnect event.
     * Can be a once or normal listener.
     * @param listener
     */
    offDisonnect(listener : OnDisconnect){
        this.disconnectEvent.off(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a listener that gets triggered
     * whenever the socket is kicked out from the Databox.
     * @param listener
     */
    onKickOut(listener : OnKickOut) : Databox {
        this.kickOutEvent.on(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a once listener that gets triggered when
     * the socket is kicked out from the Databox.
     * @param listener
     */
    onceKickOut(listener : OnKickOut) : Databox {
        this.kickOutEvent.once(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Removes a listener of the kickOut event.
     * Can be a once or normal listener.
     * @param listener
     */
    offKickOut(listener : OnKickOut){
        this.kickOutEvent.off(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a listener that gets triggered
     * whenever the server closes the Databox.
     * @param listener
     */
    onClose(listener : OnClose) : Databox {
        this.closeEvent.on(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a once listener that gets triggered when
     * the server closes the Databox.
     * @param listener
     */
    onceClose(listener : OnClose) : Databox {
        this.closeEvent.once(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Removes a listener of the close event.
     * Can be a once or normal listener.
     * @param listener
     */
    offClose(listener : OnClose){
        this.closeEvent.off(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a listener that gets triggered
     * whenever the server tolds the Databox to reload the data.
     * @param listener
     */
    onReload(listener : OnReload) : Databox {
        this.reloadEvent.on(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a once listener that gets triggered when
     * the server tolds the Databox to reload the data.
     * @param listener
     */
    onceReload(listener : OnReload) : Databox {
        this.reloadEvent.once(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Removes a listener of the reload event.
     * Can be a once or normal listener.
     * @param listener
     */
    offReload(listener : OnReload){
        this.reloadEvent.off(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a listener that gets triggered
     * whenever this Databox gets a new cud opertion.
     * @param listener
     */
    onCud(listener : OnCud) : Databox {
        this.cudEvent.on(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a once listener that gets triggered when
     * this Databox gets a new cud opertion.
     * @param listener
     */
    onceCud(listener : OnCud) : Databox {
        this.cudEvent.once(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Removes a listener of the cud event.
     * Can be a once or normal listener.
     * @param listener
     */
    offCud(listener : OnCud){
        this.cudEvent.off(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a listener that gets triggered
     * whenever this Databox has new data.
     * This includes reloads, new cud Operations (Included locally and remote),
     * or fetched data.
     * @param listener
     */

    onNewData(listener : OnNewData) : Databox {
        this.newDataEvent.on(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a once listener that gets triggered when
     * this Databox has new data.
     * This includes reloads, new cud Operations (Included locally and remote),
     * or fetched data.
     * @param listener
     */
    onceNewData(listener : OnNewData) : Databox {
        this.newDataEvent.once(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Removes a listener of the newData event.
     * Can be a once or normal listener.
     * @param listener
     */
    offNewData(listener : OnNewData){
        this.newDataEvent.off(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a listener to the mainDbStorage that gets triggered
     * whenever the data changes.
     * This includes reloads, new cud Operations,
     * new sorting, clear, copy from or fetched data.
     * @param listener
     */
    onDataChange(listener : OnDataChange) : Databox {
        this.mainDbStorage.onDataChange(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a once listener to the mainDbStorage that gets triggered
     * when the data changes.
     * This includes reloads, new cud Operations,
     * new sorting, clear, copy from or fetched data.
     * @param listener
     */
    onceDataChange(listener : OnDataChange) : Databox {
        this.mainDbStorage.onceDataChange(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Removes a listener from the dataChange
     * event on the mainDbStorage.
     * Can be a once or normal listener.
     * @param listener
     */
    offDataChange(listener : OnDataChange) : Databox {
        this.mainDbStorage.offDataChange(listener);
        return this;
    }
}