/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import Databox, {DataboxOptions}  from "./databox";
import {Zation}                   from "../../core/zation";
import {DbStorageOptions}         from "./storage/dbStorage";
import {WaitForConnectionOption}  from "../utils/connectionUtils";

export default class DataboxBuilder {

    private readonly zation : Zation;
    private readonly name : string;
    private readonly id ?: string | number;
    private readonly dbOptions : DataboxOptions;

    constructor(zation : Zation,name : string,id ?: string | number){
        this.zation = zation;
        this.name = name;
        this.id = id;
        this.dbOptions = {};
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Activates that the Databox automatically fetch data after the first connection.
     * @default true
     * @param autoFetch
     */
    autoFetch(autoFetch : boolean) : DataboxBuilder {
        this.dbOptions.autoFetch = autoFetch;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * The fetch input data for the auto fetch.
     * @default undefined
     * @param data
     */
    autoFetchData(data : any) : DataboxBuilder {
        this.dbOptions.autoFetchData = data;
        return this;
    }

    /**
     * The API level of this client for the Databox connection request.
     * If you don't provide one, the server will use the connection API
     * level or the default API level.
     * @default undefined
     * @param apiLevel
     */
    apiLevel(apiLevel : number | undefined) : DataboxBuilder {
        this.dbOptions.apiLevel = apiLevel;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * The main Databox storage options.
     * Change this option only if you know what you are doing.
     * If you want to have a Storage that only does updates,
     * it is recommended to connect a new DbStorage to the Databox and
     * copy the data from the main storage.
     * @default {}
     * @param options
     */
    mainStorageOptions(options : DbStorageOptions) : DataboxBuilder {
        this.dbOptions.mainStorageOptions = options;
        return this;
    }

    /**
     * With the WaitForConnection option, you can activate that the socket is
     * trying to connect when it is not connected.
     * This option will be used when you try to connect to the Databox.
     * Because then the socket needs to be connected.
     * You have five possible choices:
     * Undefined: It will use the value from the default options.
     * False: The action will fail and throw a ConnectionRequiredError,
     * when the socket is not connected.
     * For the other options, it is also recommended to have activated the auto-reconnect.
     * Null: The socket will try to connect (if it is not connected) and
     * waits until the connection is made, then it continues the action.
     * Number: Same as null, but now you can specify a timeout (in ms) of
     * maximum waiting time for the connection. If the timeout is reached,
     * it will throw a timeout error.
     * AbortTrigger: Same as null, but now you have the possibility to abort the wait later.
     * @default undefined
     * @param option
     */
    waitForConnection(option : WaitForConnectionOption) : DataboxBuilder {
        this.dbOptions.waitForConnection = option;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * With the WaitForDbConnection option, you can activate that the Databox is
     * trying to connect (if it's not connected) whenever you want
     * to fetchData.
     * You have five possible choices:
     * Undefined: It will use the value from the default options (ZationOptions).
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
    waitForDbConnection(option : WaitForConnectionOption) : DataboxBuilder {
        this.dbOptions.waitForDbConnection = option;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * The init data that the Databox is sent to the server
     * when it's creating a connection.
     * @default undefined
     * @param data
     */
    initData(data : any) : DataboxBuilder {
        this.dbOptions.initData = data;
        return this;
    }

    /**
     * Get the built databox.
     * @param autoConnect
     * Indicates if the databox should be directly connected,
     * then the method will return a promise with the connected databox.
     * Otherwise, it returns the unconnected databox, but synchronous.
     */
    get(autoConnect ?: boolean) : Databox
    /**
     * Get the built databox.
     * @param autoConnect
     * Indicates if the databox should be directly connected,
     * then the method will return a promise with the connected databox.
     * Otherwise, it returns the unconnected databox, but synchronous.
     */
    get(autoConnect : true) : Promise<Databox>
    /**
     * Get the built databox.
     * @param autoConnect
     * Indicates if the databox should be directly connected,
     * then the method will return a promise with the connected databox.
     * Otherwise, it returns the unconnected databox, but synchronous.
     */
    get(autoConnect : false) : Databox
    get(autoConnect : boolean = false) : Databox | Promise<Databox> {
        const databox = new Databox(this.zation,this.dbOptions,this.name,this.id);
        if(autoConnect){
            return new Promise<Databox>(async (resolve, reject) => {
                try{
                    await databox.connect();
                    resolve(databox);
                }
                catch (e) {reject(e);}
            });
        }
        else {
            return databox;
        }
    }
}