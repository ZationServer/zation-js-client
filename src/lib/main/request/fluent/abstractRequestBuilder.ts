/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {ProgressHandler}       from "../helper/progressHandler";
import {
    ResponseReactionCatchError,
    ResponseReactionOnError,
    ResponseReactionOnResponse,
    ResponseReactionOnSuccessful
} from '../../react/reaction/reactionHandler';
import {OnErrorBuilder}          from "../../react/error/onErrorBuilder";
import {CatchErrorBuilder}       from "../../react/error/catchErrorBuilder";
// noinspection ES6PreferShortImport
import {ErrorFilter}             from "../../react/error/errorFilter";
// noinspection ES6PreferShortImport
import {ProtocolType}            from "../../constants/protocolType";
// noinspection ES6PreferShortImport
import {Zation}                  from "../../../core/zation";
// noinspection ES6PreferShortImport
import {ResponseReactionBox}     from "../../react/reactionBoxes/responseReactionBox";
import {ZationRequest}           from "../main/zationRequest";
// noinspection ES6PreferShortImport
import {Response}                from "../../response/response";
import {ResponseReactAble}       from "../../react/response/responseReactAble";
import {WaitForConnectionOption} from "../../utils/connectionUtils";

export abstract class AbstractRequestBuilder<T> implements ResponseReactAble<AbstractRequestBuilder<T>,T>
{
    protected readonly zation: Zation;

    protected _protocol: ProtocolType = ProtocolType.WebSocket;
    protected _apiLevel: number | undefined = undefined;
    protected _timeout: null | number | undefined = undefined;
    protected _waitForConnection: WaitForConnectionOption = undefined;
    private _progressHandler: ProgressHandler[] = [];
    private _responseReactionBox: ResponseReactionBox;
    private _reactionAdded: boolean = false;
    private _addedResponseReactionBoxes: ResponseReactionBox[] = [];

    protected constructor(zation: Zation) {
        this.zation = zation;
        this._responseReactionBox = new ResponseReactionBox();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the protocolType.
     * @param protocolType
     * @default webSocket
     */
    protocol(protocolType: ProtocolType): T {
        this._protocol = protocolType;
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the apiLevel of the request.
     * @param apiLevel.
     * @default undefined.
     */
    apiLevel(apiLevel: number | undefined): T {
        this._apiLevel = apiLevel;
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the protocolType to web socket.
     * @param value
     */
    isWs(value: boolean = true): T {
        this._protocol = value ? ProtocolType.WebSocket: ProtocolType.Http;
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the protocolType to web socket.
     * @param value
     */
    isWebSocket(value: boolean = true): T {
        this.isWs(value);
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the protocolType to http.
     * @param value
     */
    isHttp(value: boolean = true): T {
        this._protocol = value ? ProtocolType.Http: ProtocolType.WebSocket;
        return this.self();
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
    timeout(timeout: null | undefined | number): T {
        this._timeout = timeout;
        return this.self();
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
     * This options is only used in the WebSocket protocol.
     * @param waitForConnection
     * @default undefined
     */
    waitForConnection(waitForConnection: WaitForConnectionOption): T {
        this._waitForConnection = waitForConnection;
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Add an onProgress handler.
     * @param progressHandler
     */
    onProgress(progressHandler: ProgressHandler): T {
        this._progressHandler.push(progressHandler);
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on the response with responseReaction box/es.
     * @param responseReactionBox
     */
    reactWith(...responseReactionBox: ResponseReactionBox[]): T
    {
        if(this._reactionAdded) {
            this._addedResponseReactionBoxes.push(this._responseReactionBox);
        }
        for(let i = 0;  i  < responseReactionBox.length; i++) {
            this._addedResponseReactionBoxes.push(responseReactionBox[i]);
        }
        this._responseReactionBox = new ResponseReactionBox();
        this._reactionAdded = false;
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React to errors in the response.
     * The difference to the catch error is that the errors of this reaction will not be caught,
     * and you always respond to all the errors of the response, not matters if they were caught before.
     * You can filter specific errors or react to all errors.
     * In the code examples, you can see how you can use it.
     * @example
     * //React on all errors
     * onError((errors,response) => {});
     * //Filter errors with raw filter
     * onError((errors,response) => {},{name: 'myError'})
     * //Filter errors with OnErrorBuilder
     * onError()
     *     .presets()
     *     .valueNotMatchesWithMinLength('name')
     *     .react((errors, response) => {})
     */
    onError(): OnErrorBuilder<AbstractRequestBuilder<T>,T>;
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React to errors in the response.
     * The difference to the catch error is that the errors of this reaction will not be caught,
     * and you always respond to all the errors of the response, not matters if they were caught before.
     * You can filter specific errors or react to all errors.
     * In the code examples, you can see how you can use it.
     * @example
     * //React on all errors
     * onError((errors,response) => {});
     * //Filter errors with raw filter
     * onError((errors,response) => {},{name: 'myError'})
     * //Filter errors with OnErrorBuilder
     * onError()
     *     .presets()
     *     .valueNotMatchesWithMinLength('name')
     *     .react((errors, response) => {})
     */
    onError(reaction: ResponseReactionOnError,...filter: ErrorFilter[]): T;
    onError(reaction?: ResponseReactionOnError,...filter: ErrorFilter[]): T | OnErrorBuilder<AbstractRequestBuilder<T>,T>
    {
        if(reaction) {
            this._responseReactionBox.onError(reaction,...filter);
            this._reactionAdded = true;
            return this.self();
        }
        else {
            return new OnErrorBuilder<AbstractRequestBuilder<T>,T>(this);
        }
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Catch errors in the response.
     * It makes sense to catch specific errors first and catch all left errors in the end.
     * In the code examples, you can see how you can use it.
     * @example
     * //Catch all errors
     * catchError((caughtErrors,response) => {});
     * //Catch filtered errors with raw filter
     * catchError((caughtErrors,response) => {},{name: 'myError'})
     * //Catch filtered errors with OnErrorBuilder
     * catchError()
     *     .presets()
     *     .valueNotMatchesWithMinLength('name')
     *     .react((caughtErrors, response) => {})
     */
    catchError(): CatchErrorBuilder<AbstractRequestBuilder<T>,T>;
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Catch errors in the response.
     * It makes sense to catch specific errors first and catch all left errors in the end.
     * In the code examples, you can see how you can use it.
     * @example
     * //Catch all errors
     * catchError((caughtErrors,response) => {});
     * //Catch filtered errors with raw filter
     * catchError((caughtErrors,response) => {},{name: 'myError'})
     * //Catch filtered errors with OnErrorBuilder
     * catchError()
     *     .presets()
     *     .valueNotMatchesWithMinLength('name')
     *     .react((caughtErrors, response) => {})
     */
    catchError(reaction: ResponseReactionCatchError,...filter: ErrorFilter[]): T;
    catchError(reaction?: ResponseReactionOnError,...filter: ErrorFilter[]): T | CatchErrorBuilder<AbstractRequestBuilder<T>,T>
    {
        if(reaction) {
            this._responseReactionBox.catchError(reaction,...filter);
            this._reactionAdded = true;
            return this.self();
        }
        else {
            return new CatchErrorBuilder<AbstractRequestBuilder<T>,T>(this);
        }
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React to a successful response.
     * You also can react to specific status codes of successful responses.
     * @example
     * onSuccessful((result,response) => {});
     * onSuccessful((result,response) => {},2000);
     * @param reaction
     * @param statusCode
     */
    onSuccessful(reaction: ResponseReactionOnSuccessful, statusCode?: number | string): T {
        this._responseReactionBox.onSuccessful(reaction,statusCode);
        this._reactionAdded = true;
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on a response
     * It does not matter if the response is successful or has errors.
     * @example
     * onResponse((response) => {});
     * @param reaction
     */
    onResponse(reaction:  ResponseReactionOnResponse): T {
        this._responseReactionBox.onResponse(reaction);
        this._reactionAdded = true;
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Send the request and returns the response after trigger the reactions from the build.
     * @throws ConnectionRequiredError,TimeoutError,AbortSignal
     * @param triggerZationBoxes
     * Specifies if the zation response boxes are triggered.
     * The default value is true if at least one reaction is added in the requestBuilder.
     * Otherwise you have the possibility to react with the response on specific things and
     * then trigger the zation response reaction boxes (using response.react().zationReact()).
     */
    send(triggerZationBoxes: boolean = this._reactionAdded || this._addedResponseReactionBoxes.length > 0): Promise<Response> {
        return this.zation.send(
            this.buildRequest(),
            (...args) => {
                this._progressHandler.forEach((handler)=>
                {
                    handler(...args);
                })},
            triggerZationBoxes,
            this._responseReactionBox,
            ...this._addedResponseReactionBoxes
        );
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Builds the request and return it.
     * Notice that the request not contains the reactions!
     */
    abstract buildRequest(): ZationRequest;

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Builds an get request.
     * @return
     * Returns the full get reuqest as an string.
     */
    abstract buildGetRequest(): string;

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns self.
     * For fluent programing with inheritance.
     */
    protected abstract self(): T;
}


