/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {RawError} from "./rawError";

export class SignAuthenticationFailedError extends RawError
{
    constructor(rawError : Error) {
        super(`Sign authentication is failed. ${rawError.toString()}`,rawError);
    }
}


