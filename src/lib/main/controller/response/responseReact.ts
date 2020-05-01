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
import {Zation}                 from "../../../core/zation";
import {ResponseReactAble}      from "./responseReactAble";
import {FullReaction}           from "../../react/fullReaction";
// noinspection ES6PreferShortImport
import {ResponseReactionBox}    from "./responseReactionBox";


export class ResponseReact implements ResponseReactAble<ResponseReact,ResponseReact>
{
    private readonly response: Response;
    private readonly client: Zation;
    private preAction: Promise<void>;

    constructor(response: Response,client: Zation) {
        this.preAction = Promise.resolve();
        this.response = response;
        this.client = client;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the response.
     */
    getResponse(): Response {
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
    onError(): OnBackErrorBuilder<ResponseReact,ResponseReact>;
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
    onError(reaction: ResponseReactionOnError,...filter: BackErrorFilter[]): ResponseReact;
    onError(reaction?: ResponseReactionOnError,...filter: BackErrorFilter[]): ResponseReact | OnBackErrorBuilder<ResponseReact,ResponseReact>
    {
        if(reaction) {
            this.preAction = this.preAction.then(() =>
                TriggerResponseHelper.onError(this.response,new FullReaction<ResponseReactionOnError>(reaction,filter)));
            return this;
        }
        else {
            return new OnBackErrorBuilder<ResponseReact,ResponseReact>(this);
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
    catchError(): CatchBackErrorBuilder<ResponseReact,ResponseReact>;
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
    catchError(reaction: ResponseReactionCatchError,...filter: BackErrorFilter[]): ResponseReact;
    catchError(reaction?: ResponseReactionOnError,...filter: BackErrorFilter[]): ResponseReact | CatchBackErrorBuilder<ResponseReact,ResponseReact>
    {
        if(reaction) {
            this.preAction = this.preAction.then(() =>
                TriggerResponseHelper.catchError(this.response,new FullReaction<ResponseReactionCatchError>(reaction,filter)));
            return this;
        }
        else {
            return new CatchBackErrorBuilder<ResponseReact,ResponseReact>(this);
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
    onSuccessful(reaction: ResponseReactionOnSuccessful): ResponseReact
    {
        this.preAction = this.preAction.then(async () => {
            if(this.response.isSuccessful()) {
                await reaction(this.response.getResult(),this.response);
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
    onResponse(reaction:  ResponseReactionOnResponse): ResponseReact {
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
    reactWith(...respReactionBoxes: ResponseReactionBox[]): ResponseReact {
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
     * Because then the boxes from the zation client were not triggered.
     */
    triggerClientBoxes(): ResponseReact {
        this.preAction = this.preAction.then(() =>
            this.client._triggerResponseReactions(this.response));
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Async wait for all reactions are finished and returns the ResponseReact.
     */
    async wait(): Promise<ResponseReact> {
        await this.preAction;
        return this;
    }
}


