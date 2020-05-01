/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {Response} from "../controller/response/response";

export class AuthenticationFailedError extends Error
{
    private readonly response: Response;

    constructor(message: string = '',response: Response)
    {
        super(`Failed to authenticate this client. ${message}`);
        this.response = response;
    }

    // noinspection JSUnusedGlobalSymbols
    responseIsSuccessful(): boolean
    {
        return this.response.isSuccessful();
    }

    // noinspection JSUnusedGlobalSymbols
    getResponse(): Response {
        return this.response;
    }
}

