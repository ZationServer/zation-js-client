/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

class SubscribeFailError extends Error
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

export = SubscribeFailError;

