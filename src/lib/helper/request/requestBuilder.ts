/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import Zation              = require("../../api/zation");
import {ProtocolType}      from "../constants/protocolType";
import {ProgressHandler}   from "./progressHandler";
import ResponseReactionBox = require("../../api/responseReactionBox");
import Response            = require("../../api/response");

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

    reactWith(...responseReactionBox : ResponseReactionBox[])
    {
        for(let i = 0;  i  < responseReactionBox.length; i++)
        {
            this._addedResponseReactionBoxes.push(responseReactionBox[i]);
        }
    }

    async send() : Promise<Response>
    {

    }


}

export = RequestBuilder;

