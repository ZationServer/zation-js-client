/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import ResponseReactAble        = require("../responseReactionEngine/responseReactAble");
import {ReactionCatchError, ReactionOnError, ReactionOnSuccessful} from "./reactionHandler";
import {OnErrorBuilder}         from "../onErrorBuilder/onErrorBuilder";
import {CatchErrorBuilder}      from "../onErrorBuilder/catchErrorBuilder";
import Response                 = require("../../../api/response");
import {ErrorFilter}            from "../../filter/errorFilter";
import {TriggerResponseEngine}  from "../responseReactionEngine/triggerResponseEngine";
import FullReaction             = require("./fullReaction");
import ResponseReactionBox = require("../../../api/responseReactionBox");

class ResponseReact implements ResponseReactAble
{
    private readonly response : Response;

    constructor(response : Response)
    {
        this.response = response;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the response.
     */
    getResponse() : Response {
        return this.response;
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
     */
    onError(reaction: ReactionOnError, ...filter : ErrorFilter[]) : ResponseReact
    {
        TriggerResponseEngine.onError(this.response,new FullReaction<ReactionOnError>(reaction,filter));
        return this;
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
     */
    catchError(reaction: ReactionCatchError, ...filter : ErrorFilter[]) : ResponseReact
    {
        TriggerResponseEngine.catchError(this.response,new FullReaction<ReactionCatchError>(reaction,filter));
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns an OnErrorBuilder to easy react on error.
     */
    buildOnError() : OnErrorBuilder<ResponseReact>
    {
        return new OnErrorBuilder<ResponseReact>(this);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns an CatchErrorBuilder to easy catch an error.
     */
    buildCatchError() : CatchErrorBuilder<ResponseReact>
    {
        return new CatchErrorBuilder<ResponseReact>(this);
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
     * can be provided to filter on with an status code.
     */
    onSuccessful(reaction: ReactionOnSuccessful, statusCode ?: number | string) : ResponseReact
    {
        TriggerResponseEngine.
        onSuccessful(this.response,new FullReaction<ReactionOnSuccessful>(reaction,{statusCode : statusCode}));
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React with responseReaction box/es.
     * @param respReactionBoxes
     */
    reactWith(...respReactionBoxes : ResponseReactionBox[]) : ResponseReact
    {
        respReactionBoxes.forEach((box : ResponseReactionBox) => {
            box._trigger(this.response);
        });
        return this;
    }
}

export = ResponseReact;

