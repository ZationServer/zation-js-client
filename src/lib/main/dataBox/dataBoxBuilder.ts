/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import DataBox, {DataBoxOptions}       from "./dataBox";
import {Zation}                   from "../../core/zation";
import {DbStorageOptions}         from "./storage/dbStorage";
import {WaitForConnectionOption}  from "../utils/connectionUtils";

export default class DataBoxBuilder {

    private readonly zation : Zation;
    private readonly name : string;
    private readonly id ?: string;
    private readonly dbOptions : DataBoxOptions;

    constructor(zation : Zation,name : string,id ?: string){
        this.zation = zation;
        this.name = name;
        this.id = id;
        this.dbOptions = {};
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Activates that the DataBox automatically fetch data after the first connection.
     * @default true
     * @param autoFetch
     */
    autoFetch(autoFetch : boolean) : DataBoxBuilder {
        this.dbOptions.autoFetch = autoFetch;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * The fetch input data for the auto fetch.
     * @default undefined
     * @param data
     */
    autoFetchData(data : any) : DataBoxBuilder {
        this.dbOptions.autoFetchData = data;
        return this;
    }

    /**
     * The API level of this client for the DataBox connection request.
     * If you don't provide one, the server will use the connection API
     * level or the default API level.
     * @default undefined
     * @param apiLevel
     */
    apiLevel(apiLevel : number | undefined) : DataBoxBuilder {
        this.dbOptions.apiLevel = apiLevel;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * The main DataBox storage options.
     * Change this option only if you know what you are doing.
     * If you want to have a Storage that only does updates,
     * it is recommended to connect a new DbStorage to the DataBox and
     * copy the data from the main storage.
     * @default {}
     * @param options
     */
    mainStorageOptions(options : DbStorageOptions) : DataBoxBuilder {
        this.dbOptions.mainStorageOptions = options;
        return this;
    }

    /**
     * With the WaitForConnection option, you can activate that the socket is
     * trying to connect when it is not connected.
     * This option will be used when you try to connect to the DataBox.
     * Because then the socket needs to be connected.
     * You have four possible choices:
     * Undefined: It will use the value from the default options.
     * False: The action will fail and throw a ConnectionRequiredError,
     * when the socket is not connected.
     * For the other options, it is also recommended to have activated the auto-reconnect.
     * Null: The socket will try to connect (if it is not connected) and
     * waits until the connection is made, then it continues the action.
     * Number: Same as null, but now you can specify a timeout (in ms) of
     * maximum waiting time for the connection. If the timeout is reached,
     * it will throw a timeout error.
     * @default undefined
     * @param option
     */
    waitForConnection(option : WaitForConnectionOption) : DataBoxBuilder {
        this.dbOptions.waitForConnection = option;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * With the WaitForDbConnection option, you can activate that the DataBox is
     * trying to connect (if it's not connected) whenever you want
     * to fetchData.
     * You have four possible choices:
     * Undefined: It will use the value from the default options (ZationOptions).
     * False: The action will fail and throw a ConnectionRequiredError,
     * when the DataBox is not connected.
     * For the other options, it is also recommended to have activated the auto-reconnect.
     * Null: The DataBox will try to connect (if it is not connected) and
     * waits until the connection is made, then it continues the action.
     * Number: Same as null, but now you can specify a timeout (in ms) of
     * maximum waiting time for the connection. If the timeout is reached,
     * it will throw a timeout error.
     * @default undefined
     */
    waitForDbConnection(option : WaitForConnectionOption) : DataBoxBuilder {
        this.dbOptions.waitForDbConnection = option;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * The init data that the DataBox is sent to the server
     * when it's creating a connection.
     * @default undefined
     * @param data
     */
    initData(data : any) : DataBoxBuilder {
        this.dbOptions.initData = data;
        return this;
    }

    /**
     * Builds the DataBox connect it and returns it.
     */
    async get() : Promise<DataBox> {
        const dataBox = new DataBox(this.zation,this.dbOptions,this.name,this.id);
        await dataBox.connect();
        return dataBox;
    }
}