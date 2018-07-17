/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import ZationRequest      = require("../helper/request/zationRequest");
import {ProtocolType}     from "../helper/constants/protocolType";
import Zation             = require("./zation");
import RequestJsonBuilder = require("../helper/tools/requestJsonBuilder");

interface ValidationCheck
{
    kv : string,
    v : any
}

class ValidationRequest extends ZationRequest
{
    private readonly controllerName : string;

    constructor(controllerName : string,input : ValidationCheck[])
    {
        super(input,ProtocolType.Http);
        this.controllerName = controllerName;
    }

    async getSendData(zation: Zation): Promise<object>
    {
        const compiledData = await this.getCompiledData();

        return RequestJsonBuilder.buildValidationRequestData(
            compiledData,
            this.controllerName
        )
    }
}

export = ValidationRequest;