/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

export class ConnectionAbortError extends Error
{
    private readonly rawError : Error;

    constructor(rawError : Error)
    {
        super(`Connection aborted: ${rawError.toString()}`);
        this.rawError = rawError;
    }

    // noinspection JSUnusedGlobalSymbols
    getRawError() : Error {
        return this.rawError;
    }

}


