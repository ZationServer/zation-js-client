/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {RawError} from "./rawError";

export class ConnectionAbortError extends RawError
{
    constructor(rawError: Error) {
        super(`Connection aborted: ${rawError.toString()}`,rawError);
    }
}


