/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

export class AuthenticationRequiredError extends Error
{
    constructor(message: string = '') {
        super(`The socket must be authenticated. ${message}`);
    }
}

