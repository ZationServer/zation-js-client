/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

// noinspection TypeScriptPreferShortImport
import {BaseRequest}              from "./baseRequest";
import {buildNormalControllerReq} from "./rawReqBuilderUtils";
// noinspection ES6PreferShortImport

export class StandardRequest extends BaseRequest
{
    private readonly controller: string;
    private readonly isSystemController: boolean;

    constructor(controller: string,data: any = undefined,isSystemController: boolean = false) {
        super(data);
        this.controller = controller;
        this.isSystemController = isSystemController;
    }

    build(): any {
        return buildNormalControllerReq(
            this.data,
            this.controller,
            this.isSystemController,
            this.apiLevel
        );
    }
}