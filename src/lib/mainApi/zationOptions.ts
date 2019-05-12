/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

export interface ZationOptions {

    /**
     * Boolean that indicates if the debug mode is active.
     * In debug mode the client will console log information about the current status and errors.
     * @default false
     */
    debug ?: boolean;
    /**
     * The system name of the client can be any string, e.g. android, ios, web.
     * It can be used on the server side.
     * @default 'Default'
     */
    system ?: string;
    /**
     * The version of the application can be any number.
     * It can be used on the server side.
     * @default 1.0
     */
    version ?: number;
    /**
     * The default connection API level that the client can support, it can be any integer number.
     * Notice that you can define for every request a more specific API level that will override the connection API level.
     * If you don't provide a connection or request API level the server will use a default API level.
     * @default undefined
     */
    apiLevel ?: number;
    /**
     * The hostname where the client should connect to.
     * Notice the default value can be overwritten from the server settings file
     * (if the data is available and the option useAllServerSettings is active).
     * @default The current host (from the URL) or localhost.
     */
    hostname ?: string;
    /**
     * The URL path where the zation server processes requests.
     * @default If the server settings are available it will use the path from it otherwise it is '/zation'.
     */
    path ?: string;
    /**
     * The port number where the client should connect to.
     * Notice the default value can be overwritten from the server settings file
     * (if the data is available and the option useAllServerSettings is active).
     * @default Port from the current URL if it fails it is 80 or 443 if the secure option is true.
     */
    port ?: number;
    /**
     * Indicates if the client should use TLS (SSL) to create a secure connection to the server.
     * Notice the default value can be overwritten from the server settings file
     * (if the data is available and the option useAllServerSettings is active).
     * @default Is true if the current protocol of the URL is https.
     */
    secure ?: boolean;
    /**
     * Set this to false during debugging that the client connection
     * will not fail when using self-signed certificates.
     * @default false
     */
    rejectUnauthorized ?: boolean;
    /**
     * Specifies in what key the zation data is located in an HTTP post request.
     * @default If the server settings are available it will use the post key from it otherwise it is 'zation'.
     */
    postKey ?: string;
    /**
     * Multiplexing allows you to reuse a socket instead of creating a new socket to the same address.
     * @default true.
     */
    multiplex ?: boolean;
    /**
     * If the client should add a timestamp to the WebSocket handshake request.
     * @default false
     */
    timestampRequests ?: boolean;

    /**
     * Indicates if the client should automatically subscribe the all channel.
     * @default true
     */
    autoAllChSub ?: boolean;
    /**
     * Indicates if the client should automatically subscribe the user channel with the current user id.
     * Notice that the client will also resubscribe if the user id changes.
     * @default true
     */
    autoUserChSub ?: boolean;
    /**
     * Indicates if the client should automatically subscribe the default user group channel.
     * Notice that the client will also resubscribe if the token state changes.
     * @default true
     */
    autoDefaultUserGroupChSub ?: boolean;
    /**
     * Indicates if the client should automatically subscribe the auth user group channel with the current auth user group.
     * Notice that the client will also resubscribe if the auth user group changes.
     * @default true
     */
    autoAuthUserGroupChSub ?: boolean;

    /**
     * These variables will be sent to the server when the client is creating his connection.
     * @default {}
     */
    handshakeVariables ?: object;

    /**
     * Specifies if the client should overwrite the default options (hostname, port, secure, path and postKey)
     * with the server settings if they are available.
     * Otherwise, the client will only use the postKey and path from the server settings file.
     * Notice if you set this option to true and you are using a proxy that redirects the request
     * it can produce errors if you don't provide custom options for the client.
     * @default false
     */
    useAllServerSettings ?: boolean;

    /**
     * Defines if the client should try to reconnect to the server when the connection is lost.
     * Notice that the client will automatically resubscribe all previous channels.
     * @default true
     */
    autoReconnect ?: boolean;

    /**
     * Specifies options for the reconnection.
     */
    autoReconnectOptions ?: {
        /**
         * Initial delay in milliseconds.
         */
        initialDelay ?: number,
        /**
         * Randomness in milliseconds.
         */
        randomness ?: number,
        /**
         * Miltiplier (decimal)
         * @default 1.5
         */
        multiplier ?: number,
        /**
         * Max delay in milliseconds.
         */
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
    useAllServerSettings : boolean;
    autoReconnect : boolean;
    autoReconnectOptions : {
        initialDelay ?: number,
        randomness ?: number,
        multiplier ?: number,
        maxDelay ?: number
    }
}