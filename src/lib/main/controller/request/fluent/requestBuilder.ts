/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {AbstractRequestBuilder}      from "./abstractRequestBuilder";
// noinspection ES6PreferShortImport
import {Zation}                      from "../../../../core/zation";
// noinspection ES6PreferShortImport
import {StandardRequest}             from "../main/standardRequest";
import {BaseRequest}                 from "../main/baseRequest";

export class RequestBuilder extends AbstractRequestBuilder<RequestBuilder>
{
    private _controller: string = '';
    private _systemController: boolean = false;
    private _data: any = undefined;

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
    controller(controller: string): RequestBuilder {
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
    systemController(isSystemController: boolean): RequestBuilder {
        this._systemController = isSystemController;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set the data of the request.
     * @param data
     * @default undefined (equals to {} on server param based input).
     */
    data(data: any): RequestBuilder {
        this._data = data;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Builds the BaseRequest and returns it.
     * Notice that the request not contains the reactions.
     */
    buildRequest(): BaseRequest {
        const request = new StandardRequest(this._controller,this._data,this._systemController);
        request.setWaitForConnection(this._waitForConnection);
        request.setApiLevel(this._apiLevel);
        request.setTimeout(this._timeout);
        return request;
    }

    protected self(): RequestBuilder{
        return this;
    }

}