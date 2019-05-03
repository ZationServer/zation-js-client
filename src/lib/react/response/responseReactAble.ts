/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {
    ResponseReactionOnError,
    ResponseReactionOnResponse,
    ResponseReactionOnSuccessful
} from "../reaction/reactionHandler";

export interface ResponseReactAble
{
    catchError(reaction : ResponseReactionOnError, ...filter : object[]) : any;
    onError(reaction : ResponseReactionOnError, ...filter : object[]) : any;
    onSuccessful(reaction : ResponseReactionOnSuccessful, statusCode ?: any) : any;
    onResponse(reaction: ResponseReactionOnResponse) : any
}



