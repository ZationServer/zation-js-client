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

export class StandardRequestBuilder<ID = any,OD = any>
    extends AbstractRequestBuilder<StandardRequestBuilder<ID,OD>,OD>
{
    private readonly _controller: string | SpecialController;
    private _data: ID | undefined = undefined;

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
     * @default undefined
     */
    data(data: ID): StandardRequestBuilder<ID,OD> {
        this._data = data;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Builds the BaseRequest and returns it.
     * Notice that the request not contains the reactions.
     */
    buildRequest(): StandardRequest<ID> {
        const request = new StandardRequest<ID>(this._controller,this._data);
        request.setConnectTimeout(this._connectTimeout);
        request.setApiLevel(this._apiLevel);
        request.setResponseTimeout(this._responseTimeout);
        return request;
    }

    protected self(): StandardRequestBuilder<ID,OD> {
        return this;
    }

}