/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {Response}          from "./response";
import {ResponseReactionCatchError, ResponseReactionOnError} from "./responseReactions";
// noinspection ES6PreferShortImport
import {ErrorFilterEngine} from "../../backError/errorFilterEngine";
// noinspection ES6PreferShortImport
import {BackError}         from "../../backError/backError";
import {FullReaction}      from "../../react/fullReaction";

export class TriggerResponseHelper
{
    static async onError(response: Response,fullReaction: FullReaction<ResponseReactionOnError<any>>)
    {
        const fErrors: BackError[] = ErrorFilterEngine.filterErrors(response.getErrors(false),fullReaction.getFilter() || []);
        if(fErrors.length > 0) {
            await fullReaction.getReactionHandler()(fErrors,response);
        }
    }

    static async catchError(response: Response,fullReaction: FullReaction<ResponseReactionCatchError<any>>)
    {
        const fErrors: BackError[] = ErrorFilterEngine.filterErrors(response.getErrors(true),fullReaction.getFilter() || []);
        if(fErrors.length > 0) {
            response._errorsAreCaught(fErrors);
            await fullReaction.getReactionHandler()(fErrors,response);
        }
    }
}