/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import ZationRequest = require("../helper/request/zationRequest");
import {ProtocolType}   from "../helper/constants/protocolType";
import Zation = require("./zation");
import RequestJsonBuilder = require("../helper/tools/requestJsonBuilder");

class WsRequest extends ZationRequest
{
    private readonly controllerName : string;
    private readonly isSystemController : boolean;

    constructor(controllerName : string,data : object = {},isSystemController : boolean = false)
    {
        super(data,ProtocolType.WebSocket);
        this.controllerName = controllerName;
        this.isSystemController = isSystemController;
    }

    async getSendData(zation: Zation): Promise<object>
    {
        const compiledData = await this.getCompiledData();

        return RequestJsonBuilder.buildRequestData(
            compiledData,
            this.controllerName,
            this.isSystemController,
            zation.getSystem(),
            zation.getVersion()
        )
    }
}

export = WsRequest;