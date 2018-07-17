/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import ZationRequest      = require("../helper/request/zationRequest");
import {ProtocolType}     from "../helper/constants/protocolType";
import Zation             = require("./zation");
import RequestJsonBuilder = require("../helper/tools/requestJsonBuilder");

class AuthRequest extends ZationRequest
{
    constructor(data : object,protocol : ProtocolType)
    {
        super(data,protocol);
    }

    async getSendData(zation: Zation): Promise<object>
    {
        const compiledData = await this.getCompiledData();
        let signToken : undefined | string = undefined;

        if(this.getProtocol() === ProtocolType.Http) {
            signToken = zation.getAuthEngine().getSignToken();
        }

        return RequestJsonBuilder.buildAuthRequestData(
            compiledData,
            zation.getSystem(),
            zation.getVersion(),
            signToken
        )
    }
}

export = AuthRequest;