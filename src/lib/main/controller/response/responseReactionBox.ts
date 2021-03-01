/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {OnBackErrorBuilder}    from "./error/onBackErrorBuilder";
import {CatchBackErrorBuilder} from "./error/catchBackErrorBuilder";
import {
    ResponseReactionCatchError,
    ResponseReactionOnError,
    ResponseReactionOnResponse,
    ResponseReactionOnSuccessful
} from "./responseReactions";
import {TriggerResponseHelper} from "./triggerResponseHelper";
import {ReactionBox}           from "../../react/reactionBox";
import {ResponseReactAble}     from "./responseReactAble";
import {FullReaction}          from "../../react/fullReaction";
import {ListMap}               from "../../container/listMap";
// noinspection ES6PreferShortImport
import {Response}              from "./response";
// noinspection ES6PreferShortImport
import {BackErrorFilter}       from '../../backError/backErrorFilter';

enum MapKey
{
   CatchError,
   Error,
   Successful,
   Response
}

export class ResponseReactionBox extends ReactionBox<ResponseReactionBox> implements ResponseReactAble<ResponseReactionBox,ResponseReactionBox>
{
    private readonly map: ListMap<FullReaction<any>> = new ListMap<FullReaction<any>>();
    protected lastReactionTmp: any;

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Creates a new ResponseReactionBox.
     * This box can be linked to the zation client.
     */
    constructor() {
        super();
        this.self = this;
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
    onError(): OnBackErrorBuilder<ResponseReactionBox,ResponseReactionBox>;
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React to errors in the response.
     * The difference to the catch error is that the errors of this reaction will not be caught,
     * and you always respond to all the errors of the response, not matters if they were caught before.
     * You can filter specific errors or react to all errors.
     * In the code examples, you can see how you can use it.
     * To remove the reaction later, you can use the getLastReaction method which returns the
     * last added reaction and then call the specific off/rm method with this reaction.
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
    onError(reaction: ResponseReactionOnError<any>,...filter: BackErrorFilter[]): ResponseReactionBox;
    onError(reaction?: ResponseReactionOnError<any>,...filter: BackErrorFilter[]): ResponseReactionBox | OnBackErrorBuilder<ResponseReactionBox,ResponseReactionBox>
    {
        if(reaction) {
            const fullReaction = new FullReaction<ResponseReactionOnError<any>>(reaction,filter);
            this.map.add(MapKey.Error,fullReaction);
            this.lastReactionTmp = fullReaction;
            return this;
        }
        else {
            return new OnBackErrorBuilder<ResponseReactionBox,ResponseReactionBox>(this);
        }
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Removes onError reaction/s.
     * @param fullReaction
     * If no specific reaction is provided, all will be removed.
     */
    offError(fullReaction?: FullReaction<any>): ResponseReactionBox {
        this.map.remove(MapKey.Error,fullReaction);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Catch errors in the response.
     * It makes sense to catch specific errors first and catch all left errors in the end.
     * In the code examples, you can see how you can use it.
     * To remove the reaction later, you can use the getLastReaction method which returns the
     * last added reaction and then call the specific off/rm method with this reaction.
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
    catchError(): CatchBackErrorBuilder<ResponseReactionBox,ResponseReactionBox>;
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
    catchError(reaction: ResponseReactionCatchError<any>,...filter: BackErrorFilter[]): ResponseReactionBox;
    catchError(reaction?: ResponseReactionOnError<any>,...filter: BackErrorFilter[]): ResponseReactionBox | CatchBackErrorBuilder<ResponseReactionBox,ResponseReactionBox>
    {
        if(reaction){
            const fullReaction = new FullReaction<ResponseReactionCatchError<any>>(reaction,filter);
            this.map.add(MapKey.CatchError,fullReaction);
            this.lastReactionTmp = fullReaction;
            return this;
        }
        else {
            return new CatchBackErrorBuilder<ResponseReactionBox,ResponseReactionBox>(this);
        }
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Removes catchError reaction/s.
     * @param fullReaction
     * If no specific reaction is provided, all will be removed.
     */
    rmCatchError(fullReaction?: FullReaction<any>): ResponseReactionBox {
        this.map.remove(MapKey.CatchError,fullReaction);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React to a successful response.
     * To remove the reaction later, you can use the getLastReaction method which returns the
     * last added reaction and then call the specific off/rm method with this reaction.
     * @example
     * onSuccessful((result,response) => {});
     * @param reaction
     */
    onSuccessful(reaction: ResponseReactionOnSuccessful<any>): ResponseReactionBox
    {
        const fullReaction = new FullReaction<ResponseReactionOnSuccessful<any>>(reaction,{});
        this.map.add(MapKey.Successful,fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Removes onSuccessful reaction/s.
     * @param fullReaction
     * If no specific reaction is provided, all will be removed.
     */
    offSuccessful(fullReaction?: FullReaction<any>): ResponseReactionBox {
        this.map.remove(MapKey.Successful,fullReaction);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on a response
     * It does not matter if the response is successful or has errors.
     * To remove the reaction later, you can use the getLastReaction method which returns the
     * last added reaction and then call the specific off/rm method with this reaction.
     * @example
     * onResponse((response) => {});
     * @param reaction
     */
    onResponse(reaction: ResponseReactionOnResponse<any>): ResponseReactionBox
    {
        const fullReaction = new FullReaction<ResponseReactionOnResponse<any>>(reaction,{});
        this.map.add(MapKey.Response,fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Removes onResponse reaction/s.
     * @param fullReaction
     * If no specific reaction is provided, all will be removed.
     */
    offResponse(fullReaction?: FullReaction<any>): ResponseReactionBox {
        this.map.remove(MapKey.Response,fullReaction);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the last added Reaction, you can use it to remove the reaction from the box
     * by calling the specific off method.
     * @return
     * It returns the last added Reaction.
     */
    getLastReaction(): any {
        return this.lastReactionTmp;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @internal
     * @description
     * Used internally.
     * Only use this method carefully.
     */
    async _trigger(response: Response) {
        if(this.active) {
            if(response.isSuccessful()) {
                const sucList = this.map.tryGet(MapKey.Successful);
                if(sucList) {
                    await sucList.forEach((fullReaction: FullReaction<ResponseReactionOnSuccessful<any>>) =>
                        fullReaction.getReactionHandler()(response.getResult(),response));
                }
            }
            else {
                const catchList = this.map.tryGet(MapKey.CatchError);
                const errorList = this.map.tryGet(MapKey.Error);

                if(catchList) {
                    await catchList.forEach((fullReaction: FullReaction<ResponseReactionCatchError<any>>) =>
                        TriggerResponseHelper.catchError(response,fullReaction));
                }

                if(errorList) {
                    await errorList.forEachParallel((fullReaction: FullReaction<ResponseReactionOnError<any>>) =>
                        TriggerResponseHelper.onError(response,fullReaction));
                }
            }
            const respList = this.map.tryGet(MapKey.Response);
            if(respList) {
                await respList.forEachParallel(async (fullReaction: FullReaction<ResponseReactionOnResponse<any>>) =>
                    fullReaction.getReactionHandler()(response));
            }
        }
    }
}