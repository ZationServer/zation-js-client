/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

class SubscribeFailedError extends Error
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

export = SubscribeFailedError;

