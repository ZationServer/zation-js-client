/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import ResponseReactAble        = require("./responseReactAble");
import {ReactionCatchError, ReactionOnError, ReactionOnSuccessful} from "./reactionHandler";
import {OnErrorBuilder}         from "./onErrorBuilder/onErrorBuilder";
import {CatchErrorBuilder}      from "./onErrorBuilder/catchErrorBuilder";
import Response                 = require("../../api/response");
import {ErrorFilter}            from "../filter/errorFilter";
import {TriggerResponseEngine}  from "./responseReactionEngine/triggerResponseEngine";
import FullReaction             = require("./fullReaction");
import ResponseReactionBox = require("../../api/responseReactionBox");

class ResponseReact implements ResponseReactAble
{
    private readonly response : Response;

    constructor(response : Response)
    {
        this.response = response;
    }

    getResponse() : Response {
        return this.response;
    }

    onError(reaction: ReactionOnError, filter?: ErrorFilter) : ResponseReact
    {
        TriggerResponseEngine.onError(this.response,new FullReaction<ReactionOnError>(reaction,filter));
        return this;
    }

    catchError(reaction: ReactionCatchError, filter?: ErrorFilter) : ResponseReact
    {
        TriggerResponseEngine.catchError(this.response,new FullReaction<ReactionCatchError>(reaction,filter));
        return this;
    }

    buildOnError() : OnErrorBuilder<ResponseReact>
    {
        return new OnErrorBuilder<ResponseReact>(this);
    }

    buildCatchError() : CatchErrorBuilder<ResponseReact>
    {
        return new CatchErrorBuilder<ResponseReact>(this);
    }

    onSuccessful(reaction: ReactionOnSuccessful, statusCode ?: number | string) : ResponseReact
    {
        TriggerResponseEngine.
        onSuccessful(this.response,new FullReaction<ReactionOnSuccessful>(reaction,{statusCode : statusCode}));

        return this;
    }

    reactWith(...respReactionBoxes : ResponseReactionBox[])
    {
        respReactionBoxes.forEach((box : ResponseReactionBox) => {
            box.trigger(this.response);
        });
    }
}

export = ResponseReact;

