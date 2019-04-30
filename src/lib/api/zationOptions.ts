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
    multiplex ?: boolean;
    timestampRequests ?: boolean;

    autoAllChSub ?: boolean;
    autoUserChSub ?: boolean;
    autoDefaultUserGroupChSub ?: boolean;
    autoAuthUserGroupChSub ?: boolean;

    /**
     * These variables will be sent to the server when the client is creating his connection.
     */
    handshakeVariables ?: object;

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
    multiplex : boolean;
    autoAllChSub : boolean;
    autoUserChSub : boolean;
    autoDefaultUserGroupChSub : boolean;
    autoAuthUserGroupChSub : boolean;
    handshakeVariables : object;
    autoReconnect : boolean;
    autoReconnectOptions : {
        initialDelay ?: number,
        randomness ?: number,
        multiplier ?: number,
        maxDelay ?: number
    }
}