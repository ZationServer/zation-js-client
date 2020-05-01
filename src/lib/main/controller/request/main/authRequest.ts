/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {BaseRequest}            from "./baseRequest";
import {buildAuthControllerReq} from "./rawReqBuilderUtils";

export class AuthRequest extends BaseRequest
{
    constructor(data: any = undefined) {
        super(data);
    }

    build(): any {
        return buildAuthControllerReq(this.data,this.apiLevel);
    }
}