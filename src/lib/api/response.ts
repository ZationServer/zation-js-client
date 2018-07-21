/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {ProtocolType}    from "../helper/constants/protocolType";
import Const             = require("../helper/constants/constWrapper");
import ResponseReact     = require("../helper/react/responseReact");

class Response
{
    private successful = false;

    private readonly type : ProtocolType;

    private result : any;
    private statusCode : string | number | undefined;
    private erros = [];

    private zationInfo : string[] = [];

    private notCatchedErrors : object[] = [];

    //Part Token (ONLY HTTP)
    private newSignedToken : string | undefined = undefined;
    private newPlainToken : object | undefined = undefined;

    constructor(data,type : ProtocolType)
    {
        this.successful = false;
        this.erros = [];
        this.type = type;

        this.readData(data);
        this.resetNotCatchedErrors();
    }

    //Part Result Value

    // noinspection JSUnusedGlobalSymbols
    getResult() : any
    {
        return this.result;
    }

    // noinspection JSUnusedGlobalSymbols
    hasResult() : boolean
    {
       return this.result !== undefined;
    }

    //Part StatusCode

    // noinspection JSUnusedGlobalSymbols
    getStatusCode() : string | number | undefined
    {
       return this.statusCode;
    }

    // noinspection JSUnusedGlobalSymbols
    hasStatusCode() : boolean
    {
        return this.statusCode !== undefined;
    }

    //Part Successful

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
            return this.notCatchedErrors;
        }
        else {
            return this.erros;
        }
    }

    // noinspection JSUnusedGlobalSymbols
    hasErrors(useFiltered : boolean = true)
    {
        if(useFiltered) {
            return this.notCatchedErrors.length > 0;
        }
        else {
            return this.erros.length > 0;
        }
    }

    // noinspection JSUnusedGlobalSymbols
    hasError(index : number,useFiltered : boolean = true)
    {
        if(useFiltered) {
            return this.notCatchedErrors[index] !== undefined;
        }
        else {
            return this.erros[index] !== undefined;
        }
    }

    // noinspection JSUnusedGlobalSymbols
    errorCount(useFiltered : boolean = true)
    {
        if(useFiltered) {
            return this.notCatchedErrors.length;
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

    //Part Zation Http info
    hasZationInfo(key : string) : boolean
    {
        return this.zationInfo.indexOf(key) !== -1;
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

    resetNotCatchedErrors() : void {
        this.notCatchedErrors = this.erros;
    }

    _getNotCatchedErrors() : object[] {
        return this.notCatchedErrors;
    }

    _errorsAreCatched(errors : object[])
    {
        errors.forEach((error) =>
        {
            const index = this.notCatchedErrors.indexOf(error);
            if (index > -1) {
                this.notCatchedErrors.splice(index, 1);
            }
        });
    }

    //Part main system

    private readData(data)
    {
        if (typeof data[Const.Settings.RESPONSE.SUCCESSFUL] === 'boolean') {
            this.successful = data[Const.Settings.RESPONSE.SUCCESSFUL];
        }

        if (typeof data[Const.Settings.RESPONSE.RESULT] === 'object') {

            const res = data[Const.Settings.RESPONSE.RESULT];

            if (res[Const.Settings.RESPONSE.RESULT_MAIN] !== undefined)
            {
                this.result = res[Const.Settings.RESPONSE.RESULT_MAIN];
            }

            if (typeof res[Const.Settings.RESPONSE.RESULT_STATUS] === 'string' ||
                typeof res[Const.Settings.RESPONSE.RESULT_STATUS] === 'number'
            )
            {
                this.statusCode = res[Const.Settings.RESPONSE.RESULT_STATUS];
            }
        }

        if (Array.isArray(data[Const.Settings.RESPONSE.ERRORS]))
        {
            this.erros = data[Const.Settings.RESPONSE.ERRORS];
        }

        if (Array.isArray(data[Const.Settings.RESPONSE.ZATION_INFO]))
        {
            this.zationInfo = data[Const.Settings.RESPONSE.ZATION_INFO];
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

