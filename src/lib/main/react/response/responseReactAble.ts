/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {
    ResponseReactionOnError,
    ResponseReactionOnResponse,
    ResponseReactionOnSuccessful
} from "../reaction/reactionHandler";

export interface ResponseReactAble
{
    /**
     * @description
     * Catch an error in the response.
     * It makes sense to catch specific errors first and at the end to catch all the ones left over.
     * @example
     * onError((filteredErrors,response) => {},{name: 'passwordError'});
     *
     * -FilterExamples-
     * For errors with the name:
     * {name: 'errorName1'}
     * For errors with the names:
     * {name: ['errorName1','errorName2']}
     * For errors with the group:
     * {group: 'errorGroup1'}
     * For errors with the groups:
     * {group: ['errorGroup1','errorGroup2']}
     * For errors with the type:
     * {type: 'errorType1'}
     * For errors with the types:
     * {type: ['errorType1','errorType2']}
     * For errors with has all keys and values in the info:
     * {info: {inputPath: 'name', inputValue: 'value'}}
     * For errors with has at least one of all keys and values in the info:
     * {info: [{inputPath: 'name'},{inputPath: 'firstName'}]}
     * For errors with the info key:
     * {infoKey: 'inputPath'}
     * For errors with at least one of the info keys:
     * {infoKey: ['inputPath','inputValue']}
     * For errors with all of the info keys:
     * {infoKey: [['inputPath','inputValue']]}
     * For errors with the info value:
     * {infoValue: 'name'}
     * For errors with at least one of the info values:
     * {infoValue: ['name','firstName']}
     * For errors with all of the info values:
     * {infoValue: [['value1','value2']]}
     * For errors there from the zation system:
     * {fromZationSystem: true}
     * For errors there not from the zation system:
     * {fromZationSystem: false}
     * You can combine all of this properties.
     * @param reaction
     * @param filter
     * The purpose of this param is to filter the BackErrors errors.
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
    catchError(reaction: ResponseReactionOnError, ...filter: object[]): any;
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on an error in the response.
     * The difference to the catch error is that the filtered errors are not caught.
     * And you always respond to all the errors of the response, no matter if they were caught before.
     * @example
     * onError((filteredErrors,response) => {},{name: 'passwordError'});
     *
     * -FilterExamples-
     * For errors with the name:
     * {name: 'errorName1'}
     * For errors with the names:
     * {name: ['errorName1','errorName2']}
     * For errors with the group:
     * {group: 'errorGroup1'}
     * For errors with the groups:
     * {group: ['errorGroup1','errorGroup2']}
     * For errors with the type:
     * {type: 'errorType1'}
     * For errors with the types:
     * {type: ['errorType1','errorType2']}
     * For errors with has all keys and values in the info:
     * {info: {inputPath: 'name', inputValue: 'value'}}
     * For errors with has at least one of all keys and values in the info:
     * {info: [{inputPath: 'name'},{inputPath: 'firstName'}]}
     * For errors with the info key:
     * {infoKey: 'inputPath'}
     * For errors with at least one of the info keys:
     * {infoKey: ['inputPath','inputValue']}
     * For errors with all of the info keys:
     * {infoKey: [['inputPath','inputValue']]}
     * For errors with the info value:
     * {infoValue: 'name'}
     * For errors with at least one of the info values:
     * {infoValue: ['name','firstName']}
     * For errors with all of the info values:
     * {infoValue: [['value1','value2']]}
     * For errors there from the zation system:
     * {fromZationSystem: true}
     * For errors there not from the zation system:
     * {fromZationSystem: false}
     * You can combine all of this properties.
     * @param reaction
     * @param filter
     * The purpose of this param is to filter the BackErrors errors.
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
    onError(reaction: ResponseReactionOnError, ...filter: object[]): any;
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
    onSuccessful(reaction: ResponseReactionOnSuccessful, statusCode?: any): any;
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
    onResponse(reaction: ResponseReactionOnResponse): any
}



