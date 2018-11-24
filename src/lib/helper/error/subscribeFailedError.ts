/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

export class SubscribeFailedError extends Error
{
    private readonly scError : Error;

    constructor(scError : Error)
    {
        super(`Subscribe channel failed! ${scError.toString()}`);
        this.scError = scError;
    }

    getScError() : Error
    {
        return this.scError;
    }

}

