/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */


// noinspection TypeScriptPreferShortImport
import {ProtocolType}       from "../helper/constants/protocolType";
import {ZationRequest}      from "../helper/request/zationRequest";
import {Zation}             from "./zation";
import {RequestJsonBuilder} from "../helper/tools/requestJsonBuilder";

export class WsRequest extends ZationRequest
{
    private readonly controllerName : string;
    private readonly isSystemController : boolean;

    constructor(controllerName : string,data : any = undefined,isSystemController : boolean = false)
    {
        super(data,ProtocolType.WebSocket);
        this.controllerName = controllerName;
        this.isSystemController = isSystemController;
    }

    async getSendData(zation: Zation): Promise<object>
    {
        const compiledData = await this.getCompiledData();

        return RequestJsonBuilder.buildWsRequestData(
            compiledData,
            this.controllerName,
            this.isSystemController,
        )
    }
}

