/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {ValidationCheck, ValidationRequest} from "../../api/validationRequest";
import {HttpGetReq}                         from "../constants/internal";
import {AbstractRequestHelper}              from "./abstractRequestHelper";
import {Zation}                             from "../../api/zation";
import {ZationRequest}                      from "./zationRequest";

export class ValidationRequestHelper extends AbstractRequestHelper<ValidationRequestHelper>
{
    private _controllerName : string = '';
    private _systemController : boolean = false;
    private _checks : ValidationCheck[] = [];

    constructor(zation : Zation) {
        super(zation);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the controller name of the request.
     * @param controllerName
     * @default ''
     */
    controller(controllerName : string) : ValidationRequestHelper {
        this._controllerName = controllerName;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set is systemController of the request.
     * @default false
     * @param isSystemController
     */
    systemController(isSystemController : boolean) : ValidationRequestHelper {
        this._systemController = isSystemController;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Add validation checks.
     * @param checks
     */
    checks(...checks : ValidationCheck[]) : ValidationRequestHelper {
        this._checks.push(...checks);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Add validation check.
     * @param inputPath
     * @param value
     */
    check(inputPath : string | string[],value : any) : ValidationRequestHelper {
        this._checks.push({ip : inputPath, v : value});
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Builds the request and return it.
     * Notice that the request not contains the reactions!
     */
    buildRequest() : ZationRequest
    {
        const req = new ValidationRequest(this._controllerName,this._checks,this._systemController,this._protocol)
        req.setAckTimeout(this._ackTimeout);
        return req;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Builds an get request.
     * @return
     * Returns the full get reuqest as an string.
     */
    buildGetRequest() : string
    {
        //checks
        let params = `?${HttpGetReq.INPUT}=${JSON.stringify(this._checks)}`;
        //vali req
        params += `&${HttpGetReq.VALI_REQ}=true`;
        //controller
        if(this._systemController) {
            params += `&${HttpGetReq.SYSTEM_CONTROLLER}=${this._controllerName}`;
        }
        else {
            params += `&${HttpGetReq.CONTROLLER}=${this._controllerName}`;
        }
        return this.zation.getServerAddress()+params;
    }

    protected self() : ValidationRequestHelper {
        return this;
    }

}



