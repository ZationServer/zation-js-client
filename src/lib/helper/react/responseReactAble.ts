/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {ReactionOnError, ReactionOnSuccessful} from "./reactionHandler";

interface ResponseReactAble
{
    catchError(reaction : ReactionOnError, filter ?: object) : any;
    onError(reaction : ReactionOnError, filter ?: object) : any;
    onSuccessful(reaction : ReactionOnSuccessful,statusCode ?: any) : any;
}

export = ResponseReactAble;

