/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

export class ConnectionRequiredError extends Error
{
    constructor() {
        super('A connection is required for this action.');
    }
}