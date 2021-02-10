/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {
    CudPackage,
    CudType,
    DATABOX_START_INDICATOR,
    DataboxConnectReq,
    DataboxConnectRes,
    DbClientInputAction,
    DbClientInputFetchPackage,
    DbClientInputFetchResponse,
    DbClientInputPackage,
    DBClientInputSessionTarget,
    DbClientInputSignalPackage,
    DbClientOutputClosePackage,
    DbClientOutputCudPackage,
    DbClientOutputEvent,
    DbClientOutputKickOutPackage,
    DbClientOutputPackage,
    DbClientOutputReloadPackage,
    DbClientOutputSignalPackage,
    DbProcessedSelector,
    DbSelector,
    DeleteArgs,
    IfOption,
    InfoOption,
    InsertArgs,
    LocalCudOperation,
    PotentialInsertOption,
    PotentialUpdateOption,
    TimestampOption,
    UpdateArgs
} from "./dbDefinitions";
import {Socket}                                                 from "../sc/socket";
import DbStorage, {DbStorageOptions, OnDataChange, OnDataTouch} from "./storage/dbStorage";
import DbFetchHistoryManager                                    from "./dbFetchHistoryManager";
import ObjectUtils                                              from "../utils/objectUtils";
import {ZationClient}                                           from "../../core/zationClient";
import ConnectionUtils, {ConnectTimeoutOption}                  from "../utils/connectionUtils";
import EventManager                                             from "../utils/eventManager";
import {RawError}                                               from "../error/rawError";
import {ErrorName}                                              from "../definitions/errorName";
import DbsHead                                                  from "./storage/components/dbsHead";
import DbUtils                                                  from "./dbUtils";
import {InvalidInputError}                                      from "../../main/error/invalidInputError";
import afterPromise                                             from "../utils/promiseUtils";
import DbLocalCudOperationSequence                              from "./dbLocalCudOperationSequence";
import {TinyEmitter}                                            from "tiny-emitter";
import {createSimpleModifyToken}                                from "./storage/modifyToken";
import {deepCloneInstance}                                      from "../utils/cloneUtils";
import LocalCudOperationsMemory                                 from "./localCudOperationsMemory";
import {Logger}                                                 from "../logger/logger";
import {ImmutableJson}                                          from "../utils/typeUtils";
import SyncLock                                                 from '../utils/syncLock';
import {getReloadStrategyBuilder, ReloadStrategy}               from './reloadStrategy/reloadStrategy';
import {buildHistoryBasedStrategy}                              from './reloadStrategy/historyBasedStrategy';

export interface DataboxOptions {
    /**
     * Activates that the Databox automatically fetch data after the first connection.
     * @default true
     */
    autoFetch?: boolean;
    /**
     * The fetch input data for the auto fetch.
     * @default undefined
     */
    autoFetchData?: any,
    /**
     * The API level of this client for the Databox connection request.
     * If you don't provide one, the server will use the connection API
     * level or the default API level.
     * @default undefined
     */
    apiLevel?: number | undefined;
    /**
     * The main Databox storage options.
     * Change this option only if you know what you are doing.
     * If you want to have a Storage that only does updates,
     * it is recommended to connect a new DbStorage to the Databox and
     * copy the data from the main storage.
     * @default {}
     */
    mainStorageOptions?: DbStorageOptions;
    /**
     * With the ConnectTimeout option, you can activate that the socket is
     * trying to connect when it is not connected.
     * This option will be used when you try to connect to the Databox.
     * Because then the socket needs to be connected.
     * You have five possible choices:
     * Undefined: It will use the value from the default options.
     * False: The action will fail and throw a ConnectionRequiredError,
     * when the socket is not connected.
     * Null: The socket will try to connect (if it is not connected) and
     * waits until the connection is made, then it continues the action.
     * Number: Same as null, but now you can specify a timeout (in ms) of
     * maximum waiting time for the connection. If the timeout is reached,
     * it will throw a timeout error.
     * AbortTrigger: Same as null, but now you have the possibility to abort the wait later.
     * @default undefined
     */
    connectTimeout?: ConnectTimeoutOption;
    /**
     * With the WaitForDbConnection option, you can activate that the Databox is
     * trying to connect (if it's not connected) whenever you want
     * to fetchData.
     * You have five possible choices:
     * Undefined: It will use the value from the default options (ZationClientOptions).
     * False: The action will fail and throw a ConnectionRequiredError,
     * when the Databox is not connected.
     * For the other options, it is also recommended to have activated the auto-reconnect.
     * Null: The Databox will try to connect (if it is not connected) and
     * waits until the connection is made, then it continues the action.
     * Number: Same as null, but now you can specify a timeout (in ms) of
     * maximum waiting time for the connection. If the timeout is reached,
     * it will throw a timeout error.
     * AbortTrigger: Same as null, but now you have the possibility to abort the wait later.
     * @default undefined
     */
    databoxConnectTimeout?: ConnectTimeoutOption;
    /**
     * The options that the Client Databox will send to the server
     * side when creating the connection.
     * On the server-side, the options can be accessed.
     * @default undefined
     */
    remoteOptions?: any;
    /**
     * Defines the reload strategy that the Databox uses to
     * reload the current and missed data.
     * If not specified the defined strategy on the server-side will be used.
     * If the server-side has not defined strategy, the history-based strategy is used.
     */
    reloadStrategy?: ReloadStrategy;
}

interface RequiredDbOptions extends DataboxOptions {
    autoFetch: boolean;
    autoFetchData: any;
    apiLevel: number | undefined;
    mainStorageOptions: DbStorageOptions;
    connectTimeout: ConnectTimeoutOption;
    databoxConnectTimeout: ConnectTimeoutOption;
    remoteOptions: any;
}

type OnConnect     = () => void | Promise<void>;
type OnDisconnect  = (fromClient: boolean) => void | Promise<void>;
type OnKickOut     = (code: number | string | undefined,data: any) => void | Promise<void>
type OnClose       = (code: number | string | undefined,data: any) => void | Promise<void>
type OnReload      = (code: number | string | undefined,data: any) => void | Promise<void>
type OnCud         = (cudPackage: CudPackage) => void | Promise<void>
type OnNewData     = (db: Databox) => void | Promise<void>
type OnSignal      = (data: any) => void | Promise<void>

export default class Databox {

    private readonly identifier: string;
    private member: string | undefined;
    private readonly apiLevel: number | undefined;
    private readonly socket: Socket;
    private readonly client: ZationClient;

    private readonly dbStorages: Set<DbStorage> = new Set<DbStorage>();
    private readonly mainDbStorage: DbStorage;
    private readonly tmpReloadDataSets: Set<DbsHead> = new Set<DbsHead>();
    private readonly fetchHistoryManager: DbFetchHistoryManager = new DbFetchHistoryManager();
    private readonly tmpReloadStorage: DbStorage;
    private readonly receivedSignalEmitter: TinyEmitter = new TinyEmitter();

    private readonly remoteOptions: any;

    private initialized: boolean = false;
    private token: string | undefined = undefined;

    private readonly localCudOperationsMemory: LocalCudOperationsMemory = new LocalCudOperationsMemory();

    private lastRemoteInitialData: any;

    /**
     * The current cud id of this Databox.
     */
    private cudId: string | undefined = undefined;
    /**
     * The last server side cud id.
     */
    private serverSideCudId: string | undefined = undefined;

    private disconnectTimestamp?: number;

    private reloadProcessPromise: Promise<void> = Promise.resolve();
    private reloadStrategy: ReloadStrategy;
    private readonly explicitClientReloadStrategy: boolean;

    private remoteCudSyncLock: SyncLock = new SyncLock();

    private inputChannel: string;
    private outputChannel: string;
    private unregisterSocketStateListener: (() => void) | undefined = undefined;
    private parallelFetch: boolean;
    private connected: boolean = false;
    private tokenReloadActive: boolean = false;

    private connectEvent: EventManager<OnConnect> = new EventManager();
    private disconnectEvent: EventManager<OnDisconnect> = new EventManager();
    private kickOutEvent: EventManager<OnKickOut> = new EventManager();
    private closeEvent: EventManager<OnClose> = new EventManager();
    private reloadEvent: EventManager<OnReload> = new EventManager();
    private cudEvent: EventManager<OnCud> = new EventManager();
    private newDataEvent: EventManager<OnNewData> = new EventManager();

    private readonly dbOptions: RequiredDbOptions = {
        autoFetch: true,
        autoFetchData: undefined,
        mainStorageOptions: {},
        apiLevel: undefined,
        connectTimeout: undefined,
        databoxConnectTimeout: undefined,
        remoteOptions: undefined
    };

    constructor(client: ZationClient, identifier: string, options: DataboxOptions) {
        ObjectUtils.addObToOb(this.dbOptions, options, true);
        this.socket = client.socket;
        this.client = client;
        this.apiLevel = this.dbOptions.apiLevel;
        this.identifier = identifier;
        this.remoteOptions = this.dbOptions.remoteOptions;

        this.explicitClientReloadStrategy = this.dbOptions.reloadStrategy != null;
        this.reloadStrategy = this.dbOptions.reloadStrategy != null ? this.dbOptions.reloadStrategy :
            buildHistoryBasedStrategy();

        const tmpRestoreStorageOptions: DbStorageOptions = {
            doAddFetchData: true,
            doUpdate: true,
            doDelete: true,
            doInsert: true
        };
        ObjectUtils.addObToOb(tmpRestoreStorageOptions, this.dbOptions.mainStorageOptions);
        this.tmpReloadStorage = new DbStorage(tmpRestoreStorageOptions);
        this.mainDbStorage = new DbStorage(this.dbOptions.mainStorageOptions);
        this.dbStorages.add(this.mainDbStorage);
    }

    /**
     * @internal
     * Applies the remote initial data on the db storages.
     * @private
     */
    private _applyRemoteInitialData(initialData): void {
        for (const dbStorage of this.dbStorages) {
            if(dbStorage.shouldApplyRemoteInitialData())
                dbStorage.setInitialData(initialData);
        }
        if(this.tmpReloadStorage.shouldApplyRemoteInitialData())
            this.tmpReloadStorage.setInitialData(initialData);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * This method will disconnect the connection to the Databox.
     * It will clean the used memory, remove all listeners,
     * and tell the server to close this Databox connection.
     * You should call this method whenever you no longer need this Databox.
     * But you able to connect later again by calling the connect method.
     * @param clearStorages
     * @param clearLocalCudOperations
     * Indicates if the local cud operations in memory should be cleared.
     */
    async disconnect(clearStorages: boolean = true, clearLocalCudOperations: boolean = true) {
        let disconnectResp;
        if (this.connected) {
            disconnectResp = new Promise<void>((res) => {
                this.socket.emit(this.inputChannel, {
                    a: DbClientInputAction.disconnect
                } as DbClientInputPackage, () => res());
            });
        }
        this._clearListenersAndReset();
        if (clearStorages) {
            this.clearStorages();
        }
        if(clearLocalCudOperations){
            this.clearLocalCudOperations();
        }
        await disconnectResp;
        this.disconnectTimestamp = Date.now();
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
        this.initialized = false;
        this.client._getDataboxManager().delete(this);
        this.connected = false;
        this.token = undefined;
        this.cudId = undefined;
        this.serverSideCudId = undefined;
        this.fetchHistoryManager.reset();
        this.reloadProcessPromise = Promise.resolve();
    }

    /**
     * This method must be called to connect to the Databox on the server-side.
     * A member can be provided to connect to a specific member in case of a DataboxFamily.
     * If you had disconnected the Databox and want to use it again you
     * can use this method to connect it again.
     * You also can use this method to switch the member of the Databox.
     * If the Databox is already connected to another member the Databox will
     * be disconnect firstly and will then connect to the new member.
     * Whenever the connection is lost, you don't need to call that method.
     * The Databox will reconnect automatically as fast as possible.
     * @throws RawError,TimeoutError,ConnectionRequiredError,InvalidInputError,AbortSignal
     * @param member
     * The member can only be provided if you want to connect to a Databox Family.
     * @param connectTimeout
     * With the ConnectTimeout option, you can activate that the socket is
     * trying to connect when it is not connected. You have five possible choices:
     * Undefined: It will use the value from the default options
     * (DataboxOptions and last fall back is ZationClientOptions).
     * False: The action will fail and throw a ConnectionRequiredError,
     * when the socket is not connected.
     * Null: The socket will try to connect (if it is not connected) and
     * waits until the connection is made, then it continues the action.
     * Number: Same as null, but now you can specify a timeout (in ms) of
     * maximum waiting time for the connection. If the timeout is reached,
     * it will throw a timeout error.
     * AbortTrigger: Same as null, but now you have the possibility to abort the wait later.
     */
    async connect(member?: string | number,connectTimeout: ConnectTimeoutOption = undefined): Promise<void> {
        await ConnectionUtils.checkConnection(this.client,
            (connectTimeout === undefined ? this.dbOptions.connectTimeout: connectTimeout));

        member = member !== undefined ? member.toString() : member;
        if(this.initialized && member !== this.member) {
            await this.disconnect(true,true);
        }
        this.member = member;

        await this._connect();
    }

    /**
     * Process a output package.
     * @param outputPackage
     * @private
     */
    private async _processOutputPackage(outputPackage: DbClientOutputPackage) {
        switch (outputPackage.a) {
            case DbClientOutputEvent.cud:
                await this.remoteCudSyncLock.schedule(() => {
                    const cudPackage = (outputPackage as DbClientOutputCudPackage).d;
                    this._processCudPackage(cudPackage);
                    this.cudEvent.emit(cudPackage);
                });
                break;
            case DbClientOutputEvent.signal:
                const signalPackage = (outputPackage as DbClientOutputSignalPackage);
                this.receivedSignalEmitter.emit(signalPackage.s, signalPackage.d);
                break;
            case DbClientOutputEvent.close:
                const closePackage = (outputPackage as DbClientOutputClosePackage);
                await this._close(closePackage.c, closePackage.d);
                break;
            case DbClientOutputEvent.kickOut:
                const kickOutPackage = (outputPackage as DbClientOutputKickOutPackage);
                this._kickOut(kickOutPackage.c, kickOutPackage.d);
                break;
            case DbClientOutputEvent.reload:
                const reloadPackage = (outputPackage as DbClientOutputReloadPackage);
                await this._tryReload(false);
                this.reloadEvent.emit(reloadPackage.c, reloadPackage.d);
                break;
        }
    }
    private _boundProcessOutputPackage: typeof Databox['prototype']['_processOutputPackage'] =
        this._processOutputPackage.bind(this);

    private _setOutputChannel(outputCh: string) {
        if(this.outputChannel === outputCh) return;

        this._unregisterOutputChannel();
        this.outputChannel = outputCh;
        this.socket.on(this.outputChannel, this._boundProcessOutputPackage);
    }

    /**
     * Internal connect.
     * If the databox is not initialized it also initializes the databox.
     * @internal
     * @private
     */
    async _connect() {
        if (!this.initialized) {
            try {
                this._registerSocketStateHandler();
                await this._sendConnect();
                this.initialized = true;
                this.client._getDataboxManager().add(this);
            } catch (e) {
                this._clearListenersAndReset();
                if(e.name === ErrorName.InvalidInput){
                    throw new InvalidInputError('Invalid init input. Failed to connect to the Databox.',e);
                }
                else {
                    throw new RawError('Failed to connect to the Databox.', e);
                }
            }

            if (this.dbOptions.autoFetch) {
                await this.fetch(this.dbOptions.autoFetchData);
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
        await this._sendConnect();
        await this._checkCudUpToDate();
    }

    /**
     * Sends a connect request to the Databox on the server-side.
     * @private
     */
    private async _sendConnect(withToken: boolean = true) {

        const currentToken = this.token;
        const tokenExists = currentToken !== undefined;
        const sendToken = withToken && tokenExists;

        return new Promise<void>((resolve, reject) => {
            this.socket.emit(DATABOX_START_INDICATOR, {
                a: this.apiLevel,
                d: this.identifier,
                ...(this.member !== undefined ? {m: this.member}: {}),
                ...(sendToken ? ({t: currentToken}) :
                    (this.remoteOptions !== undefined ? {o: this.remoteOptions}: {}))
            } as DataboxConnectReq, async (err, res: DataboxConnectRes) => {

                if (err) {
                    if(err.name === ErrorName.InvalidToken && sendToken) {
                        try {
                            return await this._sendConnect(false);
                        }
                        catch (innerErr) {err = innerErr;}
                    }
                    return reject(err);
                }

                this.connected = true;

                this.serverSideCudId = res.lc;
                if (this.cudId === undefined) {
                    //first register
                    this.cudId = res.lc;
                }

                this.inputChannel = res.i;
                this._setOutputChannel(res.o);
                this.parallelFetch = res.p;

                if(res.id !== undefined) {
                    this.lastRemoteInitialData = res.id;
                    this._applyRemoteInitialData(res.id);
                }

                if(res.rs && !this.explicitClientReloadStrategy) {
                    try {
                        const [name,options] = res.rs;
                        const strategyBuilder = getReloadStrategyBuilder(name);
                        if(strategyBuilder) this.reloadStrategy = strategyBuilder(options);
                    }
                    catch (_){}
                }

                this.connectEvent.emit();

                if (!withToken && tokenExists) {
                    // noinspection ES6MissingAwait
                    (async () => {
                        this.tokenReloadActive = true;
                        await this._tryReload(true);
                        this.tokenReloadActive = false;
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
        if (this.cudId !== this.serverSideCudId && !this.tokenReloadActive) {
            //Can not be undefined because the Databox was already registered.
            await this._tryReload(true);
        }
    }

    /**
     * Registers the socket state handler.
     * @private
     */
    private _registerSocketStateHandler() {
        const disconnectHandler = () => {
            this.connected = false;
            this.disconnectTimestamp = Date.now();
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
     * @param data
     * @param databoxConnectTimeout
     * With the DataboxConnectTimeout option, you can activate that the Databox is
     * trying to connect (if it's not connected).
     * You have five possible choices:
     * Undefined: It will use the value from the default options
     * (DataboxOptions and last fall back is ZationClientOptions).
     * False: The action will fail and throw a ConnectionRequiredError,
     * when the Databox is not connected.
     * Null: The Databox will try to connect (if it is not connected) and
     * waits until the connection is made, then it continues the action.
     * Number: Same as null, but now you can specify a timeout (in ms) of
     * maximum waiting time for the connection. If the timeout is reached,
     * it will throw a timeout error.
     * AbortTrigger: Same as null, but now you have the possibility to abort the wait later.
     * @param addToHistory
     * Indicates if this fetch should be added to the history.
     * You can deactivate this in some cases
     * if you don't want to reload this fetch later (In case of cud missed).
     * But this only will work fine if your fetches
     * do not depend on each other.
     * @throws ConnectionRequiredError,TimeoutError,RawError,InvalidInputError,AbortSignal
     * To react to the error, you can use the DbError class.
     */
    async fetch(data?: any, databoxConnectTimeout: ConnectTimeoutOption = undefined, addToHistory: boolean = true): Promise<void> {
        await ConnectionUtils.checkDbConnection
        (this, this.client, (databoxConnectTimeout === undefined ? this.dbOptions.databoxConnectTimeout: databoxConnectTimeout));

        return this.remoteCudSyncLock.schedule<void>(async () => {
            try {
                const resp = await this._fetch(data, DBClientInputSessionTarget.mainSession);

                if(addToHistory){
                    this.fetchHistoryManager.pushHistory(resp.c, data, resp.d, resp.ti);
                }

                const dbsHead = new DbsHead(resp.d,resp.ti);
                const counter = resp.c;

                let needCloneHead = this.dbStorages.size > 1;
                for (let dbStorage of this.dbStorages) {
                    if (dbStorage.shouldAddFetchData(counter,dbsHead)) {
                        dbStorage._addDataHead(needCloneHead ? deepCloneInstance(dbsHead): dbsHead);
                    }
                }
                this.newDataEvent.emit(this);
            } catch (e) {
                if(e.name === ErrorName.InvalidInput) {
                    throw new InvalidInputError('Invalid fetch input.',e);
                }
                else {
                    throw new RawError('Fetch new data failed.', e);
                }
            }
        });
    }

    /**
     * Sends a fetch request to the server.
     * @param input
     * @param sessionTarget
     * @private
     */
    private async _fetch(input: any, sessionTarget: DBClientInputSessionTarget): Promise<DbClientInputFetchResponse> {
        return new Promise<DbClientInputFetchResponse>((resolve, reject) => {
            this.socket.emit(this.inputChannel, {
                i: input,
                a: DbClientInputAction.fetch,
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
     * Executes a reload fetch.
     * @param input
     * @private
     */
    private async _reloadFetch(input?: any): Promise<{data: DbsHead, counter: number} | null> {
        return this.remoteCudSyncLock.schedule<{data: DbsHead, counter: number} | null>(async () => {
            try {
                const fetchResult = await this._fetch(input, DBClientInputSessionTarget.reloadSession);
                const dbsHead = new DbsHead(fetchResult.d,fetchResult.ti);
                this.tmpReloadDataSets.add(dbsHead);
                return {data: dbsHead, counter: fetchResult.c};
            } catch (err) {
                if ((err.name as ErrorName) !== ErrorName.NoData) {
                    throw err;
                }
                else return null;
            }
        })
    }
    private readonly _boundReloadFetch: typeof Databox['prototype']['_reloadFetch'] = this._reloadFetch.bind(this);


    /**
     * Resets the databox by disconnect and connect again.
     * @throws RawError,TimeoutError,ConnectionRequiredError
     * @param clearLocalCudOperations
     * Indicates if the local cud operations in memory should be cleared.
     */
    async reset(clearLocalCudOperations: boolean = true) {
        await this.disconnect(true,clearLocalCudOperations);
        await this.connect(this.member);
    }

    /**
     * Reloads the current data or missed data by using the reload strategy.
     * @param databoxConnectTimeout
     * With the DataboxConnectTimeout option, you can activate that the Databox is
     * trying to connect (if it's not connected).
     * You have five possible choices:
     * Undefined: It will use the value from the default options
     * (DataboxOptions and last fall back is ZationClientOptions).
     * False: The action will fail and throw a ConnectionRequiredError,
     * when the Databox is not connected.
     * Null: The Databox will try to connect (if it is not connected) and
     * waits until the connection is made, then it continues the action.
     * Number: Same as null, but now you can specify a timeout (in ms) of
     * maximum waiting time for the connection. If the timeout is reached,
     * it will throw a timeout error.
     * AbortTrigger: Same as null, but now you have the possibility to abort the wait later.
     * @throws ConnectionRequiredError,TimeoutError,RawError,InvalidInputError,AbortSignal
     */
    async reload(databoxConnectTimeout: ConnectTimeoutOption = false) {
        return this._reload(false,databoxConnectTimeout);
    }

    /**
     * Reloads the current data or missed data by using the reload strategy.
     * @internal
     * @param reconnectReload
     * @param databoxConnectTimeout
     * @private
     */
    private async _reload(reconnectReload: boolean,databoxConnectTimeout: ConnectTimeoutOption = false) {
        await ConnectionUtils.checkDbConnection(this, this.client, databoxConnectTimeout);
        const reloadPromise: Promise<void> = afterPromise(this.reloadProcessPromise, async () => {
            const tmpCudId = this.cudId;
            await this.sendSessionAction(DbClientInputAction.resetSession, DBClientInputSessionTarget.reloadSession);
            try {
                const result = await this.reloadStrategy({
                    history: this.fetchHistoryManager.getHistory(),
                    currentData: this.data,
                    disconnectedTimestamp: reconnectReload ? this.disconnectTimestamp : undefined,
                    parallelFetch: this.parallelFetch,
                    reloadFetch: this._boundReloadFetch
                })

                const missedHistory = this.fetchHistoryManager.getHistory();
                for (let i = 0; i < missedHistory.length; i++) {
                    result.push(new DbsHead(missedHistory[i].data, missedHistory[i].dataTimestamp));
                }

                // Lock the transform of reload-DbsHeads into storage and apply storage.
                // To avoid missing incoming cud events on reloaded data
                await this.remoteCudSyncLock.schedule(async () => {
                    this.tmpReloadDataSets.clear();
                    this.tmpReloadStorage.clear();

                    for (let i = 0; i < result.length; i++)
                        this.tmpReloadStorage.addData(result[i]);

                    //re-execute local cud operations.
                    const localCudOperations = this.localCudOperationsMemory.getAll();
                    for(let i = 0; i < localCudOperations.length; i++){
                        this.tmpReloadStorage._executeLocalCudOperation(localCudOperations[i],true);
                    }

                    await this.sendSessionAction(DbClientInputAction.copySession, DBClientInputSessionTarget.reloadSession);
                    this._reloadStorages(this.tmpReloadStorage);
                })

                this.fetchHistoryManager.done();
                this.newDataEvent.emit(this);

                //Check is not updated from cud event.
                if (tmpCudId === this.cudId) {
                    await this._updateCudId();
                }
            } catch (e) {
                this.fetchHistoryManager.done();
                this.tmpReloadDataSets.clear();
                if(e.name === ErrorName.InvalidInput){
                    throw new InvalidInputError('Invalid fetch input in the reload process.',e);
                }
                else {
                    throw new RawError('Fetch data to reload failed.', e);
                }
            }
        });
        this.reloadProcessPromise = reloadPromise;
        await reloadPromise;
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
     * @private
     */
    private async _tryReload(reconnectReload: boolean) {
        try {
            await this._reload(reconnectReload);
        } catch (e) {
            if(this.client.isDebug())
                Logger.printError('Failed to reload databox: ',e);
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
                    resolve();
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
        const operations = cudPackage.o;
        for (let dbStorage of this.dbStorages) {
            dbStorage.startCudSeq();
        }
        for (let i = 0; i < operations.length; i++) {
            const operation = operations[i];
            const {s, v, c, d} = operation;
            switch (operation.t) {
                case CudType.update:
                    this._remoteUpdate(s, v, {
                        timestamp,
                        code: c,
                        data: d,
                        if: operation.i,
                        potentialInsert: !!operation.p
                    });
                    break;
                case CudType.insert:
                    this._remoteInsert(s, v, {
                        timestamp,
                        code: c,
                        data: d,
                        if: operation.i,
                        potentialUpdate: !!operation.p
                    });
                    break;
                case CudType.delete:
                    this._remoteDelete(s, {
                        timestamp,
                        code: c,
                        data: d,
                        if: operation.i,
                    });
                    break;
            }
        }
        for (let dbStorage of this.dbStorages) {
            dbStorage.endCudSeq();
        }
    }

    /**
     * Handler for kickOut.
     * @private
     */
    private _kickOut(code: number | string | undefined, data: any) {
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
     * Unregisters the output handler.
     * @private
     */
    private _unregisterOutputChannel() {
        if(this.outputChannel != null)
            this.socket.off(this.outputChannel, this._boundProcessOutputPackage);
    }

    /**
     *
     * @param reloadStorage
     * @private
     */
    private _reloadStorages(reloadStorage: DbStorage) {
        for (let dbStorage of this.dbStorages) {
            dbStorage.reload(reloadStorage);
        }
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns the last added local cud operations.
     */
    public getLastLocalCudOperations(): LocalCudOperation[] {
        return this.localCudOperationsMemory.getLast();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Removes local cud operations from memory.
     * That means that the operations will no longer
     * re-executed after a reload of the databox.
     * @param operations
     */
    public removeLocalCudOperations(operations: LocalCudOperation[]): Databox {
        this.localCudOperationsMemory.remove(operations);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Clears the local cud operations memory.
     * That means that the operations will no longer
     * re-executed after a reload of the databox.
     */
    public clearLocalCudOperations(): Databox {
        this.localCudOperationsMemory.clear();
        return this;
    }

    /**
     * Do an insert operation.
     * Notice that this cud operation is executed only locally and
     * only affects this specific databox instance.
     * If the parameter keepInMemory is true and the databox reloads the data from
     * the server-side, all local cud operations will be re-executed.
     * Otherwise, the changes are also lost in the case of a reload.
     * If you want to do more changes, you should look at the seqEdit method.
     * Insert behavior:
     * Notice that in every case, the insert only happens when the key
     * does not exist on the client.
     * Otherwise, the client will ignore or convert it to an
     * update when potentiallyUpdate is active.
     * Other conditions are that the timeout is newer than the existing
     * timeout and all if conditions are true.
     * Head (with selector [] or '') -> Inserts the value.
     * KeyArray -> Inserts the value at the end with the key.
     * But if you are using a compare function, it will insert the value in the correct position.
     * Object -> Insert the value with the key.
     * Array -> Key will be parsed to int if it is a number, then it will be inserted at the index.
     * Otherwise, it will be inserted at the end.
     * @param selector
     * The selector describes which key-value pairs should be
     * deleted updated or where a value should be inserted.
     * It can be a string array key path, but it also can contain
     * filter queries (they work with the forint library).
     * You can filter by value ($value or property value) by key ($key or property key) or
     * select all keys with {} (For better readability use the constant $all).
     * In the case of insertions, most times, the selector should end with
     * a new key instead of a query.
     * Notice that all numeric values in the selector will be converted to a
     * string because all keys need to be from type string.
     * If you provide a string instead of an array, the string will be
     * split by dots to create a string array.
     * @param value
     * @param options
     * @param keepInMemory
     * Indicates if the cud operation should be kept in memory.
     * In the case of a reload, the databox is then able to re-execute
     * all cud operations to prevent that the changes are lost.
     * It's also possible to remove the cud operations later manually from memory.
     * This can be done with the methods: getLastLocalCudOperations and removeLocalCudOperations.
     */
    insert(selector: DbSelector, value: any, options: IfOption & PotentialUpdateOption & InfoOption & TimestampOption = {}, keepInMemory: boolean = true): Databox {
        const timestampTmp = options.timestamp;
        options.timestamp = DbUtils.processTimestamp(timestampTmp);
        options.if = DbUtils.processIfOption(options.if);
        const processedSelector = DbUtils.processSelector(selector);

        for (let dbStorage of this.dbStorages) {
            dbStorage._insert(processedSelector, value, options as (InsertArgs & InfoOption));
        }

        if(keepInMemory){
            this.localCudOperationsMemory.add({
                type: CudType.insert,
                selector: processedSelector,
                value: value,
                code: options.code,
                data: options.data,
                if: options.if,
                potential: options.potentialUpdate,
                timestamp: timestampTmp
            });
        }
        return this;
    }

    /**
     * @internal
     * Internal used insert method (remote cud).
     * Please use the normal method without a pre underscore.
     * @param selector
     * @param value
     * @param options
     * @private
     */
    _remoteInsert(selector: DbProcessedSelector, value: any, options: InsertArgs & InfoOption): void {
        for (let dbStorage of this.dbStorages) {
            dbStorage._insert(selector, value, options);
        }
        for (let dataSet of this.tmpReloadDataSets) {
            dataSet.insert(selector, value, options, createSimpleModifyToken());
        }
        this.newDataEvent.emit(this);
    }

    /**
     * Do an update operation.
     * Notice that this cud operation is executed only locally and
     * only affects this specific databox instance.
     * If the parameter keepInMemory is true and the databox reloads the data from
     * the server-side, all local cud operations will be re-executed.
     * Otherwise, the changes are also lost in the case of a reload.
     * If you want to do more changes, you should look at the seqEdit method.
     * Update behavior:
     * Notice that in every case, the update only happens when the key
     * on the client does exist.
     * Otherwise, the client will ignore or convert it to an
     * insert when potentiallyInsert is active.
     * Other conditions are that the timeout is newer than the existing
     * timeout and all if conditions are true.
     * Head (with selector [] or '') -> Updates the complete structure.
     * KeyArray -> Updates the specific value.
     * Object -> Updates the specific value.
     * Array -> Key will be parsed to int if it is a number
     * it will update the specific value.
     * @param selector
     * The selector describes which key-value pairs should be
     * deleted updated or where a value should be inserted.
     * It can be a string array key path, but it also can contain
     * filter queries (they work with the forint library).
     * You can filter by value ($value or property value) by key ($key or property key) or
     * select all keys with {} (For better readability use the constant $all).
     * In the case of insertions, most times, the selector should end with
     * a new key instead of a query.
     * Notice that all numeric values in the selector will be converted to a
     * string because all keys need to be from type string.
     * If you provide a string instead of an array, the string will be
     * split by dots to create a string array.
     * @param value
     * @param options
     * @param keepInMemory
     * Indicates if the cud operation should be kept in memory.
     * In the case of a reload, the databox is then able to re-execute
     * all cud operations to prevent that the changes are lost.
     * It's also possible to remove the cud operations later manually from memory.
     * This can be done with the methods: getLastLocalCudOperations and removeLocalCudOperations.
     */
    update(selector: DbSelector, value: any, options: IfOption & PotentialInsertOption & InfoOption & TimestampOption = {}, keepInMemory: boolean = true): Databox {
        const timestampTmp = options.timestamp;
        options.timestamp = DbUtils.processTimestamp(timestampTmp);
        options.if = DbUtils.processIfOption(options.if);
        const processedSelector = DbUtils.processSelector(selector);

        for (let dbStorage of this.dbStorages) {
            dbStorage._update(processedSelector, value, options as (UpdateArgs & InfoOption));
        }

        if(keepInMemory){
            this.localCudOperationsMemory.add({
                type: CudType.update,
                selector: processedSelector,
                value: value,
                code: options.code,
                data: options.data,
                if: options.if,
                potential: options.potentialInsert,
                timestamp: timestampTmp
            });
        }
        return this;
    }

    /**
     * @internal
     * Internal used update method (remote cud).
     * Please use the normal method without a pre underscore.
     * @param selector
     * @param value
     * @param options
     * @private
     */
    _remoteUpdate(selector: DbProcessedSelector, value: any, options: UpdateArgs & InfoOption): void {
        for (let dbStorage of this.dbStorages) {
            dbStorage._update(selector, value, options);
        }
        for (let dataSet of this.tmpReloadDataSets) {
            dataSet.update(selector, value, options, createSimpleModifyToken());
        }
        this.newDataEvent.emit(this);
    }

    /**
     * Do an delete operation.
     * Notice that this cud operation is executed only locally and
     * only affects this specific databox instance.
     * If the parameter keepInMemory is true and the databox reloads the data from
     * the server-side, all local cud operations will be re-executed.
     * Otherwise, the changes are also lost in the case of a reload.
     * If you want to do more changes, you should look at the seqEdit method.
     * Delete behavior:
     * Notice that in every case, the delete only happens when the key
     * on the client does exist.
     * Otherwise, the client will ignore it.
     * Other conditions are that the timeout is newer than the existing
     * timeout and all if conditions are true.
     * Head (with selector [] or '') -> Deletes the complete structure.
     * KeyArray -> Deletes the specific value.
     * Object -> Deletes the specific value.
     * Array -> Key will be parsed to int if it is a number it
     * will delete the specific value.
     * Otherwise, it will delete the last item.
     * @param selector
     * The selector describes which key-value pairs should be
     * deleted updated or where a value should be inserted.
     * It can be a string array key path, but it also can contain
     * filter queries (they work with the forint library).
     * You can filter by value ($value or property value) by key ($key or property key) or
     * select all keys with {} (For better readability use the constant $all).
     * In the case of insertions, most times, the selector should end with
     * a new key instead of a query.
     * Notice that all numeric values in the selector will be converted to a
     * string because all keys need to be from type string.
     * If you provide a string instead of an array, the string will be
     * split by dots to create a string array.
     * @param options
     * @param keepInMemory
     * Indicates if the cud operation should be kept in memory.
     * In the case of a reload, the databox is then able to re-execute
     * all cud operations to prevent that the changes are lost.
     * It's also possible to remove the cud operations later manually from memory.
     * This can be done with the methods: getLastLocalCudOperations and removeLocalCudOperations.
     */
    delete(selector: DbSelector, options: IfOption & InfoOption & TimestampOption = {}, keepInMemory: boolean = true): Databox {
        const timestampTmp = options.timestamp;
        options.timestamp = DbUtils.processTimestamp(timestampTmp);
        options.if = DbUtils.processIfOption(options.if);
        const processedSelector = DbUtils.processSelector(selector);

        for (let dbStorage of this.dbStorages) {
            dbStorage._delete(processedSelector, options as (DeleteArgs & InfoOption));
        }

        if(keepInMemory){
            this.localCudOperationsMemory.add({
                type: CudType.delete,
                selector: processedSelector,
                code: options.code,
                data: options.data,
                if: options.if,
                timestamp: timestampTmp
            });
        }
        return this;
    }

    /**
     * @internal
     * Internal used delete method (remote cud).
     * Please use the normal method without a pre underscore.
     * @param selector
     * @param options
     * @private
     */
    _remoteDelete(selector: DbProcessedSelector, options: DeleteArgs & InfoOption): void {
        for (let dbStorage of this.dbStorages) {
            dbStorage._delete(selector, options);
        }
        for (let dataSet of this.tmpReloadDataSets) {
            dataSet.delete(selector, options, createSimpleModifyToken());
        }
        this.newDataEvent.emit(this);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Do an sequence edit.
     * Notice that this cud operations are executed only locally and
     * only affects this specific databox instance.
     * If the parameter keepInMemory is true and the databox reloads the data from
     * the server-side, all local cud operations will be re-executed.
     * Otherwise, the changes are also lost in the case of a reload.
     * @param timestamp
     * With the timestamp option, you can change the sequence of data.
     * The storage, for example, will only update data that is older as incoming data.
     * Use this option only if you know what you are doing.
     * @param keepInMemory
     * Indicates if the cud operation should be kept in memory.
     * In the case of a reload, the databox is then able to re-execute
     * all cud operations to prevent that the changes are lost.
     * It's also possible to remove the cud operations later manually from memory.
     * This can be done with the methods: getLastLocalCudOperations and removeLocalCudOperations.
     */
    seqEdit(timestamp?: number, keepInMemory: boolean = true): DbLocalCudOperationSequence {
        return new DbLocalCudOperationSequence(timestamp,(operations) => {
            const operationLength = operations.length;
            for (let dbStorage of this.dbStorages) {
                dbStorage.startCudSeq();
                for(let i = 0; i < operationLength; i++){
                    dbStorage._executeLocalCudOperation(operations[i],false);
                }
                dbStorage.endCudSeq();
            }
            if(keepInMemory) {
                this.localCudOperationsMemory.addMultiple(operations);
            }
        });
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

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns if this Databox is connected to the server-side.
     */
    isConnected(): boolean {
        return this.connected;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Databox will be internally initialized if you connect it for the first time.
     * When you disconnect it manually the internal initialization will be
     * deleted to free resources.
     * This function returns if the databox is initialized.
     */
    isInitialized(): boolean {
        return this.initialized;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns the current cud id.
     */
    getCurrentCudId(): string | undefined {
        return this.cudId;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns the current member.
     */
    getCurrentMember(): string | undefined {
        return this.member;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Connect a new Storage to the Databox.
     * @param dbStorage
     */
    connectStorage(dbStorage: DbStorage): Databox {
        if(dbStorage.shouldApplyRemoteInitialData())
            dbStorage.setInitialData(this.lastRemoteInitialData);
        this.dbStorages.add(dbStorage);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Disconnect a Storage from the Databox.
     * @param dbStorage
     */
    disconnectStorage(dbStorage: DbStorage): Databox {
        this.dbStorages.delete(dbStorage);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns the data from the main storage.
     * Notice that the return value is deep read-only.
     * It is forbidden to modify directly on the storage data because
     * it can break the whole storage.
     * If you need to modify the data you can use the getDataClone method.
     */
    get data(): ImmutableJson {
        return this.mainDbStorage.data;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns a clone of the data from the main storage.
     */
    getDataClone<T = any>(): T {
        return this.mainDbStorage.getDataClone<T>();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Transmit a signal to the connected Databox on the server-side.
     * The Databox on the server-side can react to any received signal.
     * You also can send additional data with the signal.
     * @param signal
     * @param data
     * @param databoxConnectTimeout
     * With the DataboxConnectTimeout option, you can activate that the Databox is
     * trying to connect (if it's not connected).
     * You have five possible choices:
     * Undefined: It will use the value from the default options
     * (DataboxOptions and last fall back is ZationClientOptions).
     * False: The action will fail and throw a ConnectionRequiredError,
     * when the Databox is not connected.
     * Null: The Databox will try to connect (if it is not connected) and
     * waits until the connection is made, then it continues the action.
     * Number: Same as null, but now you can specify a timeout (in ms) of
     * maximum waiting time for the connection. If the timeout is reached,
     * it will throw a timeout error.
     * AbortTrigger: Same as null, but now you have the possibility to abort the wait later.
     * @throws ConnectionRequiredError,TimeoutError,AbortSignal
     */
    async transmitSignal(signal: string, data?: any, databoxConnectTimeout: ConnectTimeoutOption = false): Promise<void> {
        await ConnectionUtils.checkDbConnection(this, this.client, databoxConnectTimeout);
        this.socket.emit(this.inputChannel, {
            a: DbClientInputAction.signal,
            s: signal,
            d: data
        } as DbClientInputSignalPackage);
    }

    //events
    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a listener that gets triggered
     * whenever the Databox is connected to the server.
     * That also includes reconnections.
     * @param listener
     */
    onConnect(listener: OnConnect): Databox {
        this.connectEvent.on(listener);
        return this;
    }

    /**
     * Adds a once listener that gets triggered when
     * the Databox is connected to the server.
     * That also includes reconnections.
     * @param listener
     */
    onceConnect(listener: OnConnect): Databox {
        this.connectEvent.once(listener);
        return this;
    }

    /**
     * Removes a listener of the connect event.
     * Can be a once or normal listener.
     * @param listener
     */
    offConnect(listener: OnConnect){
        this.connectEvent.off(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a listener that gets triggered
     * whenever the Databox is disconnected from the server.
     * @param listener
     */
    onDisconnect(listener: OnDisconnect): Databox {
        this.disconnectEvent.on(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a once listener that gets triggered when
     * the Databox is disconnected from the server.
     * @param listener
     */
    onceDisconnect(listener: OnDisconnect): Databox {
        this.disconnectEvent.once(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Removes a listener of the disconnect event.
     * Can be a once or normal listener.
     * @param listener
     */
    offDisconnect(listener: OnDisconnect){
        this.disconnectEvent.off(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a listener that gets triggered
     * whenever the socket is kicked out from the Databox.
     * @param listener
     */
    onKickOut(listener: OnKickOut): Databox {
        this.kickOutEvent.on(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a once listener that gets triggered when
     * the socket is kicked out from the Databox.
     * @param listener
     */
    onceKickOut(listener: OnKickOut): Databox {
        this.kickOutEvent.once(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Removes a listener of the kickOut event.
     * Can be a once or normal listener.
     * @param listener
     */
    offKickOut(listener: OnKickOut){
        this.kickOutEvent.off(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a listener that gets triggered
     * whenever the server closes the Databox.
     * @param listener
     */
    onClose(listener: OnClose): Databox {
        this.closeEvent.on(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a once listener that gets triggered when
     * the server closes the Databox.
     * @param listener
     */
    onceClose(listener: OnClose): Databox {
        this.closeEvent.once(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Removes a listener of the close event.
     * Can be a once or normal listener.
     * @param listener
     */
    offClose(listener: OnClose){
        this.closeEvent.off(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a listener that gets triggered whenever the
     * server told the Databox to reload the data.
     * @param listener
     */
    onReload(listener: OnReload): Databox {
        this.reloadEvent.on(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a once listener that gets triggered when
     * the server told the Databox to reload the data.
     * @param listener
     */
    onceReload(listener: OnReload): Databox {
        this.reloadEvent.once(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Removes a listener of the reload event.
     * Can be a once or normal listener.
     * @param listener
     */
    offReload(listener: OnReload){
        this.reloadEvent.off(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a listener that gets triggered
     * whenever this Databox gets a new cud operation.
     * @param listener
     */
    onCud(listener: OnCud): Databox {
        this.cudEvent.on(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a once listener that gets triggered when
     * this Databox gets a new cud operation.
     * @param listener
     */
    onceCud(listener: OnCud): Databox {
        this.cudEvent.once(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Removes a listener of the cud event.
     * Can be a once or normal listener.
     * @param listener
     */
    offCud(listener: OnCud){
        this.cudEvent.off(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a listener that gets triggered
     * whenever this Databox receives new data.
     * If you want to update the user interface,
     * you should use the data change event of an databox storage.
     * This includes reloads, cud operations (Included locally and remote),
     * or newly fetched data.
     * @param listener
     */
    onNewData(listener: OnNewData): Databox {
        this.newDataEvent.on(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a once listener that gets triggered
     * when this Databox receives new data.
     * If you want to update the user interface,
     * you should use the data change event of an databox storage.
     * This includes reloads, cud operations (Included locally and remote),
     * or newly fetched data.
     * @param listener
     */
    onceNewData(listener: OnNewData): Databox {
        this.newDataEvent.once(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Removes a listener of the newData event.
     * Can be a once or normal listener.
     * @param listener
     */
    offNewData(listener: OnNewData){
        this.newDataEvent.off(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a listener to the main storage that gets triggered whenever the data changes.
     * It includes any change of data (e.g., reloads, cud Operations, sorting,
     * clear, copies from other storages, or add newly fetched data).
     * Other than the data touch event, this event will only trigger
     * if the data content is changed.
     * In some cases, it uses a deep equal algorithm, but most of the
     * time (e.g., deletions, insertions, merge), a change can be
     * detected without a complex algorithm.
     * The deep equal algorithm change detection will only be used
     * if you had registered at least one listener in this event.
     * This event is perfect for updating the user interface.
     * @param listener
     * @param combineCudSeqOperations
     * With the parameter: combineCudSeqOperations,
     * you can activate that in case of a seqEdit the event triggers
     * after all operations finished.
     * For example, you do four updates then this event triggers after all four updates.
     * If you have deactivated, then it will trigger for each updater separately.
     */
    onDataChange(listener: OnDataChange,combineCudSeqOperations: boolean = true): Databox {
        this.mainDbStorage.onDataChange(listener,combineCudSeqOperations);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a once listener to the main storage that gets triggered when the data changes.
     * It includes any change of data (e.g., reloads, cud Operations, sorting,
     * clear, copies from other storages, or add newly fetched data).
     * Other than the data touch event, this event will only trigger
     * if the data content is changed.
     * In some cases, it uses a deep equal algorithm, but most of the
     * time (e.g., deletions, insertions, merge), a change can be
     * detected without a complex algorithm.
     * The deep equal algorithm change detection will only be used
     * if you had registered at least one listener in this event.
     * This event is perfect for updating the user interface.
     * @param listener
     * @param combineCudSeqOperations
     * With the parameter: combineCudSeqOperations,
     * you can activate that in case of a seqEdit the event triggers
     * after all operations finished.
     * For example, you do four updates then this event triggers after all four updates.
     * If you have deactivated, then it will trigger for each updater separately.
     */
    onceDataChange(listener: OnDataChange,combineCudSeqOperations: boolean = true): Databox {
        this.mainDbStorage.onceDataChange(listener,combineCudSeqOperations);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Removes a listener of the dataChange event
     * from the main storage.
     * Can be a once or normal listener.
     * @param listener
     */
    offDataChange(listener: OnDataChange): Databox {
        this.mainDbStorage.offDataChange(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a listener to the main storage that gets triggered whenever the data is touched.
     * It includes any touch of data (e.g., reloads, cud Operations, sorting,
     * clear, copies from other storages, or add newly fetched data).
     * Other than the data change event, this event will also trigger if the
     * data content is not changed.
     * For example, if you update the age with the value 20 to 20,
     * then the data touch event will be triggered but not the data change event.
     * @param listener
     */
    onDataTouch(listener: OnDataTouch): Databox {
        this.mainDbStorage.onDataTouch(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a once listener to the main storage that gets triggered when the data is touched.
     * It includes any touch of data (e.g., reloads, cud Operations, sorting,
     * clear, copies from other storages, or add newly fetched data).
     * Other than the data change event, this event will also trigger if the
     * data content is not changed.
     * For example, if you update the age with the value 20 to 20,
     * then the data touch event will be triggered but not the data change event.
     * @param listener
     */
    onceDataTouch(listener: OnDataTouch): Databox {
        this.mainDbStorage.onceDataTouch(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Removes a listener of the dataTouch event
     * from the main storage.
     * Can be a once or normal listener.
     * @param listener
     */
    offDataTouch(listener: OnDataTouch): Databox {
        this.mainDbStorage.offDataTouch(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a listener that gets triggered
     * whenever this Databox received a specific signal from the server-side connected Databox.
     * @param signal
     * @param listener
     */
    onReceivedSignal(signal: string, listener: OnSignal): Databox {
        this.receivedSignalEmitter.on(signal,listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a once listener that gets triggered
     * when this Databox received a specific signal from the server-side connected Databox.
     * @param signal
     * @param listener
     */
    onceReceivedSignal(signal: string, listener: OnSignal): Databox {
        this.receivedSignalEmitter.once(signal,listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Removes a listener or all listeners of a specific received signal event.
     * Can be a once or normal listener.
     * @param signal
     * @param listener
     */
    offReceivedSignal(signal: string, listener?: OnSignal): Databox {
        this.receivedSignalEmitter.off(signal,listener);
        return this;
    }

    /**
     * Cast a value to an instance of this class.
     * That can be useful if you are programming in javascript,
     * but the IDE can interpret the typescript information of this library.
     * @param value
     */
    static cast(value: any): Databox {
        return value as Databox;
    }
}