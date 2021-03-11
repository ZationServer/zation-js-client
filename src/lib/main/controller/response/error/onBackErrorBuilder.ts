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

export class OnBackErrorBuilder<T extends ResponseReactAble<T,R>,R,RT = any>
    extends AbstractBackErrorFilterBuilder<OnBackErrorBuilder<T,R,RT>>
{
    private readonly target : T;

    constructor(target: T) {
        super();
        this.target = target;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Adds reactions that get invoked when the filter has filtered at least one error.
     * All filtered errors are provided as an argument in the reactions.
     * @param reactions
     */
    react(...reactions: ResponseReactionOnError<RT>[]): R {
        return this.target.onError(mergeFunctions(...reactions),this.buildFinalFilter());
    }

    protected self(): OnBackErrorBuilder<T,R,RT> {
        return this;
    }

}