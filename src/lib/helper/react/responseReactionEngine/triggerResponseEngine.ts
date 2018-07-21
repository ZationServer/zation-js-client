/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import Response = require("../../../api/response");
import FullReaction = require("../fullReaction");
import {ReactionCatchError, ReactionOnError, ReactionOnSuccessful} from "../reactionHandler";
import {ErrorFilterEngine} from "./ErrorFilterEngine";

export class TriggerResponseEngine
{
    static onSuccessful(response : Response,fullReaction : FullReaction<ReactionOnSuccessful>)
    {
        if(fullReaction.getFilter()['statusCode'] === undefined) {
            fullReaction.getReactionHandler()(response.getResult(),response);
        }
        else if(fullReaction.getFilter()['statusCode'] === response.getStatusCode()) {
            fullReaction.getReactionHandler()(response.getResult(),response);
        }
    }

    static onError(response : Response,fullReaction : FullReaction<ReactionOnError>)
    {
        const fErrors : object[] = ErrorFilterEngine.filterErrors(response.getErrors(),fullReaction.getFilter());
        if(fErrors.length > 0) {
            fullReaction.getReactionHandler()(fErrors,response);
        }
    }

    static catchError(response : Response,fullReaction : FullReaction<ReactionCatchError>)
    {
        const fErrors : object[] = ErrorFilterEngine.filterErrors(response._getNotCatchedErrors(),fullReaction.getFilter());
        if(fErrors.length > 0) {
            response._errorsAreCatched(fErrors);
            fullReaction.getReactionHandler()(fErrors,response);
        }
    }
}