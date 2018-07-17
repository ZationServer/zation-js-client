/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {ProtocolType}     from "../helper/constants/protocolType";
import MainRequest        = require("../helper/request/zationRequest");
import Zation             = require("./zation");
import RequestJsonBuilder = require("../helper/tools/requestJsonBuilder");

class HttpRequest extends MainRequest
{
    private readonly controllerName : string;
    private readonly useAuth : boolean;

    constructor(controllerName : string,data : object = {},useAuth : boolean = true)
    {
        super(data,ProtocolType.Http);
        this.controllerName = controllerName;
        this.useAuth = useAuth;
    }

    async getSendData(zation: Zation): Promise<object>
    {
        const compiledData = await this.getCompiledData();
        let signToken : undefined | string = undefined;

        if(this.useAuth) {
            signToken = zation.getAuthEngine().getSignToken();
        }

        return RequestJsonBuilder.buildRequestData(
            compiledData,
            this.controllerName,
            zation.getSystem(),
            zation.getVersion(),
            signToken
        )
    }
}

export = HttpRequest;