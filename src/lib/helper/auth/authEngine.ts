/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import Zation         = require("../../api/zation");
import Response       = require("../../api/response");
import AuthRequest    = require("../../api/authRequest");
import {ProtocolType} from "../constants/protocolType";

class AuthEngine
{
    private currentUserId : number | string | undefined = undefined;
    private currentUserAuthGroup : string | undefined = undefined;

    private readonly zation : Zation;

    private authData : object;

    constructor(zation : Zation)
    {
        this.zation = zation;

        this.currentUserId = undefined;
        this.currentUserAuthGroup = undefined;
    }

    authIn(authData : object,protocolType : ProtocolType = ProtocolType.WebSocket) : Promise<Response>
    {
        this.authData = authData;
        const authReq = new AuthRequest(authData,protocolType);
        await this.zation.send()
    }


    isAuthIn() : boolean
    {
        return this.currentUserAuthGroup !== undefined;
    }

    getSignToken() : string
    {
        return '';
    }

}

export = AuthEngine;

