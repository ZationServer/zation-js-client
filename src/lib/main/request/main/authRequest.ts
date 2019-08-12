/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {ProtocolType}       from "../../constants/protocolType";
import {ZationRequest}      from "./zationRequest";
import {Zation}             from "../../../core/zation";
import {RequestJsonBuilder} from "../../utils/requestJsonBuilder";

export class AuthRequest extends ZationRequest
{
    private httpAttachedContent : {key : string,data : string | Blob}[] = [];

    constructor(data : any = undefined,protocol : ProtocolType)
    {
        super(data,protocol);
    }

    async getSendData(zation: Zation): Promise<object>
    {
        const compiledData = await this.getCompiledData();

        if(this.getProtocol() === ProtocolType.WebSocket) {
            return RequestJsonBuilder.buildWsAuthRequestData(compiledData,this.apiLevel);
        }
        else {
            let signToken : null | string = null;
            if(zation._getAuthEngine().hasSignToken()){
                signToken = zation._getAuthEngine().getSignToken();
            }
            return RequestJsonBuilder.buildHttpAuthRequestData(
                compiledData,
                zation.getSystem(),
                zation.getVersion(),
                this.apiLevel,
                signToken
            )
        }
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

