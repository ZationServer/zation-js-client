/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

export class DeauthenticationNeededError extends Error
{
    constructor(message : string = '')
    {
        super(`Socket needs to be deauthenticated! ${message}`);
    }
}


