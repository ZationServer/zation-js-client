/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {ErrorName} from "../constants/errorName";

export class RawError extends Error
{
    private readonly rawError : Error;

    constructor(message : string,rawError : Error)
    {
        super(message);
        this.rawError = rawError;
    }

    // noinspection JSUnusedGlobalSymbols
    getRawError() : Error {
        return this.rawError;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns the error name of the raw error,
     * can be used to check more details.
     */
    getErrorName() : ErrorName {
        return (this.rawError.name as ErrorName);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns if the raw error name is equal to the argument error name.
     * @param errorName
     */
    isErrorName(errorName : ErrorName) : boolean {
        return this.rawError.name === errorName;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns additional info of the raw error.
     */
    getErrorInfo() : Record<string,any> {
        return this.rawError['info'] || {};
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns the raw error code.
     */
    getErrorCode() : any {
        return this.rawError['code'];
    }
}

