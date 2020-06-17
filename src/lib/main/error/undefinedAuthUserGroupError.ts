/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

export class UndefinedAuthUserGroupError extends Error
{
    constructor(message: string = '') {
        super(`The auth user group is undefined. ${message}`);
    }
}