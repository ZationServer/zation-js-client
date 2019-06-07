/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

export class AuthUserGroupRequiredError extends Error
{
    constructor(message : string = '') {
        super(`The socket must have an auth user group. ${message}`);
    }
}


