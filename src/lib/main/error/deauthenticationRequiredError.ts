/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

export class DeauthenticationRequiredError extends Error
{
    constructor(message: string = '') {
        super(`The socket must be deauthenticated. ${message}`);
    }
}


