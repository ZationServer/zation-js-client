/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

class ResultIsMissingError extends Error
{
    constructor(message : string = '')
    {
        super(`Result is missing! ${message}`);
    }
}

export = ResultIsMissingError;

