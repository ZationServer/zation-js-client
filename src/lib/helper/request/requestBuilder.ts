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
import {ReactionOnError, ReactionOnSuccessful} from "../react/reactionHandler";
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
    private _data : object = {};
    private _progressHandler : ProgressHandler[] = [];
    private _responseReactionBox : ResponseReactionBox;
    private _addedResponseReactionBoxes : ResponseReactionBox[] = [];

    constructor(zation : Zation)
    {
        this.zation = zation;
        this._responseReactionBox = new ResponseReactionBox();
    }

    protocol(protocolType : ProtocolType) : RequestBuilder {
        this._protocol = protocolType;
        return this;
    }

    isWs() : RequestBuilder {
        this._protocol = ProtocolType.WebSocket;
        return this;
    }

    isWebSocket() : RequestBuilder {
        this.isWs();
        return this;
    }

    isHttp() : RequestBuilder {
        this._protocol = ProtocolType.Http;
        return this;
    }

    authRequest(isAuthRequest : boolean) : RequestBuilder {
        this._authRequest = isAuthRequest;
        return this;
    }

    useAuth(useAuth : boolean) : RequestBuilder {
        this._useAuth = useAuth;
        return this;
    }

    controller(controllerName : string) : RequestBuilder {
        this._controllerName = controllerName;
        return this;
    }

    data(data : object | any[]) : RequestBuilder {
        this._data = data;
        return this;
    }

    onProgress(progressHandler : ProgressHandler) : RequestBuilder {
        this._progressHandler.push(progressHandler);
        return this;
    }

    reactWith(...responseReactionBox : ResponseReactionBox[]) : RequestBuilder
    {
        for(let i = 0;  i  < responseReactionBox.length; i++)
        {
            this._addedResponseReactionBoxes.push(responseReactionBox[i]);
        }
        return this;
    }

    onError(reaction: ReactionOnError, filter?: ErrorFilter) : RequestBuilder
    {
        this._responseReactionBox.onError(reaction,filter);
        return this;
    }

    catchError(reaction: ReactionOnError, filter?: ErrorFilter) : RequestBuilder
    {
        this._responseReactionBox.catchError(reaction,filter);
        return this;
    }

    buildOnError() : OnErrorBuilder<RequestBuilder> {
        return new OnErrorBuilder<RequestBuilder>(this);
    }

    buildCatchError() : CatchErrorBuilder<RequestBuilder> {
        return new CatchErrorBuilder<RequestBuilder>(this);
    }

    onSuccessful(reaction: ReactionOnSuccessful, statusCode ?: number | string) : RequestBuilder {
        this._responseReactionBox.onSuccessful(reaction,statusCode);
        return this;
    }

    async send() : Promise<Response>
    {
        let request;

        //buildRequest
        if(this._authRequest) {
            request = new AuthRequest(this._data,this._protocol)
        }
        else {
            if(this._protocol === ProtocolType.WebSocket) {
                request = new WsRequest(this._controllerName,this._data);
            }
            else {
                request = new HttpRequest(this._controllerName,this._data,this._useAuth)
            }
        }

        //send
        const resp = await this.zation.send(request,(...args) =>
        {
            this._progressHandler.forEach((handler)=>
            {
                handler(...args);
            })
        });

        //trigger boxes
        this._responseReactionBox.trigger(resp);
        this._addedResponseReactionBoxes.forEach((box) =>
        {
            box.trigger(resp);
        });

        return resp;
    }


}

export = RequestBuilder;

