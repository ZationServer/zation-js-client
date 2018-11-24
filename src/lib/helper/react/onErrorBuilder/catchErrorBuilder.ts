/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {ResponseReactionOnError}    from "../reaction/reactionHandler";
import {AbstractErrorFilterBuilder} from "./abstractErrorFilterBuilder";
import {ResponseReactAble}          from "../responseReactionEngine/responseReactAble";

export class CatchErrorBuilder<T extends ResponseReactAble,R> extends AbstractErrorFilterBuilder<R>
{
    private readonly target  : T;

    constructor(target : T) {
        super();
        this.target = target;
    }

    protected _save(reaction : ResponseReactionOnError, filter : object[]) : R
    {
        return this.target.catchError(reaction,...filter);
    }
}