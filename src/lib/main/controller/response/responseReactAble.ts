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
} from './responseReactions';
import {OnBackErrorBuilder} from './error/onBackErrorBuilder';
// noinspection ES6PreferShortImport
import {BackErrorFilter} from '../../backError/backErrorFilter';
import {CatchBackErrorBuilder} from './error/catchBackErrorBuilder';

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
     *     .preset()
     *     .valueNotMatchesWithMinLength()
     *     .react((errors, response) => {})
     */
    onError(): OnBackErrorBuilder<T,R>;
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
     *     .preset()
     *     .valueNotMatchesWithMinLength()
     *     .react((errors, response) => {})
     */
    onError(reaction: ResponseReactionOnError<any>,filter?: BackErrorFilter): R;

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
     *     .preset()
     *     .valueNotMatchesWithMinLength()
     *     .react((caughtErrors, response) => {})
     */
    catchError(): CatchBackErrorBuilder<T,R>;
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
     *     .preset()
     *     .valueNotMatchesWithMinLength()
     *     .react((caughtErrors, response) => {})
     */
    catchError(reaction: ResponseReactionCatchError<any>,filter?: BackErrorFilter): R;

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React to a successful response.
     * @example
     * onSuccessful((result,response) => {});
     * @param reaction
     */
    onSuccessful(reaction: ResponseReactionOnSuccessful<any>): R;

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on a response
     * It does not matter if the response is successful or has errors.
     * @example
     * onResponse((response) => {});
     * @param reaction
     */
    onResponse(reaction: ResponseReactionOnResponse<any>): R;
}



