/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

class DeauthenticationNeededError extends Error
{
    constructor(message : string = '')
    {
        super(`Socket needs to be deauthenticated! ${message}`);
    }
}

export = DeauthenticationNeededError;

