/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

class PublishFailedError extends Error
{
    private readonly scError : Error;

    constructor(scError : Error)
    {
        super(`Publish to a channel failed! ${scError.toString()}`);
        this.scError = scError;
    }

    getScError() : Error
    {
        return this.scError;
    }

}

export = PublishFailedError;

