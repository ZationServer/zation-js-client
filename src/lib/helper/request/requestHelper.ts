/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import Zation = require("../../api/zation");
import ResponseReactionBox = require("../../api/responseReactionBox");
import Response = require("../../api/response");
import AuthRequest = require("../../api/authRequest");
// noinspection TypeScriptPreferShortImport
import {ProtocolType} from "../constants/protocolType";
import {ProgressHandler} from "./progressHandler";
import {
    ResponseReactionOnError,
    ResponseReactionOnResponse,
    ResponseReactionOnSuccessful
} from "../react/reaction/reactionHandler";
import {OnErrorBuilder} from "../react/onErrorBuilder/onErrorBuilder";
import {CatchErrorBuilder} from "../react/onErrorBuilder/catchErrorBuilder";
import {ErrorFilter} from "../filter/errorFilter";
import WsRequest = require("../../api/wsRequest");
import HttpRequest = require("../../api/httpRequest");
import Const = require("../constants/constWrapper");
import ZationRequest = require("./zationRequest");

class RequestHelper
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
    private _reactionAdded : boolean = false;
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
    protocol(protocolType : ProtocolType) : RequestHelper {
        this._protocol = protocolType;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the protocolType to web socket
     */
    isWs() : RequestHelper {
        this._protocol = ProtocolType.WebSocket;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the protocolType to web socket
     */
    isWebSocket() : RequestHelper {
        this.isWs();
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the protocolType to http
     */
    isHttp() : RequestHelper {
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
    authRequest(isAuthRequest : boolean) : RequestHelper {
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
    useAuth(useAuth : boolean) : RequestHelper {
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
    controller(controllerName : string) : RequestHelper {
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
    systemController(isSystemController : boolean) : RequestHelper {
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
    data(data : object | any[]) : RequestHelper {
        this._data = data;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Add an onProgress handler.
     * @param progressHandler
     */
    onProgress(progressHandler : ProgressHandler) : RequestHelper {
        this._progressHandler.push(progressHandler);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on the response with responseReaction box/es.
     * @param responseReactionBox
     */
    reactWith(...responseReactionBox : ResponseReactionBox[]) : RequestHelper
    {
        if(this._reactionAdded) {
            this._addedResponseReactionBoxes.push(this._responseReactionBox);
        }
        for(let i = 0;  i  < responseReactionBox.length; i++) {
            this._addedResponseReactionBoxes.push(responseReactionBox[i]);
        }
        this._responseReactionBox = new ResponseReactionBox();
        this._reactionAdded = false;
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
     */
    onError(reaction: ResponseReactionOnError, ...filter: ErrorFilter[]) : RequestHelper
    {
        this._responseReactionBox.onError(reaction,...filter);
        this._reactionAdded = true;
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
     */
    catchError(reaction: ResponseReactionOnError, ...filter: ErrorFilter[]) : RequestHelper
    {
        this._responseReactionBox.catchError(reaction,...filter);
        this._reactionAdded = true;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns an OnErrorBuilder to easy react on error.
     */
    buildOnError() : OnErrorBuilder<RequestHelper,RequestHelper> {
        return new OnErrorBuilder<RequestHelper,RequestHelper>(this);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns an CatchErrorBuilder to easy catch an error.
     */
    buildCatchError() : CatchErrorBuilder<RequestHelper,RequestHelper> {
        return new CatchErrorBuilder<RequestHelper,RequestHelper>(this);
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
    onSuccessful(reaction: ResponseReactionOnSuccessful, statusCode ?: number | string) : RequestHelper {
        this._responseReactionBox.onSuccessful(reaction,statusCode);
        this._reactionAdded = true;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on response.
     * @example
     * onResponse((response) => {});
     * @param reaction
     */
    onResponse(reaction:  ResponseReactionOnResponse) : RequestHelper {
        this._responseReactionBox.onResponse(reaction);
        this._reactionAdded = true;
        return this;
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

        //send
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
    buildRequest() : ZationRequest
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
        return request;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Builds an get request.
     * @return
     * Returns the full get reuqest as an string.
     */
    buildGetRequest() : string
    {
        //system
        let params = `?${Const.Settings.HTTP_GET_REUQEST.SYSTEM}=${this.zation.getSystem()}`;
        //version
        params += `&${Const.Settings.HTTP_GET_REUQEST.VERSION}=${this.zation.getVersion()}`;
        //input
        params += `&${Const.Settings.HTTP_GET_REUQEST.INPUT}=${JSON.stringify(this._data)}`;
        //add sign token
        if(this._useAuth && this.zation._getAuthEngine().hasSignToken()) {
            params += `&${Const.Settings.HTTP_GET_REUQEST.TOKEN}=${this.zation._getAuthEngine().getSignToken()}`;
        }
        if(this._authRequest) {
            params += `&${Const.Settings.HTTP_GET_REUQEST.AUTH_REQ}=true`;
        }
        else{
            if(this._systemController) {
                params += `&${Const.Settings.HTTP_GET_REUQEST.SYSTEM_CONTROLLER}=${this._controllerName}`;
            }
            else {
                params += `&${Const.Settings.HTTP_GET_REUQEST.CONTROLLER}=${this._controllerName}`;
            }
        }
        return this.zation.getServerAddress()+params;
    }

}

export = RequestHelper;
