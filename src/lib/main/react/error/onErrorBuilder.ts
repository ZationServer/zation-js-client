/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {ResponseReactionOnError}    from "../reaction/reactionHandler";
import {AbstractErrorFilterBuilder} from "./abstractErrorFilterBuilder";
import {ResponseReactAble}          from "../response/responseReactAble";
import {ReactionUtil}               from "./reactionUtil";

export class OnErrorBuilder<T extends ResponseReactAble<T,R>,R>
    extends AbstractErrorFilterBuilder<OnErrorBuilder<T,R>>
{
    private readonly target : T;

    constructor(target: T) {
        super();
        this.target = target;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Add the reactions that are triggered when the filter
     * have filtered at least one error.
     * If there is more than one error,
     * the reaction wil be triggered with all filtered errors.
     * @param reactions
     * You also can add more than one reaction.
     */
    react(...reactions: ResponseReactionOnError[]): R {
        //save last tmp
        this._pushTmpFilter();
        return this.target.onError(ReactionUtil.mergeReaction(reactions),...this.filter);
    }

    protected self(): OnErrorBuilder<T, R> {
        return this;
    }

}