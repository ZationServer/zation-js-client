/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import ReactionBox       = require("../helper/react/box/reactionBox");
import {OnErrorBuilder}    from "../helper/react/onErrorBuilder/onErrorBuilder";
import {CatchErrorBuilder} from "../helper/react/onErrorBuilder/catchErrorBuilder";
import {
    ReactionCatchError,
    ReactionOnError,
    ReactionOnResponse,
    ReactionOnSuccessful
} from "../helper/react/reaction/reactionHandler";
import FullReaction      = require("../helper/react/reaction/fullReaction");
import Box               = require("../helper/box/box");
import ResponseReactAble = require("../helper/react/responseReactionEngine/responseReactAble");
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

    private readonly responseReactionBox : Box<FullReaction<ReactionOnResponse>>
        = new Box<FullReaction<ReactionOnResponse>>();

    constructor()
    {
        super();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on an error in the response.
     * The difference to the catch error is that the filtered errors are not caught.
     * And you always respond to all the errors of the response, no matter if they were caught before.
     * @example
     * onError((filteredErrors,response) => {},{name : 'passwordError'});
     *
     * -FilterExamples-
     * For errors with the name:
     * {name : 'errorName1'}
     * For errors with the names:
     * {name : ['errorName1','errorName2']}
     * For errors with the type:
     * {type : 'errorType1'}
     * For errors with the types:
     * {type : ['errorType1','errorType2']}
     * For errors with the info:
     * {info : {inputPath : 'name', inputValue : 'value'}}
     * For errors with one of the info:
     * {info : [{inputPath : 'name'},{inputPath : 'firstName'}]}
     * For errors with the info key:
     * {infoKey : 'inputPath'}
     * For errors with one of the info keys:
     * {infoKey : ['inputPath','inputValue']}
     * For errors with all of the info keys:
     * {infoKey : [['inputPath','inputValue']]}
     * For errors with the info value:
     * {infoValue : 'name'}
     * For errors with one of the info values:
     * {infoValue : ['name','firstName']}
     * For errors with all of the info values:
     * {infoValue : [['value1','value2']]}
     * For errors there from the zation system:
     * {fromZationSystem : true}
     * For errors there not from the zation system:
     * {fromZationSystem : false}
     * You can combine all of this properties.
     * @param reaction
     * @param filter
     * The purpose of this param is to filter the task errors.
     * Look in the examples how you can use it.
     * You also can add more than one filter.
     * The filter are linked with OR so the filtered errors
     * of each filter are countend together.
     * If there is more than one error at the end,
     * the reaction wil be triggerd with all filtered errors.
     * @return
     * It returns a FullReaction, you can use it to remove the on ErrorReaction from the box.
     */
    onError(reaction: ReactionOnError, ...filter: ErrorFilter[]) : FullReaction<ReactionOnError>
    {
        const fullReaction = new FullReaction<ReactionOnError>(reaction,filter);
        this.errorReactionBox.addItem(fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns an OnErrorBuilder to easy react on error.
     */
    buildOnError() : OnErrorBuilder<ResponseReactionBox>
    {
        return new OnErrorBuilder<ResponseReactionBox>(this);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove an OnError reaction with the FullReaction.
     * @param fullReaction
     */
    offError(fullReaction : FullReaction<ReactionOnError>) : void {
        this.errorReactionBox.removeItem(fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Catch an error in the response.
     * It makes sense to catch specific errors first and at the end to catch all the ones left over.
     * @example
     * onError((filteredErrors,response) => {},{name : 'passwordError'});
     *
     * -FilterExamples-
     * For errors with the name:
     * {name : 'errorName1'}
     * For errors with the names:
     * {name : ['errorName1','errorName2']}
     * For errors with the type:
     * {type : 'errorType1'}
     * For errors with the types:
     * {type : ['errorType1','errorType2']}
     * For errors with the info:
     * {info : {inputPath : 'name', inputValue : 'value'}}
     * For errors with one of the info:
     * {info : [{inputPath : 'name'},{inputPath : 'firstName'}]}
     * For errors with the info key:
     * {infoKey : 'inputPath'}
     * For errors with one of the info keys:
     * {infoKey : ['inputPath','inputValue']}
     * For errors with all of the info keys:
     * {infoKey : [['inputPath','inputValue']]}
     * For errors with the info value:
     * {infoValue : 'name'}
     * For errors with one of the info values:
     * {infoValue : ['name','firstName']}
     * For errors with all of the info values:
     * {infoValue : [['value1','value2']]}
     * For errors there from the zation system:
     * {fromZationSystem : true}
     * For errors there not from the zation system:
     * {fromZationSystem : false}
     * You can combine all of this properties.
     * @param reaction
     * @param filter
     * The purpose of this param is to filter the task errors.
     * Look in the examples how you can use it.
     * You also can add more than one filter.
     * The filter are linked with OR so the filtered errors
     * of each filter are countend together.
     * If there is more than one error at the end,
     * the reaction wil be triggerd with all filtered errors.
     * @return
     * It returns a FullReaction, you can use it to remove the catchError Reaction from the box.
     */
    catchError(reaction: ReactionCatchError, ...filter: ErrorFilter[]) : FullReaction<ReactionCatchError>
    {
        const fullReaction = new FullReaction<ReactionCatchError>(reaction,filter);
        this.errorCatchReactionBox.addItem(fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns an CatchErrorBuilder to easy catch an error.
     */
    buildCatchError() : CatchErrorBuilder<ResponseReactionBox>
    {
        return new CatchErrorBuilder<ResponseReactionBox>(this);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove an catchError reaction with the FullReaction.
     * @param fullReaction
     */
    rmCatchError(fullReaction : FullReaction<ReactionCatchError>) : void {
        this.errorCatchReactionBox.removeItem(fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on successful response
     * @example
     * onSuccessful((result,response) => {});
     * onSuccessful((result,response) => {},2000);
     * @param reaction
     * @param statusCode
     * @return
     * It returns a FullReaction, you can use it to remove the onSuccessful Reaction from the box.
     */
    onSuccessful(reaction: ReactionOnSuccessful, statusCode ?: number | string) : FullReaction<ReactionOnSuccessful>
    {
        const fullReaction = new FullReaction<ReactionOnSuccessful>(reaction,{statusCode : statusCode});
        this.successfulReactionBox.addItem(fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove an onSuccessful reaction with the FullReaction.
     * @param fullReaction
     */
    offSuccessful(fullReaction : FullReaction<ReactionOnSuccessful>) : void {
        this.successfulReactionBox.removeItem(fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on an response
     * It does not matter if the response is successful or has errors.
     * @example
     * onResponse((response) => {});
     * @param reaction
     * @return
     * It returns a FullReaction, you can use it to remove the onResponse Reaction from the box.
     */
    onResponse(reaction: ReactionOnResponse) : FullReaction<ReactionOnResponse>
    {
        const fullReaction = new FullReaction<ReactionOnResponse>(reaction);
        this.responseReactionBox.addItem(fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove an onResponse reaction with the FullReaction.
     * @param fullReaction
     */
    offResponse(fullReaction : FullReaction<ReactionOnResponse>) : void {
        this.responseReactionBox.removeItem(fullReaction);
    }

    _trigger(response : Response)
    {
        if(this.activate)
        {
            if(response.isSuccessful()) {
                this.successfulReactionBox.forEachSync(async (fullReaction : FullReaction<ReactionOnSuccessful>) =>
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
}

export = ResponseReactionBox;