/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

export class SignAuthenticationFailedError extends Error
{
    private readonly scError : Error;

    constructor(scError : Error)
    {
        super(`Sign authentication failed! ${scError.toString()}`);
        this.scError = scError;
    }

    getScError() : Error
    {
        return this.scError;
    }

}


