/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */


// noinspection TypeScriptPreferShortImport
import {ProtocolType}       from "../../helper/constants/protocolType";
import {ZationRequest}      from "./zationRequest";
import {Zation}             from "../../mainApi/zation";
import {RequestJsonBuilder} from "../../helper/utils/requestJsonBuilder";

export class WsRequest extends ZationRequest
{
    private readonly controllerId : string;
    private readonly isSystemController : boolean;

    constructor(controllerId : string,data : any = undefined,isSystemController : boolean = false)
    {
        super(data,ProtocolType.WebSocket);
        this.controllerId = controllerId;
        this.isSystemController = isSystemController;
    }

    async getSendData(zation: Zation): Promise<object>
    {
        const compiledData = await this.getCompiledData();

        return RequestJsonBuilder.buildWsRequestData(
            compiledData,
            this.controllerId,
            this.isSystemController,
            this.apiLevel
        );
    }
}