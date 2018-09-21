/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {ReactionOnError} from "../reactionHandler";
import ResponseReactAble = require("../responseReactAble");
import {AbstractErrorBuilderReaction} from "./abstractErrorBuilderReaction";

export class CatchErrorBuilder<T extends ResponseReactAble> extends AbstractErrorBuilderReaction<T>
{
    constructor(main : T)
    {
        super(main);
    }

    _save(reaction : ReactionOnError, filter : object) : void
    {
        this.main.catchError(reaction,filter);
    }
}