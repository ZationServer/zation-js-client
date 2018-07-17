/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import ResponseReactAble = require("../helper/react/responseReactAble");
import {ProtocolType}    from "../helper/constants/protocolType";
import Const             = require("../helper/constants/constWrapper");

class Response
{
    private successful = false;

    private readonly type : ProtocolType;

    private resultValues = [];
    private resultKeyValuePairs = {};
    private erros = [];

    //Part Token (ONLY HTTP)
    private newSignedToken : string | undefined = undefined;
    private newPlainToken : object | undefined = undefined;

    constructor(data,type : ProtocolType)
    {
        this.successful = false;
        this.resultValues = [];
        this.resultKeyValuePairs = {};
        this.erros = [];
        this.type = type;

        this.readData(data);
    }

    //Part Result Value

    // noinspection JSUnusedGlobalSymbols
    getMainResult() : any
    {
        return this.resultValues[0];
    }

    // noinspection JSUnusedGlobalSymbols
    hasMainResult() : boolean
    {
        return this.resultValues[0] !== undefined;
    }

    // noinspection JSUnusedGlobalSymbols
    getValueResults() : any[]
    {
        return this.resultValues;
    }

    // noinspection JSUnusedGlobalSymbols
    getValueResult(index : number) : any
    {
        return this.resultValues[index];
    }

    // noinspection JSUnusedGlobalSymbols
    hasValueResult(index : number)
    {
        return this.resultValues[index] !== undefined;
    }

    //Part Result KeyValue

    // noinspection JSUnusedGlobalSymbols
    getPairResults() : object
    {
        return this.resultKeyValuePairs;
    }

    // noinspection JSUnusedGlobalSymbols
    getPairResult(key) : any
    {
        return this.resultKeyValuePairs[key];
    }

    // noinspection JSUnusedGlobalSymbols
    hasPairResult(key) : boolean
    {
        return this.resultKeyValuePairs[key] !== undefined;
    }

    // noinspection JSUnusedGlobalSymbols
    isSuccessful() : boolean
    {
        return this.successful;
    }

    //Part Token (only http request)

    // noinspection JSUnusedGlobalSymbols
    hasNewToken() : boolean
    {
        return this.newSignedToken !== undefined && this.newPlainToken !== undefined;
    }

    // noinspection JSUnusedGlobalSymbols
    getNewSignedToken() : string | undefined
    {
        return this.newSignedToken;
    }

    // noinspection JSUnusedGlobalSymbols
    getNewPlainToken() : object | undefined
    {
        return this.newPlainToken;
    }

    //Part Errors
    // noinspection JSUnusedGlobalSymbols
    getErrors()
    {
        return this.erros;
    }

    // noinspection JSUnusedGlobalSymbols
    hasErrors()
    {
        return this.erros.length > 0;
    }

    //Part react
    react() : ResponseReactAble
    {
        return new ResponseReactAble(this);
    }

    //Part Type
    getProtocolType() : ProtocolType
    {
        return this.type;
    }

    isWsProtocolType() : boolean
    {
        return this.type === ProtocolType.WebSocket;
    }

    isHttpProtocolType() : boolean
    {
        return this.type === ProtocolType.Http;
    }

    //Part main system

    private readData(data)
    {
        if (typeof data[Const.Settings.RESPONSE.SUCCESSFUL] === 'boolean') {
            this.successful = data[Const.Settings.RESPONSE.SUCCESSFUL];
        }

        if (typeof data[Const.Settings.RESPONSE.RESULT] === 'object') {

            const res = data[Const.Settings.RESPONSE.RESULT];

            if (Array.isArray(res[Const.Settings.RESPONSE.RESULT_VALUES]))
            {
                this.resultValues = res[Const.Settings.RESPONSE.RESULT_VALUES];
            }

            if (typeof res[Const.Settings.RESPONSE.RESULT_PAIRS] === 'object')
            {
                this.resultKeyValuePairs = res[Const.Settings.RESPONSE.RESULT_PAIRS];
            }
        }

        if (Array.isArray(data[Const.Settings.RESPONSE.ERRORS]))
        {
            this.erros = data[Const.Settings.RESPONSE.ERRORS];
        }

        if(this.isHttpProtocolType() && typeof data[Const.Settings.RESPONSE.TOKEN] === 'object')
        {
            const token = data[Const.Settings.RESPONSE.TOKEN];
            if(typeof token[Const.Settings.RESPONSE.TOKEN_PLAIN] === 'object' &&
               typeof token[Const.Settings.RESPONSE.TOKEN_SIGNED] === 'string')
            {
                this.newPlainToken = token[Const.Settings.RESPONSE.TOKEN_PLAIN];
                this.newSignedToken = token[Const.Settings.RESPONSE.TOKEN_SIGNED];
            }
        }
    }
}

export = Response;

