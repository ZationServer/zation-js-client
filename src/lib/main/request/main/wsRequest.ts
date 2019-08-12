/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */


// noinspection TypeScriptPreferShortImport
import {ProtocolType}       from "../../constants/protocolType";
import {ZationRequest}      from "./zationRequest";
import {Zation}             from "../../../core/zation";
import {RequestJsonBuilder} from "../../utils/requestJsonBuilder";

export class WsRequest extends ZationRequest
{
    private readonly controller : string;
    private readonly isSystemController : boolean;

    constructor(controller : string,data : any = undefined,isSystemController : boolean = false)
    {
        super(data,ProtocolType.WebSocket);
        this.controller = controller;
        this.isSystemController = isSystemController;
    }

    async getSendData(zation: Zation): Promise<object>
    {
        const compiledData = await this.getCompiledData();

        return RequestJsonBuilder.buildWsRequestData(
            compiledData,
            this.controller,
            this.isSystemController,
            this.apiLevel
        );
    }
}