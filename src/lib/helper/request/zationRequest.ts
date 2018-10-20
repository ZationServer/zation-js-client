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

abstract class ZationRequest extends SendAble
{
    private readonly data: object | any[];
    private readonly type: ProtocolType;

    private compiledData : object | any[];
    private progressHandler: ProgressHandler | undefined = undefined;

    protected constructor(data : object | any[], type : ProtocolType)
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
        if(Array.isArray(this.data)) {
            this.compiledData = await this.compileArrayData(this.data);
        }
        else {
            this.compiledData = await this.compileObjectData(this.data);
        }
    }

    async getCompiledData(): Promise<object | any[]>
    {
        if(this.compiledData === undefined)
        {
            await this.preCompile();
        }

        return this.compiledData;
    }

    private async compileArrayData(data : any[]) : Promise<any[]>
    {
        let res : any[] = [];
        let promises : Promise<void>[] = [];
        for(let i in data)
        {
            if(data[i] instanceof RequestAble) {
                promises.push(new Promise<void>(async (resolve) =>
                {
                    res[i] = await data[i].toRequestData(this.type);
                    resolve();
                }));
            }
            else if(typeof data === 'object') {
                promises.push(new Promise<void>(async (resolve) =>
                {
                    res[i] = await this.compileObjectData(data[i]);
                    resolve();
                }));
            }
            else {
                res[i] = data[i];
            }
        }
        await Promise.all(promises);
        return res;
    }

    private async compileObjectData(data : object) : Promise<object>
    {
        let res = {};
        let promises : Promise<void>[] = [];
        for(let key in data)
        {
            if(data.hasOwnProperty(key)) {
                if(data[key] instanceof RequestAble) {
                    promises.push(new Promise<void>(async (resolve) =>
                    {
                        res[key] = await this.compileRequestAble(data[key]);
                        resolve();
                    }));
                }
                else if(typeof data[key] === 'object') {
                    promises.push(new Promise<void>(async (resolve) =>
                    {
                        res[key] = await this.compileObjectData(data[key]);
                        resolve();
                    }));
                }
                else {
                    res[key] = data[key];
                }
            }
        }
        await Promise.all(promises);
        return res;
    }

    private async compileRequestAble(requestAble : RequestAble) : Promise<object>
    {
        return await requestAble.toRequestData(this.type);
    }
}

export = ZationRequest;

