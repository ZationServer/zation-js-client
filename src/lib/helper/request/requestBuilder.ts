/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import Zation = require("../../api/zation");
import ResponseReactionBox = require("../../api/responseReactionBox");
import Response = require("../../api/response");
import AuthRequest = require("../../api/authRequest");
import {ProtocolType} from "../constants/protocolType";
import {ProgressHandler} from "./progressHandler";
import {ReactionOnError, ReactionOnSuccessful} from "../react/reaction/reactionHandler";
import {OnErrorBuilder} from "../react/onErrorBuilder/onErrorBuilder";
import {CatchErrorBuilder} from "../react/onErrorBuilder/catchErrorBuilder";
import {ErrorFilter} from "../filter/errorFilter";
import WsRequest = require("../../api/wsRequest");
import HttpRequest = require("../../api/httpRequest");

class RequestBuilder
{
    private readonly zation : Zation;

    private _protocol : ProtocolType = ProtocolType.WebSocket;
    private _useAuth : boolean = true;
    private _authRequest : boolean = false;
    private _controllerName : string = '';
    private _systemController : boolean = false;
    private _data : object = {};
    private _progressHandler : ProgressHandler[] = [];
    private _responseReactionBox : ResponseReactionBox;
    private _addedResponseReactionBoxes : ResponseReactionBox[] = [];

    constructor(zation : Zation)
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
    protocol(protocolType : ProtocolType) : RequestBuilder {
        this._protocol = protocolType;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the protocolType to web socket
     */
    isWs() : RequestBuilder {
        this._protocol = ProtocolType.WebSocket;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the protocolType to web socket
     */
    isWebSocket() : RequestBuilder {
        this.isWs();
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the protocolType to http
     */
    isHttp() : RequestBuilder {
        this._protocol = ProtocolType.Http;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set if it is an auth request
     * @param isAuthRequest
     * @default false
     */
    authRequest(isAuthRequest : boolean) : RequestBuilder {
        this._authRequest = isAuthRequest;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set request should use authentication if it is an http requst and client is authenticated.
     * @param useAuth
     * @default true
     */
    useAuth(useAuth : boolean) : RequestBuilder {
        this._useAuth = useAuth;
        return this;
    }


    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the controller name from the request.
     * @param controllerName
     * @default ''
     */
    controller(controllerName : string) : RequestBuilder {
        this._controllerName = controllerName;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set is systemController from the request.
     * @default false
     * @param isSystemController
     */
    systemController(isSystemController : boolean) : RequestBuilder {
        this._systemController = isSystemController;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the data from the request.
     * @param data
     * @default {}
     */
    data(data : object | any[]) : RequestBuilder {
        this._data = data;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Add an onProgress handler.
     * @param progressHandler
     */
    onProgress(progressHandler : ProgressHandler) : RequestBuilder {
        this._progressHandler.push(progressHandler);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on the response with responseReaction box/es.
     * @param responseReactionBox
     */
    reactWith(...responseReactionBox : ResponseReactionBox[]) : RequestBuilder
    {
        for(let i = 0;  i  < responseReactionBox.length; i++)
        {
            this._addedResponseReactionBoxes.push(responseReactionBox[i]);
        }
        return this;
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
     */
    onError(reaction: ReactionOnError, filter?: ErrorFilter) : RequestBuilder
    {
        this._responseReactionBox.onError(reaction,filter);
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
     */
    catchError(reaction: ReactionOnError, filter?: ErrorFilter) : RequestBuilder
    {
        this._responseReactionBox.catchError(reaction,filter);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns an OnErrorBuilder to easy react on error.
     */
    buildOnError() : OnErrorBuilder<RequestBuilder> {
        return new OnErrorBuilder<RequestBuilder>(this);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns an CatchErrorBuilder to easy catch an error.
     */
    buildCatchError() : CatchErrorBuilder<RequestBuilder> {
        return new CatchErrorBuilder<RequestBuilder>(this);
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
    onSuccessful(reaction: ReactionOnSuccessful, statusCode ?: number | string) : RequestBuilder {
        this._responseReactionBox.onSuccessful(reaction,statusCode);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Send the request and returns the response after trigger the reactions from the build.
     * @throws ConnectionNeededError
     */
    async send() : Promise<Response>
    {
        let request;
        //buildRequest
        if(this._authRequest) {
            request = new AuthRequest(this._data,this._protocol)
        }
        else {
            if(this._protocol === ProtocolType.WebSocket) {
                request = new WsRequest(this._controllerName,this._data,this._systemController);
            }
            else {
                request = new HttpRequest(this._controllerName,this._data,this._useAuth,this._systemController)
            }
        }

        //send
        const resp = await this.zation.send(request,(...args) => {
            this._progressHandler.forEach((handler)=>
            {
                handler(...args);
            })
        });

        //_trigger boxes
        this._responseReactionBox._trigger(resp);
        this._addedResponseReactionBoxes.forEach((box) => {
            box._trigger(resp);
        });

        return resp;
    }

}

export = RequestBuilder;

