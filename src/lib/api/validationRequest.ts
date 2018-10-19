/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import ZationRequest = require("../helper/request/zationRequest");
import Zation = require("./zation");
import RequestJsonBuilder = require("../helper/tools/requestJsonBuilder");
// noinspection TypeScriptPreferShortImport
import {ProtocolType} from "../helper/constants/protocolType";

export class ValidationRequest extends ZationRequest
{
    private readonly controllerName : string;
    private readonly isSystemController : boolean;

    constructor(controllerName : string,checks : ValidationCheck[],isSystemController : boolean = false,protocol : ProtocolType = ProtocolType.Http)
    {
        super(checks,protocol);
        this.controllerName = controllerName;
        this.isSystemController = isSystemController;
    }

    async getSendData(zation: Zation): Promise<object>
    {
        const compiledData = await this.getCompiledData();

        return RequestJsonBuilder.buildValidationRequestData(
            compiledData,
            this.controllerName,
            this.isSystemController
        )
    }
}

export interface ValidationCheck {
    ip : string | string[]
    v : any
}

