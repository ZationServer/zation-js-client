/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */


import {HttpGetReq}            from "../../constants/internal";
import {AbstractRequestBuilder} from "./abstractRequestBuilder";
import {Zation}                from "../../../core/zation";
import {ZationRequest}         from "../main/zationRequest";
import {AuthRequest}           from "../main/authRequest";

export class AuthRequestBuilder extends AbstractRequestBuilder<AuthRequestBuilder>
{
    private _authData: any = undefined;
    private _httpAttachedContent: {key: string,data: string | Blob}[] = [];

    constructor(zation: Zation) {
        super(zation);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the authData of the request.
     * @param data
     * @default undefined (equals to {} on server param based input).
     */
    authData(data: any): AuthRequestBuilder {
        this._authData = data;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Builds the request and return it.
     * Notice that the request not contains the reactions!
     */
    buildRequest(): ZationRequest
    {
        const req = new AuthRequest(this._authData,this._protocol);
        req.setApiLevel(this._apiLevel);
        req.setTimeout(this._timeout);
        req.setWaitForConnection(this._waitForConnection);
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
    attachHttpContent(key: string,data: string | Blob): AuthRequestBuilder {
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
    buildGetRequest(): string
    {
        //system
        let params = `?${HttpGetReq.SYSTEM}=${this.zation.getSystem()}`;
        //version
        params += `&${HttpGetReq.VALI_REQ}=${this.zation.getVersion()}`;

        if(this._apiLevel){
            params += `&${HttpGetReq.API_LEVEL}=${this._apiLevel}`;
        }

        if(this._authData !== undefined){
            //input
            params += `&${HttpGetReq.INPUT}=${encodeURIComponent(JSON.stringify(this._authData))}`;
        }
        //auth req
        params += `&${HttpGetReq.AUTH_REQ}=true`;
        return this.zation.getServerAddress()+params;
    }

    protected self(): AuthRequestBuilder {
        return this;
    }

}



