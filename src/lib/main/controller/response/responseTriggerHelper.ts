/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {Response}          from "./response";
import {ResponseReactionCatchError, ResponseReactionOnError} from "./responseReactions";
import {FullReaction}      from "../../react/fullReaction";
import {filterBackErrors}  from '../../backError/errorFilterEngine';

export class ResponseTriggerHelper
{
    static async onError(response: Response,fullReaction: FullReaction<ResponseReactionOnError<any>>) {
        const filter = fullReaction.getFilter();
        const errors = filter !== undefined ?
            filterBackErrors(response.getErrors(false),filter) : response.getErrors(false);

        if(errors.length > 0) await fullReaction.getReactionHandler()(errors,response);
    }

    static async catchError(response: Response,fullReaction: FullReaction<ResponseReactionCatchError<any>>) {
        const filter = fullReaction.getFilter();
        const errors = filter !== undefined ?
            filterBackErrors(response.getErrors(true),filter) : response.getErrors(true);

        if(errors.length > 0) {
            response._errorsAreCaught(errors);
            await fullReaction.getReactionHandler()(errors,response);
        }
    }
}