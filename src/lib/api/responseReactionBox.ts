/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import ReactionBox       = require("../helper/react/box/reactionBox");
import {OnErrorBuilder}    from "../helper/react/onErrorBuilder/onErrorBuilder";
import {CatchErrorBuilder} from "../helper/react/onErrorBuilder/catchErrorBuilder";
import {
    ResponseReactionCatchError,
    ResponseReactionOnError,
    ResponseReactionOnResponse,
    ResponseReactionOnSuccessful
} from "../helper/react/reaction/reactionHandler";
import FullReaction      = require("../helper/react/reaction/fullReaction");
import Box               = require("../helper/box/box");
import ResponseReactAble = require("../helper/react/responseReactionEngine/responseReactAble");
import {ErrorFilter}       from "../helper/filter/errorFilter";
import Response          = require("./response");
import {TriggerResponseEngine} from "../helper/react/responseReactionEngine/triggerResponseEngine";

class ResponseReactionBox extends ReactionBox implements ResponseReactAble
{

    private readonly errorCatchReactionBox : Box<FullReaction<ResponseReactionCatchError>>
        = new Box<FullReaction<ResponseReactionCatchError>>();

    private readonly errorReactionBox : Box<FullReaction<ResponseReactionOnError>>
        = new Box<FullReaction<ResponseReactionOnError>>();

    private readonly successfulReactionBox : Box<FullReaction<ResponseReactionOnSuccessful>>
        = new Box<FullReaction<ResponseReactionOnSuccessful>>();

    private readonly responseReactionBox : Box<FullReaction<ResponseReactionOnResponse>>
        = new Box<FullReaction<ResponseReactionOnResponse>>();

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Creates a new ResponseReactionBox.
     * This box can be linked to the zation client.
     */
    constructor() {
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
     * For errors with the group:
     * {group : 'errorGroup1'}
     * For errors with the groups:
     * {group : ['errorGroup1','errorGroup2']}
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
    onError(reaction: ResponseReactionOnError, ...filter: ErrorFilter[]) : FullReaction<ResponseReactionOnError>
    {
        const fullReaction = new FullReaction<ResponseReactionOnError>(reaction,filter);
        this.errorReactionBox.addItem(fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns an OnErrorBuilder to easy react on error.
     */
    buildOnError() : OnErrorBuilder<ResponseReactionBox,FullReaction<ResponseReactionOnError>>
    {
        return new OnErrorBuilder<ResponseReactionBox,FullReaction<ResponseReactionOnError>>(this);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove an OnError reaction with the FullReaction.
     * @param fullReaction
     */
    offError(fullReaction : FullReaction<ResponseReactionOnError>) : void {
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
     * For errors with the group:
     * {group : 'errorGroup1'}
     * For errors with the groups:
     * {group : ['errorGroup1','errorGroup2']}
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
    catchError(reaction: ResponseReactionCatchError, ...filter: ErrorFilter[]) : FullReaction<ResponseReactionCatchError>
    {
        const fullReaction = new FullReaction<ResponseReactionCatchError>(reaction,filter);
        this.errorCatchReactionBox.addItem(fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns an CatchErrorBuilder to easy catch an error.
     */
    buildCatchError() : CatchErrorBuilder<ResponseReactionBox,FullReaction<ResponseReactionCatchError>>
    {
        return new CatchErrorBuilder<ResponseReactionBox,FullReaction<ResponseReactionCatchError>>(this);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove an catchError reaction with the FullReaction.
     * @param fullReaction
     */
    rmCatchError(fullReaction : FullReaction<ResponseReactionCatchError>) : void {
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
    onSuccessful(reaction: ResponseReactionOnSuccessful, statusCode ?: number | string) : FullReaction<ResponseReactionOnSuccessful>
    {
        const fullReaction = new FullReaction<ResponseReactionOnSuccessful>(reaction,{statusCode : statusCode});
        this.successfulReactionBox.addItem(fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove an onSuccessful reaction with the FullReaction.
     * @param fullReaction
     */
    offSuccessful(fullReaction : FullReaction<ResponseReactionOnSuccessful>) : void {
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
    onResponse(reaction: ResponseReactionOnResponse) : FullReaction<ResponseReactionOnResponse>
    {
        const fullReaction = new FullReaction<ResponseReactionOnResponse>(reaction);
        this.responseReactionBox.addItem(fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove an onResponse reaction with the FullReaction.
     * @param fullReaction
     */
    offResponse(fullReaction : FullReaction<ResponseReactionOnResponse>) : void {
        this.responseReactionBox.removeItem(fullReaction);
    }

    async _trigger(response : Response)
    {
        if(this.activate)
        {
            if(response.isSuccessful()) {
                await this.successfulReactionBox.forEach(async (fullReaction : FullReaction<ResponseReactionOnSuccessful>) =>
                {
                    await TriggerResponseEngine.onSuccessful(response,fullReaction);
                });
            }
            else {
                await this.errorCatchReactionBox.forEach(async (fullReaction : FullReaction<ResponseReactionCatchError>) =>
                {
                    await TriggerResponseEngine.catchError(response,fullReaction);
                });

                this.errorReactionBox.forEachSync(async (fullReaction : FullReaction<ResponseReactionOnError>) =>
                {
                    await TriggerResponseEngine.onError(response,fullReaction);
                });
            }
        }
    }
}

export = ResponseReactionBox;