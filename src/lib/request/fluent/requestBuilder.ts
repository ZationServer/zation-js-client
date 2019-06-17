/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

// noinspection TypeScriptPreferShortImport
import {ProtocolType}          from "../../helper/constants/protocolType";
import {HttpGetReq}            from "../../helper/constants/internal";
import {AbstractRequestBuilder} from "./abstractRequestBuilder";
import {Zation}                from "../../mainApi/zation";
import {ZationRequest}         from "../main/zationRequest";
import {HttpRequest}           from "../main/httpRequest";
import {WsRequest}             from "../main/wsRequest";

export class RequestBuilder extends AbstractRequestBuilder<RequestBuilder>
{
    private _useAuth : boolean = true;
    private _controller : string = '';
    private _systemController : boolean = false;
    private _data : any = undefined;
    private _httpAttachedContent : {key : string,data : string | Blob}[] = [];

    constructor(zation : Zation) {
        super(zation);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set request should use authentication if it is an http request and client is authenticated.
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
     * Set the controller of the request.
     * @param controller
     * @default ''
     */
    controller(controller : string) : RequestBuilder {
        this._controller = controller;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set is systemController of the request.
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
     * Set the data of the request.
     * @param data
     * @default undefined (equals to {} on server param based input).
     */
    data(data : any) : RequestBuilder {
        this._data = data;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Attach http content to http request.
     * The attached http content will only used by post requests.
     * Can be used for attaching files.
     * @param key
     * @param data
     * @default []
     */
    attachHttpContent(key : string,data : string | Blob) : RequestBuilder{
        this._httpAttachedContent.push({key,data});
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
            request = new WsRequest(this._controller,this._data,this._systemController);
        }
        else {
            request = new HttpRequest(this._controller,this._data,this._useAuth,this._systemController);
            request.setHttpAttachedContent(this._httpAttachedContent);
        }
        request.setApiLevel(this._apiLevel);
        request.setTimeout(this._timeout);
        return request;
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
        params += `&${HttpGetReq.VERSION}=${this.zation.getVersion()}`;

        if(this._apiLevel){
            params += `&${HttpGetReq.API_LEVEL}=${this._apiLevel}`;
        }

        if(this._data !== undefined){
            //input
            params += `&${HttpGetReq.INPUT}=${encodeURIComponent(JSON.stringify(this._data))}`;
        }

        //add sign token
        if(this._useAuth && this.zation._getAuthEngine().hasSignToken()) {
            params += `&${HttpGetReq.TOKEN}=${this.zation._getAuthEngine().getSignToken()}`;
        }
        //controller
        if(this._systemController) {
            params += `&${HttpGetReq.SYSTEM_CONTROLLER}=${this._controller}`;
        }
        else {
            params += `&${HttpGetReq.CONTROLLER}=${this._controller}`;
        }
        return this.zation.getServerAddress()+params;
    }

    protected self() : RequestBuilder{
        return this;
    }

}


