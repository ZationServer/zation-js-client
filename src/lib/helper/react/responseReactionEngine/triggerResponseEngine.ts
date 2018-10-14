/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import Response = require("../../../api/response");
import FullReaction = require("../reaction/fullReaction");
import {ResponseReactionCatchError, ResponseReactionOnError, ResponseReactionOnSuccessful} from "../reaction/reactionHandler";
import {ErrorFilterEngine} from "./errorFilterEngine";
import {TaskError} from "../taskError/taskError";

export class TriggerResponseEngine
{
    static async onSuccessful(response : Response,fullReaction : FullReaction<ResponseReactionOnSuccessful>)
    {
        if(fullReaction.getFilter()['statusCode'] === undefined) {
            await fullReaction.getReactionHandler()(response.getResult(),response);
        }
        else if(fullReaction.getFilter()['statusCode'] === response.getStatusCode()) {
            await fullReaction.getReactionHandler()(response.getResult(),response);
        }
    }

    static async onError(response : Response,fullReaction : FullReaction<ResponseReactionOnError>)
    {

        const fErrors : TaskError[] = ErrorFilterEngine.filterErrors(response.getErrors(),fullReaction.getFilter());
        if(fErrors.length > 0) {
            await fullReaction.getReactionHandler()(fErrors,response);
        }
    }

    static async catchError(response : Response,fullReaction : FullReaction<ResponseReactionCatchError>)
    {
        const fErrors : TaskError[] = ErrorFilterEngine.filterErrors(response._getNotCatchedErrors(),fullReaction.getFilter());
        if(fErrors.length > 0) {
            response._errorsAreCatched(fErrors);
            await fullReaction.getReactionHandler()(fErrors,response);
        }
    }
}