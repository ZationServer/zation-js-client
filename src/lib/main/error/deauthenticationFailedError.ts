/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {RawError} from "./rawError";

export class DeauthenticationFailedError extends RawError
{
    constructor(rawError : Error) {
        super(`The deauthentication of the socket is failed. ${rawError.toString()}`,rawError);
    }
}



