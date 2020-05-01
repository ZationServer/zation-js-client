/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

// noinspection ES6PreferShortImport
import {ValidationCheckRequest}              from "../main/validationCheckRequest";
import {AbstractRequestBuilder}              from "./abstractRequestBuilder";
// noinspection ES6PreferShortImport
import {Zation}                              from "../../../../core/zation";
import {ValidationCheckPair}                 from "../../controllerDefinitions";
import {BaseRequest}                         from "../main/baseRequest";

export class ValidationRequestBuilder extends AbstractRequestBuilder<ValidationRequestBuilder>
{
    private _controller: string = '';
    private _systemController: boolean = false;
    private _checks: ValidationCheckPair[] = [];

    constructor(zation: Zation) {
        super(zation);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the controller identifier of the request.
     * @param controller
     * @default ''
     */
    controller(controller: string): ValidationRequestBuilder {
        this._controller = controller;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set is systemController of the request.
     * @default false
     * @param isSystemController
     */
    systemController(isSystemController: boolean): ValidationRequestBuilder {
        this._systemController = isSystemController;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Adds validation checks.
     * @param checks
     */
    checks(...checks: ValidationCheckPair[]): ValidationRequestBuilder {
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
    check(path: string | string[],value: any): ValidationRequestBuilder {
        this._checks.push({p: path, v: value});
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Builds the BaseRequest and returns it.
     * Notice that the request not contains the reactions.
     */
    buildRequest(): BaseRequest {
        const req = new ValidationCheckRequest(this._controller,this._checks,this._systemController);
        req.setApiLevel(this._apiLevel);
        req.setTimeout(this._timeout);
        req.setWaitForConnection(this._waitForConnection);
        return req;
    }

    protected self(): ValidationRequestBuilder {
        return this;
    }

}