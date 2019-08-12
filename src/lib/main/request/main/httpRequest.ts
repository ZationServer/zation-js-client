/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {ProtocolType}       from "../../constants/protocolType";
import {Zation}             from "../../../core/zation";
import {RequestJsonBuilder} from "../../utils/requestJsonBuilder";
import {ZationRequest}      from "./zationRequest";

export class HttpRequest extends ZationRequest
{
    private readonly controller : string;
    private readonly useAuth : boolean;
    private readonly isSystemController : boolean;
    private httpAttachedContent : {key : string,data : string | Blob}[] = [];

    constructor(controller : string,data : any = undefined,useAuth : boolean = true,isSystemController : boolean = false)
    {
        super(data,ProtocolType.Http);
        this.controller = controller;
        this.useAuth = useAuth;
        this.isSystemController = isSystemController;
    }

    async getSendData(zation: Zation): Promise<object>
    {
        const compiledData = await this.getCompiledData();
        let signToken : null | string = null;

        if(this.useAuth && zation._getAuthEngine().hasSignToken()) {
            signToken = zation._getAuthEngine().getSignToken();
        }

        return RequestJsonBuilder.buildHttpRequestData(
            compiledData,
            this.controller,
            this.isSystemController,
            zation.getSystem(),
            zation.getVersion(),
            this.apiLevel,
            signToken
        )
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Attach http content to request.
     * Can be used for attaching files.
     */
    attachHttpContent(key : string,data : string | Blob) {
        this.httpAttachedContent.push({key,data});
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set http attached content from request.
     * Can be used for attaching files.
     */
    setHttpAttachedContent(content : {key : string,data : string | Blob}[]) {
        this.httpAttachedContent = content;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns http atteched content as an array.
     */
    getAttachedHttpContent() : {key : string,data : string | Blob}[] {
        return this.httpAttachedContent;
    }

}

