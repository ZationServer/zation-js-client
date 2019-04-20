/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {ProtocolType} from "../constants/protocolType";
import {Zation}       from "../../api/zation";

export abstract class SendAble
{
    abstract async getSendData(zation : Zation) : Promise<object>;
    // noinspection JSMethodCanBeStatic
    abstract getProtocol() : ProtocolType;
    abstract getAckTimeout() : null | number | undefined;
}
