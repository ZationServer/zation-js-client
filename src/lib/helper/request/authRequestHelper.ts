/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import Zation = require("../../api/zation");
import AuthRequest = require("../../api/authRequest");
import ZationRequest = require("./zationRequest");
import AbstractRequestHelper = require("./abstractRequestHelper");
import {HttpGetReq} from "../constants/internal";

class AuthRequestHelper extends AbstractRequestHelper<AuthRequestHelper>
{
    private _authData : object = {};

    constructor(zation : Zation) {
        super(zation);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the authData from the request.
     * @param data
     * @default {}
     */
    authData(data : object | any[]) : AuthRequestHelper {
        this._authData = data;
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
        return new AuthRequest(this._authData,this._protocol);
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
        params += `&${HttpGetReq.VALI_REQ}=${this.zation.getVersion()}`;
        //input
        params += `&${HttpGetReq.INPUT}=${JSON.stringify(this._authData)}`;
        //auth req
        params += `&${HttpGetReq.AUTH_REQ}=true`;
        return this.zation.getServerAddress()+params;
    }

    protected self() : AuthRequestHelper {
        return this;
    }

}

export = AuthRequestHelper;

