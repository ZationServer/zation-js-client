/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {ValidationCheck, ValidationRequest} from "../main/validationRequest";
import {HttpGetReq}                         from "../../helper/constants/internal";
import {AbstractRequestBuilder}              from "./abstractRequestBuilder";
import {Zation}                             from "../../mainApi/zation";
import {ZationRequest}                      from "../main/zationRequest";

export class ValidationRequestBuilder extends AbstractRequestBuilder<ValidationRequestBuilder>
{
    private _controllerId : string = '';
    private _systemController : boolean = false;
    private _checks : ValidationCheck[] = [];

    constructor(zation : Zation) {
        super(zation);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the controller id of the request.
     * @param controllerId
     * @default ''
     */
    controller(controllerId : string) : ValidationRequestBuilder {
        this._controllerId = controllerId;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set is systemController of the request.
     * @default false
     * @param isSystemController
     */
    systemController(isSystemController : boolean) : ValidationRequestBuilder {
        this._systemController = isSystemController;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Add validation checks.
     * @param checks
     */
    checks(...checks : ValidationCheck[]) : ValidationRequestBuilder {
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
    check(inputPath : string | string[],value : any) : ValidationRequestBuilder {
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
        const req = new ValidationRequest(this._controllerId,this._checks,this._systemController,this._protocol);
        req.setApiLevel(this._apiLevel);
        req.setTimeout(this._timeout);
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

        if(this._apiLevel){
            params += `&${HttpGetReq.API_LEVEL}=${this._apiLevel}`;
        }

        //controller
        if(this._systemController) {
            params += `&${HttpGetReq.SYSTEM_CONTROLLER}=${this._controllerId}`;
        }
        else {
            params += `&${HttpGetReq.CONTROLLER}=${this._controllerId}`;
        }
        return this.zation.getServerAddress()+params;
    }

    protected self() : ValidationRequestBuilder {
        return this;
    }

}



