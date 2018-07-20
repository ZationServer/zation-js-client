/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import ResponseReactAble = require("../helper/react/responseReactAble");
import {ProtocolType}    from "../helper/constants/protocolType";
import Const             = require("../helper/constants/constWrapper");
import ResponseReact = require("../helper/react/responseReact");

class Response
{
    private successful = false;

    private readonly type : ProtocolType;

    private resultValues = [];
    private resultPairs = {};
    private erros = [];

    private filteredErrors = [];
    private filteredResValues = [];
    private filteredResPairs = {};

    private filteredErrorsCache = [];

    //Part Token (ONLY HTTP)
    private newSignedToken : string | undefined = undefined;
    private newPlainToken : object | undefined = undefined;

    constructor(data,type : ProtocolType)
    {
        this.successful = false;
        this.resultValues = [];
        this.resultPairs = {};
        this.erros = [];
        this.type = type;

        this.readData(data);
        this.resetFiltered();
    }

    //Part Result Value

    // noinspection JSUnusedGlobalSymbols
    getMainResult(useFiltered : boolean = true) : any
    {
        if(useFiltered) {
            return this.filteredResValues[0];
        }
        else {
            return this.resultValues[0];
        }
    }

    // noinspection JSUnusedGlobalSymbols
    hasMainResult(useFiltered : boolean = true) : boolean
    {
        if(useFiltered) {
            return this.filteredResValues[0] !== undefined;
        }
        else {
            return this.resultValues[0] !== undefined;
        }
    }

    // noinspection JSUnusedGlobalSymbols
    getValueResults(useFiltered : boolean = true) : any[]
    {
        if(useFiltered) {
            return this.filteredResValues;
        }
        else {
            return this.resultValues;
        }
    }

    // noinspection JSUnusedGlobalSymbols
    getValueResult(index : number,useFiltered : boolean = true) : any
    {
        if(useFiltered) {
            return this.filteredResValues[index];
        }
        else {
            return this.resultValues[index];
        }
    }

    // noinspection JSUnusedGlobalSymbols
    hasValueResult(index : number,useFiltered : boolean = true)
    {
        if(useFiltered) {
            return this.filteredResValues[index] !== undefined;
        }
        else {
            return this.resultValues[index] !== undefined;
        }
    }

    //Part Result KeyValue

    // noinspection JSUnusedGlobalSymbols
    getPairResults(useFiltered : boolean = true) : object
    {
        if(useFiltered) {
            return this.filteredResPairs;
        }
        else {
            return this.resultPairs;
        }
    }

    // noinspection JSUnusedGlobalSymbols
    getPairResult(key : string,useFiltered : boolean = true) : any
    {
        if(useFiltered) {
            return this.filteredResPairs[key];
        }
        else {
            return this.resultPairs[key];
        }
    }

    // noinspection JSUnusedGlobalSymbols
    hasPairResult(key : string,useFiltered : boolean = true) : boolean
    {
        if(useFiltered) {
            return this.filteredResPairs[key] !== undefined;
        }
        else {
            return this.resultPairs[key] !== undefined;
        }
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
    getErrors(useFiltered : boolean = true)
    {
        if(useFiltered) {
            return this.filteredErrors;
        }
        else {
            return this.erros;
        }
    }

    // noinspection JSUnusedGlobalSymbols
    hasErrors(useFiltered : boolean = true)
    {
        if(useFiltered) {
            return this.filteredErrors.length > 0;
        }
        else {
            return this.erros.length > 0;
        }
    }

    // noinspection JSUnusedGlobalSymbols
    hasError(index : number,useFiltered : boolean = true)
    {
        if(useFiltered) {
            return this.filteredErrors[index] !== undefined;
        }
        else {
            return this.erros[index] !== undefined;
        }
    }

    // noinspection JSUnusedGlobalSymbols
    errorCount(useFiltered : boolean = true)
    {
        if(useFiltered) {
            return this.filteredErrors.length;
        }
        else {
            return this.erros.length;
        }
    }

    //Part react
    react() : ResponseReact
    {
        return new ResponseReact(this);
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

    //Part CatchOut

    resetFiltered() : void
    {
        this.filteredErrors = this.erros;
        this.filteredResPairs = this.resultPairs;
        this.filteredResValues = this.resultValues;
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
                this.resultPairs = res[Const.Settings.RESPONSE.RESULT_PAIRS];
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

