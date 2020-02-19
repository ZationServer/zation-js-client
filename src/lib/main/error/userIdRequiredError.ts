/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

export class UserIdRequiredError extends Error
{
    constructor(message: string = '') {
        super(`The socket must have a user id. ${message}`);
    }
}


