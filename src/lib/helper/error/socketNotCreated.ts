/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

export class SocketNotCreatedError extends Error
{
    constructor(message : string = '')
    {
        super(`The Socket needs to be created (with connect() method) before ${message}.`);
    }
}


