/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {BaseRequest}              from "./baseRequest";
import {buildNormalControllerReq} from "./rawReqBuilderUtils";
import {SpecialController}        from "../../controllerDefinitions";

export class AuthRequest extends BaseRequest
{
    constructor(data: any = undefined) {
        super(data);
    }

    build(): any {
        return buildNormalControllerReq(SpecialController.AuthController,this.data,this.apiLevel);
    }
}