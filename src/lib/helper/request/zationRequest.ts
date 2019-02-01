/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

// noinspection TypeScriptPreferShortImport
import {RequestAble}         from "../../api/requestAble";
// noinspection TypeScriptPreferShortImport
import {ProtocolType}        from "../constants/protocolType";
import {SendAble}            from "./sendAble";
import {ProgressHandler}     from "./progressHandler";

export abstract class ZationRequest extends SendAble
{
    private readonly data: any;
    private readonly type: ProtocolType;

    private compiledData : object | any[];
    private progressHandler: ProgressHandler | undefined = undefined;

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

    async preCompile()
    {
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

