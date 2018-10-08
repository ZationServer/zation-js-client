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
    private readonly isSystemController : boolean;

    constructor(controllerName : string,data : object = {},useAuth : boolean = true,isSystemController : boolean = false)
    {
        super(data,ProtocolType.Http);
        this.controllerName = controllerName;
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

        return RequestJsonBuilder.buildRequestData(
            compiledData,
            this.controllerName,
            this.isSystemController,
            zation.getSystem(),
            zation.getVersion(),
            signToken
        )
    }
}

export = HttpRequest;