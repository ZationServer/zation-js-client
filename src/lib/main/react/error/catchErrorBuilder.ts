/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {ResponseReactionOnError}    from "../reaction/reactionHandler";
import {AbstractErrorFilterBuilder} from "./abstractErrorFilterBuilder";
import {ResponseReactAble}          from "../response/responseReactAble";
import {ReactionUtil}               from "./reactionUtil";

export class CatchErrorBuilder<T extends ResponseReactAble,R> extends AbstractErrorFilterBuilder<CatchErrorBuilder<T,R>>
{
    private readonly target  : T;

    constructor(target : T) {
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
    react(...reactions : ResponseReactionOnError[]) : R
    {
        //save last tmp
        this._pushTmpFilter();
        return this.target.catchError(ReactionUtil.mergeReaction(reactions),...this.filter);
    }

    protected self(): CatchErrorBuilder<T, R> {
        return this;
    }
}