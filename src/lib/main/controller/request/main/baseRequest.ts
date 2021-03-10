/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

// noinspection TypeScriptPreferShortImport
import {ConnectTimeoutOption} from "../../../utils/connectionUtils";

export abstract class BaseRequest<D = any>
{
    protected data: D;
    protected apiLevel: number | undefined;
    private responseTimeout: null | number | undefined = undefined;
    private connectTimeout: ConnectTimeoutOption = undefined;

    protected constructor(data: D) {
        this.data = data;
    }

    /**
     * Builds the request data that can be sent to the client.
     * @description
     */
    abstract build(): any;

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the API level of the request.
     * If you don't provide one the connection API level or server default API level will be used.
     */
    setApiLevel(apiLevel: number | undefined): void {
        this.apiLevel = apiLevel;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the api level of the request.
     */
    getApiLevel(): number | undefined {
        return this.apiLevel;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the timeout for the response of the request.
     * Value can be null which means the timeout is disabled or
     * undefined then it will use the default timeout of the client config,
     * or it can be a number that indicates the milliseconds.
     * @param timeout
     */
    setResponseTimeout(timeout: number | null | undefined): void {
        this.responseTimeout = timeout;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the timeout for the response of the request.
     * Value can be null which means the timeout is disabled or
     * undefined then it will use the default timeout of the client config,
     * or it can be a number that indicates the milliseconds.
     */
    getResponseTimeout(): number | null | undefined {
        return this.responseTimeout;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Sets the data of the request.
     */
    setData(data: D): void {
        this.data = data;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the data of the request.
     */
    getData(): D {
        return this.data;
    }


    // noinspection JSUnusedGlobalSymbols
    /**
     * With the ConnectTimeout option, you can activate that the socket is
     * trying to connect when it is not connected. You have five possible choices:
     * Undefined: It will use the value from the default options.
     * False: The action will fail and throw a ConnectionRequiredError,
     * when the socket is not connected.
     * Null: The socket will try to connect (if it is not connected) and
     * waits until the connection is made, then it continues the action.
     * Number: Same as null, but now you can specify a timeout (in ms) of
     * maximum waiting time for the connection. If the timeout is reached,
     * it will throw a timeout error.
     * AbortTrigger: Same as null, but now you have the possibility to abort the wait later.
     * @param timeout
     * @default undefined
     */
    setConnectTimeout(timeout: ConnectTimeoutOption) {
        this.connectTimeout = timeout;
    }

    /**
     * Returns the ConnectTimeout option.
     */
    getConnectTimeout(): ConnectTimeoutOption {
        return this.connectTimeout;
    }
}

