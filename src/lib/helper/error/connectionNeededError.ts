/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

class ConnectionNeededError extends Error
{
    constructor(message : string = '')
    {
        super(`Connection is needed! ${message}`);
    }
}

export = ConnectionNeededError;

