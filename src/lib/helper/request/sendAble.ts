/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import Zation         = require("../../api/zation");
import {ProtocolType} from "../constants/protocolType";

export abstract class SendAble
{
    abstract async getSendData(zation : Zation) : Promise<object>;
    // noinspection JSMethodCanBeStatic
    abstract getProtocol() : ProtocolType;

    abstract getOnProgressHandler() 
}
