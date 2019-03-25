/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

// noinspection TypeScriptPreferShortImport
import {ProtocolType}    from "../helper/constants/protocolType";
import {TaskError}       from "../helper/react/taskError/taskError";
import {ZationResponse}  from "../helper/constants/internal";
import {Zation}          from "./zation";
import {ResponseReact}   from "../helper/react/reaction/responseReact";

export class Response
{
    private successful = false;
    private readonly type : ProtocolType;
    protected readonly client : Zation;

    private result : any;
    private statusCode : string | number | undefined;
    private readonly erros : TaskError[] = [];
    private notCatchedErrors : TaskError[] = [];

    private zationInfo : string[] = [];

    //Part Token (ONLY HTTP)
    private newSignedToken : string | undefined = undefined;
    private newPlainToken : object | undefined = undefined;

    constructor(data,client : Zation,type : ProtocolType)
    {
        this.successful = false;
        this.erros = [];
        this.type = type;
        this.client = client;

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
    react() : ResponseReact {
        return new ResponseReact(this,this.client);
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

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if key is in zation http info.
     * This makes only sense by an http request.
     * @param key
     */
    hasZationHttpInfo(key : string) : boolean
    {
        return this.zationInfo.indexOf(key) !== -1;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the zation http info.
     * This makes only sense by an http request.
     */
    getZationHttpInfo() : string[]
    {
        return this.zationInfo;
    }

    //Part CatchOut

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Reset all catched errors.
     */
    resetNotCatchedErrors() : Response {
        this.notCatchedErrors = this.erros.slice();
        return this;
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

    //Part returnTarget system

    private _readData(data : ZationResponse)
    {
        if (typeof data.s === 'boolean') {
            this.successful = data.s;
        }

        if (typeof data.r === 'object') {
            if (data.r.r !== undefined) {
                this.result = data.r.r;
            }

            if (typeof data.r.s === 'string' ||
                typeof data.r.s === 'number'
            ) {
                this.statusCode = data.r.s;
            }
        }

        if (Array.isArray(data.e))
        {
            const errors : any[] = data.e;
            for(let i = 0; i < errors.length; i++)
            {
                if(typeof errors[i] === 'object') {
                    this.erros.push(new TaskError(errors[i]));
                }
            }
        }

        if(Array.isArray(data.zhi)) {
            this.zationInfo = data.zhi;
        }

        if(this.isHttpProtocolType() && typeof data.t === 'object')
        {
            const token = data.t;
            if(typeof token.pt === 'object' &&
               typeof token.st === 'string')
            {
                this.newPlainToken = token.pt;
                this.newSignedToken = token.st;
            }
        }
    }

    toString() : string
    {
        return `Response: -> \n`+
            `   Successful: ${this.isSuccessful()}\n`+
            `   StatusCode: ${this.isSuccessful() ? this.getStatusCode() : 'ERROR'}\n` +
            `   Protocol: ${ProtocolType[this.getProtocolType()]}\n` +
            (this.hasNewToken() ? `   NewToken: ${this.getNewPlainToken() || 'UNKNOWN'}\n` : '')+
            (this.isSuccessful() ? `   Result: ${this.result}\n` : '') +
            (!this.isSuccessful() ? `   Errors: (${this.erros.toString()})` : '');
    }
}



