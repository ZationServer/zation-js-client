/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

class MissingAuthUserGroupError extends Error
{
    constructor(message : string = '')
    {
        super(`User group is needed! ${message}`);
    }
}

export = MissingAuthUserGroupError;

