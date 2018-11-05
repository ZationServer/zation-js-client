/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import Zation = require("../../api/zation");
// noinspection TypeScriptPreferShortImport
import {ProtocolType} from "../constants/protocolType";
import WsRequest = require("../../api/wsRequest");
import HttpRequest = require("../../api/httpRequest");
import ZationRequest = require("./zationRequest");
import AbstractRequestHelper = require("./abstractRequestHelper");
import {HttpGetReq} from "../constants/internal";

class RequestHelper extends AbstractRequestHelper<RequestHelper>
{
    private _useAuth : boolean = true;
    private _controllerName : string = '';
    private _systemController : boolean = false;
    private _data : object = {};

    constructor(zation : Zation) {
        super(zation);
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
     * Builds the request and return it.
     * Notice that the request not contains the reactions!
     */
    buildRequest() : ZationRequest
    {
        let request;
        //buildRequest
        if(this._protocol === ProtocolType.WebSocket) {
            request = new WsRequest(this._controllerName,this._data,this._systemController);
        }
        else {
            request = new HttpRequest(this._controllerName,this._data,this._useAuth,this._systemController)
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
        let params = `?${HttpGetReq.SYSTEM}=${this.zation.getSystem()}`;
        //version
        params += `&${HttpGetReq.VERSION}=${this.zation.getVersion()}`;
        //input
        params += `&${HttpGetReq.INPUT}=${JSON.stringify(this._data)}`;
        //add sign token
        if(this._useAuth && this.zation._getAuthEngine().hasSignToken()) {
            params += `&${HttpGetReq.TOKEN}=${this.zation._getAuthEngine().getSignToken()}`;
        }
        //controller
        if(this._systemController) {
            params += `&${HttpGetReq.SYSTEM_CONTROLLER}=${this._controllerName}`;
        }
        else {
            params += `&${HttpGetReq.CONTROLLER}=${this._controllerName}`;
        }
        return this.zation.getServerAddress()+params;
    }

    protected self() : RequestHelper{
        return this;
    }

}

export = RequestHelper;

