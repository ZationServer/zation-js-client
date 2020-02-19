/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {ErrorName} from "../constants/errorName";

export class RawError extends Error
{
    private readonly rawError: Error;

    constructor(message: string,rawError: Error)
    {
        super(message);
        this.rawError = rawError;
    }

    // noinspection JSUnusedGlobalSymbols
    getRawError(): Error {
        return this.rawError;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns if the raw error name is equal to the argument error name.
     * @param errorName
     */
    isErrorName(errorName: ErrorName): boolean {
        return this.rawError.name === errorName;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns the raw error code.
     */
    get code(): any {
        return this.rawError['code'];
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns the error name.
     */
    get name(): string {
        return this.rawError.name;
    }

    /**
     * Returns additional info of the raw error.
     */
    get info(): Record<string,any> {
        return this.rawError['info'] || {};
    }
}


