/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {ErrorName} from "../constants/errorName";

export class PublishFailedError extends Error
{
    private readonly scError : Error;

    constructor(scError : Error)
    {
        super(`Publish in the channel is failed. ${scError.toString()}`);
        this.scError = scError;
    }

    getScError() : Error {
        return this.scError;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns the error name of the error,
     * can be used to check more details.
     */
    getErrorName() : ErrorName {
        return (this.scError.name as ErrorName);
    }
}


