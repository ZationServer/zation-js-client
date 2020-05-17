/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {AbstractRequestBuilder}      from "./abstractRequestBuilder";
// noinspection ES6PreferShortImport
import {ZationClient}                from "../../../../core/zationClient";
// noinspection ES6PreferShortImport
import {StandardRequest}             from "../main/standardRequest";
import {SpecialController}           from "../../controllerDefinitions";

export class StandardRequestBuilder extends AbstractRequestBuilder<StandardRequestBuilder>
{
    private readonly _controller: string | SpecialController;
    private _data: any = undefined;

    constructor(client: ZationClient, controller: string | SpecialController, data?: any) {
        super(client);
        this._controller = controller;
        this._data = data;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the data of the request.
     * @param data
     * @default undefined (equals to {} on server param based input).
     */
    data(data: any): StandardRequestBuilder {
        this._data = data;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Builds the BaseRequest and returns it.
     * Notice that the request not contains the reactions.
     */
    buildRequest(): StandardRequest {
        const request = new StandardRequest(this._controller,this._data);
        request.setConnectTimeout(this._connectTimeout);
        request.setApiLevel(this._apiLevel);
        request.setResponseTimeout(this._responseTimeout);
        return request;
    }

    protected self(): StandardRequestBuilder{
        return this;
    }

}