/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {ProtocolType}       from "../helper/constants/protocolType";
import {ZationRequest}      from "../helper/request/zationRequest";
import {Zation}             from "./zation";
import {RequestJsonBuilder} from "../helper/tools/requestJsonBuilder";

export class AuthRequest extends ZationRequest
{
    constructor(data : object,protocol : ProtocolType)
    {
        super(data,protocol);
    }

    async getSendData(zation: Zation): Promise<object>
    {
        const compiledData = await this.getCompiledData();

        if(this.getProtocol() === ProtocolType.WebSocket) {
            return RequestJsonBuilder.buildWsAuthRequestData(compiledData);
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
                signToken
            )
        }
    }
}

