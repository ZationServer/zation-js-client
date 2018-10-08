/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {ProtocolType}    from "../helper/constants/protocolType";
import Const             = require("../helper/constants/constWrapper");
import ResponseReact     = require("../helper/react/reaction/responseReact");
import {TaskError} from "../helper/react/taskError/taskError";

class Response
{
    private successful = false;
    private readonly type : ProtocolType;

    private result : any;
    private statusCode : string | number | undefined;
    private readonly erros : TaskError[] = [];
    private notCatchedErrors : TaskError[] = [];

    //Part Token (ONLY HTTP)
    private newSignedToken : string | undefined = undefined;
    private newPlainToken : object | undefined = undefined;

    constructor(data,type : ProtocolType)
    {
        this.successful = false;
        this.erros = [];
        this.type = type;

        this._readData(data);
        this.resetNotCatchedErrors();
    }

    //Part Result Value
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the result from the response.
     * Is undefined if it is not set.
     */
    getResult() : any | undefined {
        return this.result;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the response has a result.
     */
    hasResult() : boolean
    {
       return this.result !== undefined;
    }

    //Part StatusCode

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the status code from the response.
     * Is undefined if it is not set.
     */
    getStatusCode() : string | number | undefined
    {
       return this.statusCode;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the response has a status code.
     */
    hasStatusCode() : boolean
    {
        return this.statusCode !== undefined;
    }

    //Part Successful

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the response was successful.
     */
    isSuccessful() : boolean
    {
        return this.successful;
    }

    //Part Token (only http request)

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the response has a new token (only http).
     */
    hasNewToken() : boolean
    {
        return this.newSignedToken !== undefined && this.newPlainToken !== undefined;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the new signed token from response (only http).
     * Is undefined if it is not set.
     */
    getNewSignedToken() : string | undefined
    {
        return this.newSignedToken;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the new plain token from response (only http).
     * Is undefined if it is not set.
     */
    getNewPlainToken() : object | undefined
    {
        return this.newPlainToken;
    }

    //Part Errors
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the errors of the response.
     * If there is no error it returns an empty array.
     * @param useFiltered if true than it returns only the errors there are not catched.
     */
    getErrors(useFiltered : boolean = true) : TaskError[]
    {
        if(useFiltered) {
            return this.notCatchedErrors;
        }
        else {
            return this.erros;
        }
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Checks if the response has errors.
     * @param useFiltered if true than it checks only the errors there are not catched.
     */
    hasErrors(useFiltered : boolean = true) : boolean
    {
        if(useFiltered) {
            return this.notCatchedErrors.length > 0;
        }
        else {
            return this.erros.length > 0;
        }
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the error count of the response.
     * @param useFiltered if true than it returns the count only of the errors there are not catched.
     */
    errorCount(useFiltered : boolean = true) : number
    {
        if(useFiltered) {
            return this.notCatchedErrors.length;
        }
        else {
            return this.erros.length;
        }
    }

    //Part react

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the an response react for rect directly on the repsonse.
     */
    react() : ResponseReact
    {
        return new ResponseReact(this);
    }

    //Part Type

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the protocol type of the repsonse.
     */
    getProtocolType() : ProtocolType
    {
        return this.type;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the protocol type of the response is websocket.
     */
    isWsProtocolType() : boolean
    {
        return this.type === ProtocolType.WebSocket;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the protocol type of the response is http.
     */
    isHttpProtocolType() : boolean
    {
        return this.type === ProtocolType.Http;
    }

    //Part CatchOut

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Reset all catched errors.
     */
    resetNotCatchedErrors() : void {
        this.notCatchedErrors = this.erros;
    }

    _getNotCatchedErrors() : TaskError[] {
        return this.notCatchedErrors;
    }

    _errorsAreCatched(errors : TaskError[])
    {
        errors.forEach((error : TaskError) => {
            const index = this.notCatchedErrors.indexOf(error);
            if (index > -1) {this.notCatchedErrors.splice(index, 1);}
        });
    }

    //Part main system

    private _readData(data)
    {
        if (typeof data[Const.Settings.RESPONSE.SUCCESSFUL] === 'boolean') {
            this.successful = data[Const.Settings.RESPONSE.SUCCESSFUL];
        }

        if (typeof data[Const.Settings.RESPONSE.RESULT] === 'object') {

            const res = data[Const.Settings.RESPONSE.RESULT];

            if (res[Const.Settings.RESPONSE.RESULT_MAIN] !== undefined) {
                this.result = res[Const.Settings.RESPONSE.RESULT_MAIN];
            }

            if (typeof res[Const.Settings.RESPONSE.RESULT_STATUS] === 'string' ||
                typeof res[Const.Settings.RESPONSE.RESULT_STATUS] === 'number'
            ) {
                this.statusCode = res[Const.Settings.RESPONSE.RESULT_STATUS];
            }
        }

        if (Array.isArray(data[Const.Settings.RESPONSE.ERRORS]))
        {
            const errors : any[] = data[Const.Settings.RESPONSE.ERRORS];
            for(let i = 0; i < errors.length; i++)
            {
                if(typeof errors[i] === 'object') {
                    this.erros.push(new TaskError(errors[i]));
                }
            }
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

