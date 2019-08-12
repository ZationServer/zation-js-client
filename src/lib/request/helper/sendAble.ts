/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {ProtocolType} from "../../helper/constants/protocolType";
import {Zation}       from "../../mainApi/zation";
import {WaitForConnectionOption} from "../../helper/utils/connectionUtils";

export abstract class SendAble
{
    abstract async getSendData(zation : Zation) : Promise<object>;
    // noinspection JSMethodCanBeStatic
    abstract getProtocol() : ProtocolType;
    abstract getTimeout() : null | number | undefined;

    abstract getWaitForConnection() : WaitForConnectionOption
}