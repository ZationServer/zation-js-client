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
import ResponseReactAble = require("../helper/react/responseReactionEngine/responseReactAble");
import {ErrorFilter}       from "../helper/filter/errorFilter";
import Response          = require("./response");
import {TriggerResponseEngine} from "../helper/react/responseReactionEngine/triggerResponseEngine";
import SboxMapper = require("../helper/box/sboxMapper");

enum MapKey
{
   CATCH_ERROR,
   ERROR,
   SUCCESSFUL,
   RESPONSE
}

class ResponseReactionBox extends ReactionBox implements ResponseReactAble
{

    private readonly map: SboxMapper<FullReaction<any>> = new SboxMapper<FullReaction<any>>();
    private lastFullReactionTmp : FullReaction<any>;

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
     * It returns the responseReactionBox, to remove the on ErrorReaction from the box
     * you can use the getLastReaction method which is return the FullReaction.
     */
    onError(reaction: ResponseReactionOnError, ...filter: ErrorFilter[]) : ResponseReactionBox
    {
        const fullReaction = new FullReaction<ResponseReactionOnError>(reaction,filter);
        this.map.add(MapKey.ERROR,fullReaction);
        this.lastFullReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns an OnErrorBuilder to easy react on error.
     */
    buildOnError() : OnErrorBuilder<ResponseReactionBox,ResponseReactionBox>
    {
        return new OnErrorBuilder<ResponseReactionBox,ResponseReactionBox>(this);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove an OnError reaction with the FullReaction.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offError(fullReaction ?: FullReaction<any>) : ResponseReactionBox {
        this.map.remove(MapKey.ERROR,fullReaction);
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
     * It returns the responseReactionBox, to remove the CatchErrorReaction from the box
     * you can use the getLastReaction method which is return the FullReaction.
     */
    catchError(reaction: ResponseReactionCatchError, ...filter: ErrorFilter[]) : ResponseReactionBox
    {
        const fullReaction = new FullReaction<ResponseReactionCatchError>(reaction,filter);
        this.map.add(MapKey.CATCH_ERROR,fullReaction);
        this.lastFullReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns an CatchErrorBuilder to easy catch an error.
     */
    buildCatchError() : CatchErrorBuilder<ResponseReactionBox,ResponseReactionBox>
    {
        return new CatchErrorBuilder<ResponseReactionBox,ResponseReactionBox>(this);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove an catchError reaction with the FullReaction.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    rmCatchError(fullReaction ?: FullReaction<any>) : ResponseReactionBox {
        this.map.remove(MapKey.CATCH_ERROR,fullReaction);
        return this;
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
     * It returns the responseReactionBox, to remove the on SuccessfulReaction from the box
     * you can use the getLastReaction method which is return the FullReaction.
     */
    onSuccessful(reaction: ResponseReactionOnSuccessful, statusCode ?: number | string) : ResponseReactionBox
    {
        const fullReaction = new FullReaction<ResponseReactionOnSuccessful>(reaction,{statusCode : statusCode});
        this.map.add(MapKey.SUCCESSFUL,fullReaction);
        this.lastFullReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove an onSuccessful reaction with the FullReaction.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offSuccessful(fullReaction ?: FullReaction<any>) : ResponseReactionBox {
        this.map.remove(MapKey.SUCCESSFUL,fullReaction);
        return this;
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
     * It returns the responseReactionBox, to remove the on ResponseReaction from the box
     * you can use the getLastReaction method which is return the FullReaction.
     */
    onResponse(reaction: ResponseReactionOnResponse) : ResponseReactionBox
    {
        const fullReaction = new FullReaction<ResponseReactionOnResponse>(reaction);
        this.map.add(MapKey.RESPONSE,fullReaction);
        this.lastFullReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove an onResponse reaction with the FullReaction.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offResponse(fullReaction ?: FullReaction<any>) : ResponseReactionBox {
        this.map.remove(MapKey.RESPONSE,fullReaction);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Used internally.
     * Only use this method carefully.
     */
    async _trigger(response : Response)
    {
        if(this.activate)
        {
            if(response.isSuccessful()) {
                const sucBox = this.map.tryGet(MapKey.SUCCESSFUL);
                if(sucBox) {
                    await sucBox.forEach(async (fullReaction : FullReaction<ResponseReactionOnSuccessful>) => {
                        await TriggerResponseEngine.onSuccessful(response,fullReaction);
                    });
                }
            }
            else {
                const catchBox = this.map.tryGet(MapKey.CATCH_ERROR);
                const errorBox = this.map.tryGet(MapKey.ERROR);

                if(catchBox) {
                    await catchBox.forEach(async (fullReaction : FullReaction<ResponseReactionCatchError>) => {
                        await TriggerResponseEngine.catchError(response,fullReaction);
                    });
                }

                if(errorBox) {
                    await errorBox.forEachAll(async (fullReaction : FullReaction<ResponseReactionOnError>) => {
                        await TriggerResponseEngine.onError(response,fullReaction);
                    });
                }
            }
            const respBox = this.map.tryGet(MapKey.RESPONSE);
            if(respBox) {
                await respBox.forEachAll(async (fullReaction : FullReaction<ResponseReactionOnResponse>) => {
                    await fullReaction.getReactionHandler()(response);
                });
            }
        }
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the last added FullReaction, you can use it to remove the reaction from the box
     * by calling the specific off/rm method.
     * @return
     * It returns the last added FullReaction.
     */
    getLastReaction() : FullReaction<any> {
        return this.lastFullReactionTmp;
    }
}

export = ResponseReactionBox;