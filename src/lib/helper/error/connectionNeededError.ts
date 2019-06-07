/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

export class ConnectionNeededError extends Error
{
    constructor(message : string = '') {
        super(`The socket must be connected. ${message}`);
    }
}