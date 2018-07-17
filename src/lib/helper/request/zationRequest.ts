/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {RequestAble}         from "../../api/requestAble";
import {ProtocolType}        from "../constants/protocolType";
import {SendAble}            from "./sendAble";

abstract class ZationRequest extends SendAble
{
    private readonly data: object | any[];
    private readonly type: ProtocolType;

    private compiledData : object | any[];

    protected constructor(data : object | any[], type : ProtocolType)
    {
        super();
        this.data = data;
        this.type = type;
    }

    getProtocol() : ProtocolType
    {
        return this.type;
    }

    async preCompile()
    {
        if(Array.isArray(this.data))
        {
            this.compiledData = await this.compileArrayData(this.data);
        }
        else
        {
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
                        res[key] = await data[key].toRequestData();
                        resolve();
                    }));
                }
                else if(typeof data === 'object') {
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
}

export = ZationRequest;

