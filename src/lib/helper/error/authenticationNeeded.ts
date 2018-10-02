/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

class AuthenticationNeededError extends Error
{
    constructor(message : string = '')
    {
        super(`Socket needs to be authenticated! ${message}`);
    }
}

export = AuthenticationNeededError;
