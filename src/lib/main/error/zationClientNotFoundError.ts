/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

export class ZationClientNotFoundError extends Error
{
    constructor(key : string) {
        super(`Zation client on key: '${key}' not found.`);
    }
}