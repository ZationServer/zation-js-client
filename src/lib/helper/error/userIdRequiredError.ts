/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

export class UserIdRequiredError extends Error
{
    constructor(message : string = '') {
        super(`The socket must have a user id. ${message}`);
    }
}


