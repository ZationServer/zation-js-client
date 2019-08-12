/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

export class DeauthenticationRequiredError extends Error
{
    constructor(message : string = '') {
        super(`The socket must be deauthenticated. ${message}`);
    }
}


