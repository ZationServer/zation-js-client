/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */


import {HttpGetReq}            from "../../helper/constants/internal";
import {AbstractRequestHelper} from "./abstractRequestHelper";
import {Zation}                from "../../mainApi/zation";
import {ZationRequest}         from "../main/zationRequest";
import {AuthRequest}           from "../main/authRequest";

export class AuthRequestHelper extends AbstractRequestHelper<AuthRequestHelper>
{
    private _authData : object = {};
    private _httpAttachedContent : {key : string,data : string | Blob}[] = [];

    constructor(zation : Zation) {
        super(zation);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the authData of the request.
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
        const req = new AuthRequest(this._authData,this._protocol);
        req.setAckTimeout(this._ackTimeout);
        req.setHttpAttachedContent(this._httpAttachedContent);
        return req;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Attach http content to http request.
     * Can be used for attaching files.
     * The attached http content will only used by post requests.
     * @param key
     * @param data
     * @default []
     */
    attachHttpContent(key : string,data : string | Blob) : AuthRequestHelper {
        this._httpAttachedContent.push({key,data});
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Builds an get request.
     * Get request is not contains the atteched http content.
     * @return
     * Returns the full get reuqest as an string.
     */
    buildGetRequest() : string
    {
        //system
        let params = `?${HttpGetReq.SYSTEM}=${this.zation.getSystem()}`;
        //version
        params += `&${HttpGetReq.VALI_REQ}=${this.zation.getVersion()}`;

        if(this._authData !== undefined){
            //input
            params += `&${HttpGetReq.INPUT}=${JSON.stringify(this._authData)}`;
        }
        //auth req
        params += `&${HttpGetReq.AUTH_REQ}=true`;
        return this.zation.getServerAddress()+params;
    }

    protected self() : AuthRequestHelper {
        return this;
    }

}



