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
} from '../reaction/reactionHandler';
import {OnErrorBuilder} from '../error/onErrorBuilder';
// noinspection ES6PreferShortImport
import {ErrorFilter} from '../error/errorFilter';
import {CatchErrorBuilder} from '../error/catchErrorBuilder';

export interface ResponseReactAble<T extends ResponseReactAble<T,R>,R>
{

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
    onError(): OnErrorBuilder<T,R>;
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
    onError(reaction: ResponseReactionOnError,...filter: ErrorFilter[]): R;

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
    catchError(): CatchErrorBuilder<T,R>;
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
    catchError(reaction: ResponseReactionCatchError,...filter: ErrorFilter[]): R;

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
    onSuccessful(reaction: ResponseReactionOnSuccessful, statusCode?: any): R;

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on a response
     * It does not matter if the response is successful or has errors.
     * @example
     * onResponse((response) => {});
     * @param reaction
     */
    onResponse(reaction: ResponseReactionOnResponse): R;
}



