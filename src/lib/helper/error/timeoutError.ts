/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

export class TimeoutError extends Error {

    private readonly waitForConnectionTimeout : boolean;

    constructor(msg : string,waitForConnectionTimeout : boolean = false) {
        super(msg);
        this.waitForConnectionTimeout = waitForConnectionTimeout;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns if this is a wait for connection timeout.
     */
    isWaitForConnecitonTimeout() : boolean {
        return this.waitForConnectionTimeout;
    }
}


