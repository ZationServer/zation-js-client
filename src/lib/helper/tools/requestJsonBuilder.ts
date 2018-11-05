/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {ReqInC, RequestInput, ValidationRequestInput} from "../constants/settings";

class RequestJsonBuilder
{
    static buildHttpRequestData
    (
        data : object,
        controllerName : string,
        isSystemController : boolean,
        system : string,
        version : number,
        signToken ?: string | null
    )
    {

        const controllerKey = !isSystemController ?
            ReqInC.CONTROLLER :
            ReqInC.SYSTEM_CONTROLLER;

        let res = {
            [RequestInput.VERSION] : version,
            [RequestInput.SYSTEM] : system,
            [RequestInput.TASK] :
                {
                    [controllerKey] : controllerName,
                    [RequestInput.INPUT] : data,
                }
        };

        if(!!signToken) {
            res[RequestInput.TOKEN] = signToken;
        }

        return res;
    }

    static buildWsRequestData
    (
        data : object,
        controllerName : string,
        isSystemController : boolean
    )
    {
        const controllerKey = !isSystemController ?
            ReqInC.CONTROLLER :
            ReqInC.SYSTEM_CONTROLLER;

        return {
            [RequestInput.TASK] :
                {
                    [controllerKey] : controllerName,
                    [RequestInput.INPUT] : data,
                }
        };
    }

    static buildHttpAuthRequestData(data : object,system : string, version : number,signToken ?: string | null)
    {
        let res = {
            [RequestInput.VERSION] : version,
            [RequestInput.SYSTEM] : system,
            [RequestInput.AUTH] :
                {
                    [RequestInput.INPUT] : data,
                }
        };

        if(!!signToken) {
            res[RequestInput.TOKEN] = signToken;
        }

        return res;
    }

    static buildWsAuthRequestData(data : object)
    {
        return {
            [RequestInput.AUTH] :
                {
                    [RequestInput.INPUT] : data,
                }
        };
    }

    static buildValidationRequestData(input : object,constrollerName : string,isSystemController : boolean)
    {
        const controllerKey = !isSystemController ?
            ReqInC.CONTROLLER :
            ReqInC.SYSTEM_CONTROLLER;

        return {
            [ValidationRequestInput.MAIN] :
                {
                    [ValidationRequestInput.INPUT] : input,
                    [controllerKey] : constrollerName,
                }
        };
    }
}

export = RequestJsonBuilder;

