/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

// noinspection TypeScriptPreferShortImport
import {BaseRequest}              from "./baseRequest";
import {buildNormalControllerReq} from "./rawReqBuilderUtils";
import {SpecialController}        from "../../controllerDefinitions";
// noinspection ES6PreferShortImport

export class StandardRequest extends BaseRequest
{
    private controller: string | SpecialController;

    constructor(controller: string | SpecialController,data: any = undefined) {
        super(data);
        this.controller = controller;
    }

    build(): any {
        return buildNormalControllerReq(
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