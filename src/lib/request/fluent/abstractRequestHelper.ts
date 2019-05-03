/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {ProgressHandler} from "../helper/progressHandler";
import {
    ResponseReactionOnError,
    ResponseReactionOnResponse,
    ResponseReactionOnSuccessful
} from "../../react/reaction/reactionHandler";
import {OnErrorBuilder} from "../../react/error/onErrorBuilder";
import {CatchErrorBuilder} from "../../react/error/catchErrorBuilder";
import {ErrorFilter} from "../../react/error/errorFilter";
import {ProtocolType} from "../../helper/constants/protocolType";
import {Zation} from "../../mainApi/zation";
import {ResponseReactionBox} from "../../react/reactionBoxes/responseReactionBox";
import {ZationRequest} from "../main/zationRequest";
import {Response} from "../../response/response";

export abstract class AbstractRequestHelper<T>
{
    protected readonly zation : Zation;

    protected _protocol : ProtocolType = ProtocolType.WebSocket;
    protected _ackTimeout : null | number | undefined;
    private _progressHandler : ProgressHandler[] = [];
    private _responseReactionBox : ResponseReactionBox;
    private _reactionAdded : boolean = false;
    private _addedResponseReactionBoxes : ResponseReactionBox[] = [];

    protected constructor(zation : Zation)
    {
        this.zation = zation;
        this._responseReactionBox = new ResponseReactionBox();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the protocolType
     * @param protocolType
     * @default webSocket
     */
    protocol(protocolType : ProtocolType) : T {
        this._protocol = protocolType;
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the protocolType to web socket.
     * @param value
     */
    isWs(value : boolean = true) : T {
        this._protocol = value ? ProtocolType.WebSocket : ProtocolType.Http;
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the protocolType to web socket.
     * @param value
     */
    isWebSocket(value : boolean = true) : T {
        this.isWs(value);
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the protocolType to http.
     * @param value
     */
    isHttp(value : boolean = true) : T {
        this._protocol = value ? ProtocolType.Http : ProtocolType.WebSocket;
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the ack timeout of the request.
     * Value can be null which means the ack timeout is disabled or
     * undefined that means use the default from socketCluster that is 10s or
     * it can be a number that indicates the milliseconds.
     * Notice that the ack timeout works only with WebSocket requests.
     * @param timeout
     */
    ackTimeout(timeout : null | undefined | number) : T {
        this._ackTimeout = timeout;
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Add an onProgress handler.
     * @param progressHandler
     */
    onProgress(progressHandler : ProgressHandler) : T {
        this._progressHandler.push(progressHandler);
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on the response with responseReaction box/es.
     * @param responseReactionBox
     */
    reactWith(...responseReactionBox : ResponseReactionBox[]) : T
    {
        if(this._reactionAdded) {
            this._addedResponseReactionBoxes.push(this._responseReactionBox);
        }
        for(let i = 0;  i  < responseReactionBox.length; i++) {
            this._addedResponseReactionBoxes.push(responseReactionBox[i]);
        }
        this._responseReactionBox = new ResponseReactionBox();
        this._reactionAdded = false;
        return this.self();
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
     * For errors with has all keys and values in the info:
     * {info : {inputPath : 'name', inputValue : 'value'}}
     * For errors with has at least one of all keys and values in the info:
     * {info : [{inputPath : 'name'},{inputPath : 'firstName'}]}
     * For errors with the info key:
     * {infoKey : 'inputPath'}
     * For errors with at least one of the info keys:
     * {infoKey : ['inputPath','inputValue']}
     * For errors with all of the info keys:
     * {infoKey : [['inputPath','inputValue']]}
     * For errors with the info value:
     * {infoValue : 'name'}
     * For errors with at least one of the info values:
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
     * The purpose of this param is to filter the BackErrors errors.
     * Look in the examples how you can use it.
     * You also can add more than one filter.
     * The filter are linked with OR so the filtered errors
     * of each filter are countend together.
     * If there is more than one error at the end,
     * the reaction wil be triggerd with all filtered errors.
     */
    onError(reaction: ResponseReactionOnError, ...filter: ErrorFilter[]) : T
    {
        this._responseReactionBox.onError(reaction,...filter);
        this._reactionAdded = true;
        return this.self();
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
     * For errors with has all keys and values in the info:
     * {info : {inputPath : 'name', inputValue : 'value'}}
     * For errors with has at least one of all keys and values in the info:
     * {info : [{inputPath : 'name'},{inputPath : 'firstName'}]}
     * For errors with the info key:
     * {infoKey : 'inputPath'}
     * For errors with at least one of the info keys:
     * {infoKey : ['inputPath','inputValue']}
     * For errors with all of the info keys:
     * {infoKey : [['inputPath','inputValue']]}
     * For errors with the info value:
     * {infoValue : 'name'}
     * For errors with at least one of the info values:
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
     * The purpose of this param is to filter the BackErrors errors.
     * Look in the examples how you can use it.
     * You also can add more than one filter.
     * The filter are linked with OR so the filtered errors
     * of each filter are countend together.
     * If there is more than one error at the end,
     * the reaction wil be triggerd with all filtered errors.
     */
    catchError(reaction: ResponseReactionOnError, ...filter: ErrorFilter[]) : T
    {
        this._responseReactionBox.catchError(reaction,...filter);
        this._reactionAdded = true;
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns an OnErrorBuilder to easy react on error.
     */
    buildOnError() : OnErrorBuilder<AbstractRequestHelper<T>,T> {
        return new OnErrorBuilder<AbstractRequestHelper<T>,T>(this);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns an CatchErrorBuilder to easy catch an error.
     */
    buildCatchError() : CatchErrorBuilder<AbstractRequestHelper<T>,T> {
        return new CatchErrorBuilder<AbstractRequestHelper<T>,T>(this);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on successful response.
     * @example
     * onSuccessful((result,response) => {});
     * onSuccessful((result,response) => {},2000);
     * @param reaction
     * @param statusCode
     * can be provided to filter on with an status code.
     */
    onSuccessful(reaction: ResponseReactionOnSuccessful, statusCode ?: number | string) : T {
        this._responseReactionBox.onSuccessful(reaction,statusCode);
        this._reactionAdded = true;
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on response.
     * @example
     * onResponse((response) => {});
     * @param reaction
     */
    onResponse(reaction:  ResponseReactionOnResponse) : T {
        this._responseReactionBox.onResponse(reaction);
        this._reactionAdded = true;
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Send the request and returns the response after trigger the reactions from the build.
     * @throws ConnectionNeededError
     * @param triggerZationBoxes
     * Specifies if the zation response boxes are triggerd.
     * The default value is true if at least one reaction is added in the requestBuilder.
     * Otherwise you have the possibility to react with the response on specific things and
     * then trigger the zation response reaction boxes (using response.react().zationReact()).
     */
    async send(triggerZationBoxes : boolean = this._reactionAdded || this._addedResponseReactionBoxes.length > 0) : Promise<Response>
    {
        return await this.zation.send
        (
            this.buildRequest(),
            (...args) => {
                this._progressHandler.forEach((handler)=>
                {
                    handler(...args);
                })},
            triggerZationBoxes,
            this._responseReactionBox,
            ...this._addedResponseReactionBoxes
        );
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Builds the request and return it.
     * Notice that the request not contains the reactions!
     */
    abstract buildRequest() : ZationRequest;

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Builds an get request.
     * @return
     * Returns the full get reuqest as an string.
     */
    abstract buildGetRequest() : string;

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns self.
     * For fluent programing with inheritance.
     */
    protected abstract self() : T;
}


