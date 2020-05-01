/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

// noinspection TypeScriptPreferShortImport
import {WaitForConnectionOption} from "../../../utils/connectionUtils";

export abstract class BaseRequest
{
    protected readonly data: any;
    protected apiLevel: number | undefined;
    private timeout: null | number | undefined = undefined;

    private waitForConnection: WaitForConnectionOption = undefined;

    protected constructor(data: any) {
        this.data = data;
    }

    /**
     * Builds the request data that can be transmitted to the client.
     * @description
     */
    abstract build(): any;

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
     * Returns the timeout for the response of the request.
     * Value can be null which means the timeout is disabled or
     * undefined then it will use the default timeout of the zation config,
     * or it can be a number that indicates the milliseconds.
     */
    getTimeout(): number | null | undefined {
        return this.timeout;
    }

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
     * Set the timeout for the response of the request.
     * Value can be null which means the timeout is disabled or
     * undefined then it will use the default timeout of the zation config,
     * or it can be a number that indicates the milliseconds.
     * @param timeout
     */
    setTimeout(timeout: number | null | undefined): void {
        this.timeout = timeout;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the data of the request.
     */
    getData(): any {
        return this.data;
    }

    /**
     * Returns the WaitForConnection option.
     */
    getWaitForConnection(): WaitForConnectionOption {
        return this.waitForConnection;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * With the WaitForConnection option, you can activate that the socket is
     * trying to connect when it is not connected. You have five possible choices:
     * Undefined: It will use the value from the default options.
     * False: The action will fail and throw a ConnectionRequiredError,
     * when the socket is not connected.
     * For the other options, it is also recommended to have activated the auto-reconnect.
     * Null: The socket will try to connect (if it is not connected) and
     * waits until the connection is made, then it continues the action.
     * Number: Same as null, but now you can specify a timeout (in ms) of
     * maximum waiting time for the connection. If the timeout is reached,
     * it will throw a timeout error.
     * AbortTrigger: Same as null, but now you have the possibility to abort the wait later.
     * @param value
     * @default undefined
     */
    setWaitForConnection(value: WaitForConnectionOption) {
        this.waitForConnection = value;
    }
}

