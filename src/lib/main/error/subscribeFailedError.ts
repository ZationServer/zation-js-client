/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {RawError} from "./rawError";

export class SubscribeFailedError extends RawError
{
    constructor(rawError : Error) {
        super(`Subscribe to the channel is failed. ${rawError.toString()}`,rawError);
    }
}

