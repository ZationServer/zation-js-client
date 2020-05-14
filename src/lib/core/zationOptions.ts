/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {ConnectTimeoutDefaultOption} from "../main/utils/connectionUtils";

export interface ZationOptions {

    /**
     * Boolean that indicates if the debug mode is active.
     * In debug mode the client will console log information about the current status and errors.
     * @default false
     */
    debug?: boolean;
    /**
     * The system name of the client can be any string, e.g. android, ios, web.
     * It can be used on the server side.
     * @default 'Default'
     */
    system?: string;
    /**
     * The version of the application can be any number.
     * It can be used on the server side.
     * @default 1.0
     */
    version?: number;
    /**
     * The default connection API level that the client can support, it can be any integer number.
     * Notice that you can define for every request a more specific API level that will override the connection API level.
     * If you don't provide a connection or request API level the server will use a default API level.
     * @default undefined
     */
    apiLevel?: number;
    /**
     * The hostname where the client should connect to.
     * Notice the default value can be overwritten from the server settings file
     * (if the data is available and the option useAllServerSettings is active).
     * @default The current host (from the URL) or localhost.
     */
    hostname?: string;
    /**
     * The URL path where the zation server processes requests.
     * @default If the server settings are available it will use the path from it otherwise it is '/zation'.
     */
    path?: string;
    /**
     * The port number where the client should connect to.
     * Notice the default value can be overwritten from the server settings file
     * (if the data is available and the option useAllServerSettings is active).
     * @default Port from the current URL if it fails it is 80 or 443 if the secure option is true.
     */
    port?: number;
    /**
     * Indicates if the client should use TLS (SSL) to create a secure connection to the server.
     * Notice the default value can be overwritten from the server settings file
     * (if the data is available and the option useAllServerSettings is active).
     * @default Is true if the current protocol of the URL is https.
     */
    secure?: boolean;
    /**
     * Set this to false during debugging that the client connection
     * will not fail when using self-signed certificates.
     * @default false
     */
    rejectUnauthorized?: boolean;
    /**
     * Multiplexing allows you to reuse a socket instead of creating a new socket to the same address.
     * @default true.
     */
    multiplex?: boolean;
    /**
     * If the client should add a timestamp to the WebSocket handshake request.
     * @default false
     */
    timestampRequests?: boolean;

    /**
     * These variables will be sent to the server when the client is creating his connection.
     * @default {}
     */
    handshakeVariables?: object;

    /**
     * Specifies if the client should overwrite the default options (hostname, port, secure, path and postKey)
     * with the server settings if they are available.
     * Otherwise, the client will only use the postKey and path from the server settings file.
     * Notice if you set this option to true and you are using a proxy that redirects the request
     * it can produce errors if you don't provide custom options for the client.
     * @default false
     */
    useAllServerSettings?: boolean;

    /**
     * Defines if the client should try to reconnect to the server when the connection is lost.
     * Notice that the client will automatically resubscribe all previous channels.
     * @default true
     */
    autoReconnect?: boolean;

    /**
     * Specifies options for the reconnection.
     */
    autoReconnectOptions?: {
        /**
         * Initial delay in milliseconds.
         */
        initialDelay?: number,
        /**
         * Randomness in milliseconds.
         */
        randomness?: number,
        /**
         * Miltiplier (decimal)
         * @default 1.5
         */
        multiplier?: number,
        /**
         * Max delay in milliseconds.
         */
        maxDelay?: number
    }

    /**
     * Specifies the default timeout for the response of a request.
     * @default 10000
     */
    responseTimeout?: number;

    /**
     * Specifies the default value for the ConnectTimeout option.
     * That option can activate that the socket is
     * trying to connect (if it's not connected) whenever you want to send
     * something to the server.
     * You have three possible choices:
     * False: The action will fail and throw a ConnectionRequiredError,
     * when the socket is not connected.
     * Null: The socket will try to connect (if it is not connected) and
     * waits until the connection is made, then it continues the action.
     * Number: Same as null, but now you can specify a timeout (in ms) of
     * maximum waiting time for the connection. If the timeout is reached,
     * it will throw a timeout error.
     * @default 3000
     */
    connectTimeout?: ConnectTimeoutDefaultOption;

    /**
     * Specifies the default value for the ConnectTimeout option.
     * That option can activate that the Databox is
     * trying to connect (if it's not connected) whenever you want
     * to fetchData.
     * You have three possible choices:
     * False: The action will fail and throw a ConnectionRequiredError,
     * when the Databox is not connected.
     * Null: The Databox will try to connect (if it is not connected) and
     * waits until the connection is made, then it continues the action.
     * Number: Same as null, but now you can specify a timeout (in ms) of
     * maximum waiting time for the connection. If the timeout is reached,
     * it will throw a timeout error.
     * @default 3000
     */
    databoxConnectTimeout?: ConnectTimeoutDefaultOption;
}

export interface ZationOptionsInternal extends ZationOptions{

    debug: boolean;
    system: string;
    version: number;
    hostname: string;
    path: string;
    port: number;
    secure: boolean;
    rejectUnauthorized: boolean;
    multiplex: boolean;
    handshakeVariables: object;
    useAllServerSettings: boolean;
    autoReconnect: boolean;
    autoReconnectOptions: {
        initialDelay?: number,
        randomness?: number,
        multiplier?: number,
        maxDelay?: number
    }
    responseTimeout: number;
    connectTimeout: ConnectTimeoutDefaultOption;
    databoxConnectTimeout: ConnectTimeoutDefaultOption;
}