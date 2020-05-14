/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

// noinspection TypeScriptPreferShortImport
import {BaseRequest}                            from "./baseRequest";
// noinspection ES6PreferShortImport
import {SpecialController, ValidationCheckPair} from "../../controllerDefinitions";
import {buildValidationCheckControllerReq}      from "./rawReqBuilderUtils";

export class ValidationCheckRequest extends BaseRequest
{
    private controller: string | SpecialController;

    constructor(controller: string | SpecialController,checks: ValidationCheckPair[]) {
        super(checks);
        this.controller = controller;
    }

    build(): any {
        return buildValidationCheckControllerReq(
            this.controller,
            this.data,
            this.apiLevel
        );
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Sets the controller identifier.
     */
    setController(controller: string | SpecialController): void {
        this.controller = controller;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the controller identifier.
     */
    getController(): string | SpecialController {
        return this.controller;
    }
}

