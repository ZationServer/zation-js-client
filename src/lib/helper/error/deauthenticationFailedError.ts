/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

export class DeauthenticationFailedError extends Error
{
    private readonly rawError : Error;

    constructor(rawError : Error)
    {
        super(`The deauthentication of the socket is failed. ${rawError.toString()}`);
        this.rawError = rawError;
    }

    getRawError() : Error {
        return this.rawError;
    }
}



