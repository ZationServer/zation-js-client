/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

// noinspection ES6PreferShortImport
import {ValidationCheckRequest}              from "../main/validationCheckRequest";
import {AbstractRequestBuilder}              from "./abstractRequestBuilder";
// noinspection ES6PreferShortImport
import {Zation}                                 from "../../../../core/zation";
import {SpecialController, ValidationCheckPair} from "../../controllerDefinitions";

export class ValidationCheckRequestBuilder extends AbstractRequestBuilder<ValidationCheckRequestBuilder>
{
    private readonly _controller: string | SpecialController = '';
    private _checks: ValidationCheckPair[] = [];

    constructor(zation: Zation,controller: string | SpecialController) {
        super(zation);
        this._controller = controller;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Adds validation checks.
     * @param checks
     */
    checks(...checks: ValidationCheckPair[]): ValidationCheckRequestBuilder {
        this._checks.push(...checks);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Adds validation check.
     * @param path
     * @param value
     */
    check(path: string | string[],value: any): ValidationCheckRequestBuilder {
        this._checks.push([path,value]);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Builds the BaseRequest and returns it.
     * Notice that the request not contains the reactions.
     */
    buildRequest(): ValidationCheckRequest {
        const req = new ValidationCheckRequest(this._controller,this._checks);
        req.setApiLevel(this._apiLevel);
        req.setResponseTimeout(this._responseTimeout);
        req.setConnectTimeout(this._connectTimeout);
        return req;
    }

    protected self(): ValidationCheckRequestBuilder {
        return this;
    }

}