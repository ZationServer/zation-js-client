/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {ReactionOnError} from "../reaction/reactionHandler";
import ResponseReactAble = require("../responseReactionEngine/responseReactAble");
import {AbstractErrorBuilderReaction} from "./abstractErrorBuilderReaction";

export class OnErrorBuilder<T extends ResponseReactAble> extends AbstractErrorBuilderReaction<T>
{
    constructor(main : T) {
        super(main);
    }

    _save(reaction : ReactionOnError, filter : object) : void
    {
        this.main.onError(reaction,filter);
    }
}