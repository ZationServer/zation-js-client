/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

export class DeauthenticationFailedError extends Error
{
    private readonly scError : Error;

    constructor(scError : Error)
    {
        super(`Deauthentication failed! ${scError.toString()}`);
        this.scError = scError;
    }

    getScError() : Error
    {
        return this.scError;
    }

}



