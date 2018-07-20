/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {ReactionOnError, ReactionOnSuccessful} from "./reactionHandler";

abstract class ResponseReactAble
{
    abstract onError(reaction : ReactionOnError,filter ?: object) : any;
    abstract onAllError(reaction : ReactionOnError,filter ?: object) : any;
    abstract onSuccessful(reaction : ReactionOnSuccessful,filter ?: object) : any;
    abstract onAllSuccessful(reaction : ReactionOnSuccessful,filter ?: object) : any;
}

export = ResponseReactAble;

