/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import ReactionBox       = require("../helper/react/box/reactionBox");
import {OnErrorBuilder}    from "../helper/react/onErrorBuilder/onErrorBuilder";
import {CatchErrorBuilder} from "../helper/react/onErrorBuilder/catchErrorBuilder";
import {ReactionCatchError, ReactionOnError, ReactionOnSuccessful} from "../helper/react/reactionHandler";
import FullReaction      = require("../helper/react/fullReaction");
import Box               = require("../helper/box/box");
import ResponseReactAble = require("../helper/react/responseReactAble");
import {ErrorFilter}       from "../helper/filter/errorFilter";
import Response          = require("./response");
import {TriggerResponseEngine} from "../helper/react/responseReactionEngine/triggerResponseEngine";

class ResponseReactionBox extends ReactionBox implements ResponseReactAble
{

    private readonly errorCatchReactionBox : Box<FullReaction<ReactionCatchError>>
        = new Box<FullReaction<ReactionCatchError>>();

    private readonly errorReactionBox : Box<FullReaction<ReactionOnError>>
        = new Box<FullReaction<ReactionOnError>>();

    private readonly successfulReactionBox : Box<FullReaction<ReactionOnSuccessful>>
        = new Box<FullReaction<ReactionOnSuccessful>>();

    constructor()
    {
        super();
    }

    onError(reaction: ReactionOnError, filter?: ErrorFilter) : FullReaction<ReactionOnError>
    {
        const fullReaction = new FullReaction<ReactionOnError>(reaction,filter);
        this.errorReactionBox.addItem(fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    buildOnError() : OnErrorBuilder<ResponseReactionBox>
    {
        return new OnErrorBuilder<ResponseReactionBox>(this);
    }

    // noinspection JSUnusedGlobalSymbols
    removeOnError(fullReaction : FullReaction<ReactionOnError>) : boolean {
        return this.errorReactionBox.removeItem(fullReaction);
    }

    catchError(reaction: ReactionCatchError, filter?: ErrorFilter) : FullReaction<ReactionCatchError>
    {
        const fullReaction = new FullReaction<ReactionCatchError>(reaction,filter);
        this.errorCatchReactionBox.addItem(fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    buildCatchError() : CatchErrorBuilder<ResponseReactionBox>
    {
        return new CatchErrorBuilder<ResponseReactionBox>(this);
    }

    // noinspection JSUnusedGlobalSymbols
    removeCatchError(fullReaction : FullReaction<ReactionCatchError>) : boolean {
        return this.errorCatchReactionBox.removeItem(fullReaction);
    }

    onSuccessful(reaction: ReactionOnSuccessful, statusCode ?: number | string) : FullReaction<ReactionOnSuccessful>
    {
        const fullReaction = new FullReaction<ReactionOnSuccessful>(reaction,{statusCode : statusCode});
        this.successfulReactionBox.addItem(fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    removeOnSuccessful(fullReaction : FullReaction<ReactionOnSuccessful>) : boolean {
        return this.successfulReactionBox.removeItem(fullReaction);
    }

    trigger(response : Response)
    {
        if(response.isSuccessful()) {
            this.successfulReactionBox.forEachSync(async (fullReaction : FullReaction<ReactionCatchError | ReactionCatchError>) =>
            {
                TriggerResponseEngine.onSuccessful(response,fullReaction);
            });
        }
        else {
            this.errorCatchReactionBox.forEachSync((fullReaction : FullReaction<ReactionCatchError>) =>
            {
                TriggerResponseEngine.catchError(response,fullReaction);
            });

            this.errorReactionBox.forEachSync((fullReaction : FullReaction<ReactionOnError>) =>
            {
                TriggerResponseEngine.onError(response,fullReaction);
            });
        }
    }
}

export = ResponseReactionBox;