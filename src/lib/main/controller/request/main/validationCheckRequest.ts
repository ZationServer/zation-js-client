/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

// noinspection TypeScriptPreferShortImport
import {BaseRequest}                       from "./baseRequest";
// noinspection ES6PreferShortImport
import {ValidationCheckPair}               from "../../controllerDefinitions";
import {buildValidationCheckControllerReq} from "./rawReqBuilderUtils";

export class ValidationCheckRequest extends BaseRequest
{
    private readonly controller: string;
    private readonly isSystemController: boolean;

    constructor(controller: string,checks: ValidationCheckPair[],isSystemController: boolean = false)
    {
        super(checks);
        this.controller = controller;
        this.isSystemController = isSystemController;
    }

    build(): any {
        return buildValidationCheckControllerReq(
            this.data,
            this.controller,
            this.isSystemController,
            this.apiLevel
        );
    }
}

