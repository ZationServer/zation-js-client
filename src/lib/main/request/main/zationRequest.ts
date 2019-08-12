/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

// noinspection TypeScriptPreferShortImport
import {RequestAble}             from "../helper/requestAble";
// noinspection TypeScriptPreferShortImport
import {ProtocolType}            from "../../constants/protocolType";
import {SendAble}                from "../helper/sendAble";
import {ProgressHandler}         from "../helper/progressHandler";
import {WaitForConnectionOption} from "../../utils/connectionUtils";

export abstract class ZationRequest extends SendAble
{
    private readonly data: any;
    private readonly type: ProtocolType;
    protected apiLevel : number | undefined;
    private timeout : null | number | undefined = undefined;

    private compiledData : object | any[];
    private progressHandler: ProgressHandler | undefined = undefined;
    private waitForConnection : WaitForConnectionOption = undefined;

    protected constructor(data : any, type : ProtocolType)
    {
        super();
        this.data = data;
        this.type = type;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the protocol type of the request.
     */
    getProtocol() : ProtocolType {
        return this.type;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the api level of the request.
     */
    getApiLevel() : number | undefined {
        return this.apiLevel;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the timeout for the response of the request.
     * Value can be null which means the timeout is disabled or
     * undefined then it will use the default timeout of the zation config,
     * or it can be a number that indicates the milliseconds.
     */
    getTimeout(): number | null | undefined {
        return this.timeout;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the API level of the request.
     * If you don't provide one the connection API level or server default API level will be used.
     */
    setApiLevel(apiLevel : number | undefined) : void {
        this.apiLevel = apiLevel;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the timeout for the response of the request.
     * Value can be null which means the timeout is disabled or
     * undefined then it will use the default timeout of the zation config,
     * or it can be a number that indicates the milliseconds.
     * @param timeout
     */
    setTimeout(timeout : number | null | undefined): void {
        this.timeout = timeout;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the data of the request.
     */
    getData() : any {
        return this.data;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set a progress handler for the request.
     * @param pogressHandler
     */
    setProgressHandler(pogressHandler : ProgressHandler) : void {
        this.progressHandler = pogressHandler;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the progress handler of the request.
     */
    getPogressHandler() : ProgressHandler | undefined {
        return this.progressHandler;
    }

    /**
     * Returns the WaitForConnection option.
     */
    getWaitForConnection(): WaitForConnectionOption {
        return this.waitForConnection;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * With the WaitForConnection option, you can activate that the socket is
     * trying to connect when it is not connected. You have four possible choices:
     * Undefined: It will use the value from the default options.
     * False: The action will fail and throw a ConnectionRequiredError,
     * when the socket is not connected.
     * For the other options, it is also recommended to have activated the auto-reconnect.
     * Null: The socket will try to connect (if it is not connected) and
     * waits until the connection is made, then it continues the action.
     * Number: Same as null, but now you can specify a timeout (in ms) of
     * maximum waiting time for the connection. If the timeout is reached,
     * it will throw a timeout error.
     * This options is only used in the WebSocket protocol.
     * @param value
     * @default false
     */
    setWaitForConnection(value : WaitForConnectionOption) {
        this.waitForConnection = value;
    }

    async preCompile() {
        this.compiledData = this.compileValueData(this.data);
    }

    async getCompiledData(): Promise<any>
    {
        if(this.compiledData === undefined) {
            await this.preCompile();
        }
        return this.compiledData;
    }

    private async compileValueData(data : any) : Promise<any>
    {
        let promises : Promise<void>[] = [];
        if(data instanceof RequestAble) {
            promises.push(new Promise<void>(async (resolve) =>
            {
                data = await data.toRequestData(this.type);
                resolve();
            }));
        }
        else if(Array.isArray(data))
        {
            promises.push(new Promise<void>(async (resolve) => {
                data = await this.compileArrayData(data);
                resolve();
            }));
        }
        else if(typeof data === 'object') {
            promises.push(new Promise<void>(async (resolve) =>
            {
                data = await this.compileObjectData(data);
                resolve();
            }));
        }
        await Promise.all(promises);
        return data;
    }

    private async compileArrayData(data : any[]) : Promise<any[]>
    {
        let promises : Promise<void>[] = [];
        for(let i = 0; i < data.length; i++)
        {
            promises.push(new Promise<void>(async (resolve) =>
            {
                data[i] = await this.compileValueData(data[i]);
                resolve();
            }));
        }
        await Promise.all(promises);
        return data;
    }

    private async compileObjectData(data : object) : Promise<object>
    {
        let promises : Promise<void>[] = [];
        for(let key in data)
        {
            if(data.hasOwnProperty(key)) {
                promises.push(new Promise<void>(async (resolve) =>
                {
                    data[key] = await this.compileValueData(data[key]);
                    resolve();
                }));
            }
        }
        await Promise.all(promises);
        return data;
    }
}

