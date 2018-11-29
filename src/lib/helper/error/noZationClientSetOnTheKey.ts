/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

export class NoZationClientSetOnTheKey extends Error
{
    constructor(key : string)
    {
        super(`No zation client is set on this key: '${key}'`);
    }
}