/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

// noinspection ES6PreferShortImport
import {Zation}                      from "../../../../core/zation";
import {ConnectTimeoutOption}        from "../../../utils/connectionUtils";
import Package                       from "../main/package";

export default class PackageBuilder
{
    protected readonly zation: Zation;

    private readonly _receiver: string = '';
    private _data: any = undefined;
    private _apiLevel: number | undefined = undefined;
    private _connectTimeout: ConnectTimeoutOption = undefined;

    constructor(zation: Zation,receiver: string,data?: any) {
        this.zation = zation;
        this._receiver = receiver;
        this._data = data;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the apiLevel of the package.
     * @param apiLevel.
     * @default undefined.
     */
    apiLevel(apiLevel: number | undefined): PackageBuilder {
        this._apiLevel = apiLevel;
        return this;
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
    connectTimeout(timeout: ConnectTimeoutOption): PackageBuilder {
        this._connectTimeout = timeout;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the data of the package.
     * @param data
     * @default undefined (equals to {} on server param based input).
     */
    data(data: any): PackageBuilder {
        this._data = data;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Builds the Package and returns it.
     */
    buildPackage(): Package {
        const pack = new Package(this._receiver,this._data);
        pack.setConnectTimeout(this._connectTimeout);
        pack.setApiLevel(this._apiLevel);
        return pack;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Sends the package.
     * @throws ConnectionRequiredError,TimeoutError,AbortSignal
     */
    send(): Promise<void> {
        return this.zation.send(this.buildPackage());
    }
}