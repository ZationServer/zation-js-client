/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {Response}          from "./response";
import {ResponseReactionCatchError, ResponseReactionOnError} from "./responseReactions";
import {FullReaction}      from "../../react/fullReaction";
import {filterBackErrors}  from '../../backError/filterBackErrors';

export class ResponseTriggerHelper
{
    static async onError(response: Response,fullReaction: FullReaction<ResponseReactionOnError<any>>) {
        const errors = filterBackErrors(response.getErrors(false),fullReaction.getFilter());
        if(errors.length > 0) await fullReaction.getReactionHandler()(errors,response);
    }

    static async catchError(response: Response,fullReaction: FullReaction<ResponseReactionCatchError<any>>) {
        const errors = filterBackErrors(response.getErrors(true),fullReaction.getFilter());
        if(errors.length > 0) {
            response._errorsAreCaught(errors);
            await fullReaction.getReactionHandler()(errors,response);
        }
    }
}