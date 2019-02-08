/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

export interface ZationOptions {

    debug ?: boolean;
    system ?: string;
    version ?: number;
    hostname ?: string;
    path ?: string;
    port ?: number;
    secure ?: boolean;
    rejectUnauthorized ?: boolean;
    postKey ?: string;

    autoAllChSub ?: boolean;
    autoUserChSub ?: boolean;
    autoDefaultUserGroupChSub ?: boolean;
    autoAuthUserGroupChSub ?: boolean;

    autoReconnect ?: boolean;
    autoReconnectOptions ?: {
        initialDelay ?: number,
        randomness ?: number,
        multiplier ?: number,
        maxDelay ?: number
    }
}

export interface ZationOptionsInternal extends ZationOptions{

    debug : boolean;
    system : string;
    version : number;
    hostname : string;
    path : string;
    port : number;
    secure : boolean;
    rejectUnauthorized : boolean;
    postKey : string;
    autoAllChSub : boolean;
    autoUserChSub : boolean;
    autoDefaultUserGroupChSub : boolean;
    autoAuthUserGroupChSub : boolean;
    autoReconnect : boolean;
    autoReconnectOptions : {
        initialDelay ?: number,
        randomness ?: number,
        multiplier ?: number,
        maxDelay ?: number
    }
}