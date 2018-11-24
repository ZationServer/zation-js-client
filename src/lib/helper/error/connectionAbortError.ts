/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

export class ConnectionAbortError extends Error
{
    private readonly scError : Error;

    constructor(scError : Error)
    {
        super(`Connection aborted: ${scError.toString()}`);
        this.scError = scError;
    }

    getScError() : Error
    {
        return this.scError;
    }

}


