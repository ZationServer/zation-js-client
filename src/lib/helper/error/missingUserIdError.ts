/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

class  MissingUserIdError extends Error
{
    constructor(message : string = '')
    {
        super(`User id is needed! ${message}`);
    }
}

export = MissingUserIdError;

