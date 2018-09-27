/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

class NotAuthenticatedNeededError extends Error
{
    constructor(message : string = '')
    {
        super(`Socket needs to be not authenticaed! ${message}`);
    }
}

export = NotAuthenticatedNeededError;

