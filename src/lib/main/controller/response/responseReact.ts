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
} from "./responseReactions";
import {OnBackErrorBuilder}         from "./error/onBackErrorBuilder";
import {CatchBackErrorBuilder}      from "./error/catchBackErrorBuilder";
// noinspection ES6PreferShortImport
import {Response}               from "./response";
// noinspection ES6PreferShortImport
import {BackErrorFilter}        from "../../backError/backErrorFilter";
import {TriggerResponseHelper}  from "./triggerResponseHelper";
// noinspection ES6PreferShortImport
import {Client}                 from "../../../core/client";
import {ResponseReactAble}      from "./responseReactAble";
import {FullReaction}           from "../../react/fullReaction";
// noinspection ES6PreferShortImport
import {ResponseReactionBox}    from "./responseReactionBox";


export class ResponseReact<T = any> implements ResponseReactAble<ResponseReact<T>,ResponseReact<T>>
{
    private readonly response: Response<T>;
    private readonly client: Client;
    private preAction: Promise<void>;

    constructor(response: Response<T>,client: Client) {
        this.preAction = Promise.resolve();
        this.response = response;
        this.client = client;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the response.
     */
    getResponse(): Response<T> {
        return this.response;
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
    onError(): OnBackErrorBuilder<ResponseReact<T>,ResponseReact<T>,T>;
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
    onError(reaction: ResponseReactionOnError<T>,...filter: BackErrorFilter[]): ResponseReact<T>;
    onError(reaction?: ResponseReactionOnError<T>,...filter: BackErrorFilter[]): ResponseReact<T> | OnBackErrorBuilder<ResponseReact<T>,ResponseReact<T>,T>
    {
        if(reaction) {
            this.preAction = this.preAction.then(() =>
                TriggerResponseHelper.onError(this.response,new FullReaction<ResponseReactionOnError<T>>(reaction,filter)));
            return this;
        }
        else {
            return new OnBackErrorBuilder<ResponseReact<T>,ResponseReact<T>,T>(this);
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
    catchError(): CatchBackErrorBuilder<ResponseReact<T>,ResponseReact<T>,T>;
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
    catchError(reaction: ResponseReactionCatchError<T>,...filter: BackErrorFilter[]): ResponseReact<T>;
    catchError(reaction?: ResponseReactionOnError<T>,...filter: BackErrorFilter[]): ResponseReact<T> | CatchBackErrorBuilder<ResponseReact<T>,ResponseReact<T>,T>
    {
        if(reaction) {
            this.preAction = this.preAction.then(() =>
                TriggerResponseHelper.catchError(this.response,new FullReaction<ResponseReactionCatchError<T>>(reaction,filter)));
            return this;
        }
        else {
            return new CatchBackErrorBuilder<ResponseReact<T>,ResponseReact<T>,T>(this);
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
    onSuccessful(reaction: ResponseReactionOnSuccessful<T>): ResponseReact<T>
    {
        this.preAction = this.preAction.then(async () => {
            if(this.response.isSuccessful()) {
                await reaction(this.response.getResult()!,this.response);
            }
        });
        return this;
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
    onResponse(reaction:  ResponseReactionOnResponse<T>): ResponseReact<T> {
        this.preAction = this.preAction.then(() =>
            reaction(this.response));
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React with ResponseReactionBox/es.
     * @param respReactionBoxes
     */
    reactWith(...respReactionBoxes: ResponseReactionBox[]): ResponseReact<T> {
        this.preAction = this.preAction.then(() =>
            respReactionBoxes.forEach((box: ResponseReactionBox) =>
                box._trigger(this.response)));
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Triggers all ResponseReactionBoxes attached to the client.
     * Only makes sense if the request was sent without its own reaction boxes.
     * Because then the boxes from the client were not triggered.
     */
    triggerClientBoxes(): ResponseReact<T> {
        this.preAction = this.preAction.then(() =>
            this.client._triggerResponseReactions(this.response));
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Async wait for all reactions are finished and returns the ResponseReact.
     */
    async wait(): Promise<ResponseReact<T>> {
        await this.preAction;
        return this;
    }
}


