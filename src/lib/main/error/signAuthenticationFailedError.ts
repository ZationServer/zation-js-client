/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {RawError} from "./rawError";

export class SignAuthenticationFailedError extends RawError
{
    constructor(rawError : Error) {
        super(`Sign authentication is failed. ${rawError.toString()}`,rawError);
    }
}


