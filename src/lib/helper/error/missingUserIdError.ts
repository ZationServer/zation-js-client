/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

export class MissingUserIdError extends Error
{
    constructor(message : string = '')
    {
        super(`User id is needed! ${message}`);
    }
}


