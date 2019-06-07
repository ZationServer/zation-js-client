/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {RawError} from "./rawError";

export class PublishFailedError extends RawError
{
    constructor(rawError : Error) {
        super(`Publish in the channel is failed. ${rawError.toString()}`,rawError);
    }
}


