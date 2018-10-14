/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {ResponseReactionOnError, ResponseReactionOnSuccessful} from "../reaction/reactionHandler";

interface ResponseReactAble
{
    catchError(reaction : ResponseReactionOnError, ...filter : object[]) : any;
    onError(reaction : ResponseReactionOnError, ...filter : object[]) : any;
    onSuccessful(reaction : ResponseReactionOnSuccessful, statusCode ?: any) : any;
}

export = ResponseReactAble;

