/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {Response} from "../../response/response";

export class AuthenticationFailedError extends Error
{
    private readonly response : Response;

    constructor(message : string = '',response : Response)
    {
        super(`Failed to authenticate this client. ${message}`);
        this.response = response;
    }

    // noinspection JSUnusedGlobalSymbols
    responseIsSuccessful() : boolean
    {
        return this.response.isSuccessful();
    }

    // noinspection JSUnusedGlobalSymbols
    getResponse() : Response
    {
        return this.response;
    }
}

