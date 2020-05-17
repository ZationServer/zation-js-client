/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {
    ResponseReactionCatchError,
    ResponseReactionOnError,
    ResponseReactionOnResponse,
    ResponseReactionOnSuccessful
} from '../../response/responseReactions';
import {OnBackErrorBuilder}          from "../../response/error/onBackErrorBuilder";
import {CatchBackErrorBuilder}       from "../../response/error/catchBackErrorBuilder";
// noinspection ES6PreferShortImport
import {BackErrorFilter}             from "../../../backError/backErrorFilter";
// noinspection ES6PreferShortImport
import {ZationClient}                from "../../../../core/zationClient";
// noinspection ES6PreferShortImport
import {ResponseReactionBox}         from "../../response/responseReactionBox";
// noinspection ES6PreferShortImport
import {Response}                from "../../response/response";
import {ResponseReactAble}       from "../../response/responseReactAble";
import {ConnectTimeoutOption} from "../../../utils/connectionUtils";
import {BaseRequest}             from "../main/baseRequest";

export abstract class AbstractRequestBuilder<T> implements ResponseReactAble<AbstractRequestBuilder<T>,T>
{
    protected readonly client: ZationClient;

    protected _apiLevel: number | undefined = undefined;
    protected _responseTimeout: null | number | undefined = undefined;
    protected _connectTimeout: ConnectTimeoutOption = undefined;
    private _responseReactionBox: ResponseReactionBox;
    private _reactionAdded: boolean = false;
    private _addedResponseReactionBoxes: ResponseReactionBox[] = [];

    protected constructor(zation: ZationClient) {
        this.client = zation;
        this._responseReactionBox = new ResponseReactionBox();
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
     * Set the timeout for the response of the request.
     * Value can be null which means the timeout is disabled or
     * undefined then it will use the default timeout of the zation client config,
     * or it can be a number that indicates the milliseconds.
     * @param timeout
     */
    responseTimeout(timeout: null | undefined | number): T {
        this._responseTimeout = timeout;
        return this.self();
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
    connectTimeout(timeout: ConnectTimeoutOption): T {
        this._connectTimeout = timeout;
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
    onError(): OnBackErrorBuilder<AbstractRequestBuilder<T>,T>;
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
    onError(reaction: ResponseReactionOnError,...filter: BackErrorFilter[]): T;
    onError(reaction?: ResponseReactionOnError,...filter: BackErrorFilter[]): T | OnBackErrorBuilder<AbstractRequestBuilder<T>,T>
    {
        if(reaction) {
            this._responseReactionBox.onError(reaction,...filter);
            this._reactionAdded = true;
            return this.self();
        }
        else {
            return new OnBackErrorBuilder<AbstractRequestBuilder<T>,T>(this);
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
    catchError(): CatchBackErrorBuilder<AbstractRequestBuilder<T>,T>;
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
    catchError(reaction: ResponseReactionCatchError,...filter: BackErrorFilter[]): T;
    catchError(reaction?: ResponseReactionOnError,...filter: BackErrorFilter[]): T | CatchBackErrorBuilder<AbstractRequestBuilder<T>,T>
    {
        if(reaction) {
            this._responseReactionBox.catchError(reaction,...filter);
            this._reactionAdded = true;
            return this.self();
        }
        else {
            return new CatchBackErrorBuilder<AbstractRequestBuilder<T>,T>(this);
        }
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React to a successful response.
     * @example
     * onSuccessful((result,response) => {});
     * @param reaction
     */
    onSuccessful(reaction: ResponseReactionOnSuccessful): T {
        this._responseReactionBox.onSuccessful(reaction);
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
     * Sends the request and returns the response after trigger the reactions from the build.
     * @throws ConnectionRequiredError,TimeoutError,AbortSignal
     * @param triggerClientBoxes
     * Specifies if all ResponseReactionBoxes attached to the client should be triggered.
     * The default value is true if at least one reaction is added in the requestBuilder.
     * Otherwise, you have the possibility to react with the response on specific things first and
     * then trigger the client boxes by using response.react().triggerClientBoxes().
     */
    send(triggerClientBoxes: boolean = this._reactionAdded || this._addedResponseReactionBoxes.length > 0): Promise<Response> {
        return this.client.send(
            this.buildRequest(),
            triggerClientBoxes,
            [this._responseReactionBox,...this._addedResponseReactionBoxes]
        );
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Builds the BaseRequest and returns it.
     * Notice that the request not contains the reactions.
     */
    abstract buildRequest(): BaseRequest;

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns self.
     * For fluent programing with inheritance.
     */
    protected abstract self(): T;
}


