/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {ResponseReactionOnError}        from "../responseReactions";
// noinspection ES6PreferShortImport
import {AbstractBackErrorFilterBuilder} from "../../../backError/abstractBackErrorFilterBuilder";
import {ResponseReactAble}              from "../responseReactAble";
import {mergeFunctions}                 from "../../../utils/funcUtils";

export class OnBackErrorBuilder<T extends ResponseReactAble<T,R>,R>
    extends AbstractBackErrorFilterBuilder<OnBackErrorBuilder<T,R>>
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
        return this.target.onError(mergeFunctions(...reactions),...this.filter);
    }

    protected self(): OnBackErrorBuilder<T, R> {
        return this;
    }

}