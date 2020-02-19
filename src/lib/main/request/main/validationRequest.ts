/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

// noinspection TypeScriptPreferShortImport
import {ProtocolType}       from "../../constants/protocolType";
import {ZationRequest}      from "./zationRequest";
import {Zation}             from "../../../core/zation";
import {RequestJsonBuilder} from "../../utils/requestJsonBuilder";

export class ValidationRequest extends ZationRequest
{
    private readonly controller: string;
    private readonly isSystemController: boolean;

    constructor(controller: string,checks: ValidationCheck[],isSystemController: boolean = false,protocol: ProtocolType = ProtocolType.Http)
    {
        super(checks,protocol);
        this.controller = controller;
        this.isSystemController = isSystemController;
    }

    async getSendData(zation: Zation): Promise<object>
    {
        const compiledData = await this.getCompiledData();

        return RequestJsonBuilder.buildValidationRequestData(
            compiledData,
            this.controller,
            this.isSystemController,
            this.apiLevel
        )
    }
}

export interface ValidationCheck {
    ip: string | string[]
    v: any
}

