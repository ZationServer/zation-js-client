/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

// noinspection TypeScriptPreferShortImport,ES6PreferShortImport
import {BackError}       from "../../backError/backError";
// noinspection ES6PreferShortImport
import {ZationClient}    from "../../../core/zationClient";
import {ResponseReact}   from "./responseReact";
import {ControllerRes}   from "../controllerDefinitions";

export class Response<T = any>
{
    private successful = false;
    protected readonly client: ZationClient;

    private result: T | undefined = undefined;
    private readonly errors: BackError[] = [];
    private notCaughtErrors: BackError[] = [];

    constructor(rawResponse: ControllerRes,client: ZationClient) {
        this.successful = false;
        this.errors = [];
        this.client = client;

        this._readRawResponse(rawResponse);
        this.resetNotCaughtErrors();
    }

    //Part Result
    /**
     * @description
     * Returns the result from the response.
     * Is undefined if it is not set.
     */
    getResult(): T | undefined {
        return this.result;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the response has a result.
     */
    hasResult(): boolean {
       return this.result !== undefined;
    }

    //Part Successful

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the response was successful.
     */
    isSuccessful(): boolean {
        return this.successful;
    }

    //Part Errors
    /**
     * @description
     * Returns the errors of the response.
     * If there is no error it returns an empty array.
     * @param notCaught
     * If true then it returns only the not caught errors.
     */
    getErrors(notCaught: boolean = true): BackError[] {
        if(notCaught) {
            return this.notCaughtErrors;
        }
        else {
            return this.errors;
        }
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Checks if the response has errors.
     * @param notCaught
     * If true then it checks only the not caught errors.
     */
    hasErrors(notCaught: boolean = true): boolean {
        if(notCaught) {
            return this.notCaughtErrors.length > 0;
        }
        else {
            return this.errors.length > 0;
        }
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the error count of the response.
     * @param notCaught
     * If true then it only counts the not caught errors.
     */
    errorCount(notCaught: boolean = true): number {
        if(notCaught) {
            return this.notCaughtErrors.length;
        }
        else {
            return this.errors.length;
        }
    }

    //Part react

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns a ResponseReact to react on the response with a fluent API.
     */
    react(): ResponseReact<T> {
        return new ResponseReact<T>(this,this.client);
    }

    //Part Caught errors

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Resets all caught errors.
     */
    resetNotCaughtErrors(): Response {
        this.notCaughtErrors = this.errors.slice();
        return this;
    }

    /**
     * @internal
     * @param errors
     * @private
     */
    _errorsAreCaught(errors: BackError[]) {
        let tmpErr;
        for(let i = 0; i < errors.length; i++){
            tmpErr = errors[i];
            const index = this.notCaughtErrors.indexOf(tmpErr);
            if (index > -1) {this.notCaughtErrors.splice(index, 1);}
        }
    }

    private _readRawResponse(rawRes: ControllerRes) {
        if(typeof rawRes === 'object'){
            const rawErrors = rawRes[0];
            if (Array.isArray(rawErrors)) {
                this.successful = rawErrors.length === 0;
                let tmpRawError;
                for(let i = 0; i < rawErrors.length; i++) {
                    tmpRawError = rawErrors[i];
                    if(typeof tmpRawError === 'object') {
                        this.errors.push(new BackError(tmpRawError));
                    }
                }
            }
            this.result = rawRes[1];
        }
        else {
            this.successful = true;
        }
    }

    toString(): string
    {
        return `Response: -> \n`+
            `   Successful: ${this.isSuccessful()}\n`+
            (this.isSuccessful() ? `   Result: ${this.result === undefined ? 'NO RESULT' : this.result}\n`: '') +
            (!this.isSuccessful() ? `   Errors: (${this.errors.toString()})`: '');
    }
}



