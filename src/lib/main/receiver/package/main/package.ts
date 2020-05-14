/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {ConnectTimeoutOption}    from "../../../utils/connectionUtils";
import {buildRawPackage}         from "../../receiverUtils";
import {RawPackage}      from "../../receiverDefinitions";

export default class Package {

    protected receiver: string;
    protected data: any;
    protected apiLevel: number | undefined;
    private connectTimeout: ConnectTimeoutOption = undefined;

    constructor(receiver: string,data: any) {
        this.receiver = receiver;
        this.data = data;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the API level of the receiver package.
     * If you don't provide one the connection API level or server default API level will be used.
     */
    setApiLevel(apiLevel: number | undefined): void {
        this.apiLevel = apiLevel;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the api level of the receiver package.
     */
    getApiLevel(): number | undefined {
        return this.apiLevel;
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

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Sets the data of the receiver package.
     */
    setData(data: any) {
        return this.data = data;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the data of the receiver package.
     */
    getData(): any {
        return this.data;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Sets the receiver identifier.
     */
    setReceiver(receiver: string): void {
        this.receiver = receiver;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the receiver identifier.
     */
    getReceiver(): string {
        return this.receiver;
    }

    /**
     * Builds the raw package that can be sent to the client.
     */
    build(): RawPackage {
        return buildRawPackage(this.receiver,this.data,this.apiLevel);
    }
}

const isPackageSymbol = Symbol();

export function isPackage(obj: object): obj is Package {
    return obj[isPackageSymbol];
}

Package.prototype[isPackageSymbol] = true;