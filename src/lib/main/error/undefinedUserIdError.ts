/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

export class UndefinedUserIdError extends Error
{
    constructor(message: string = '') {
        super(`The user id is undefined. ${message}`);
    }
}