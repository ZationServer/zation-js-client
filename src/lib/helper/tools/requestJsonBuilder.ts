/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */
import Const = require("../constants/constWrapper");

class RequestJsonBuilder
{
    static buildRequestData
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
            Const.Settings.REQ_IN_C.CONTROLLER :
            Const.Settings.REQ_IN_C.SYSTEM_CONTROLLER;

        let res = {
            [Const.Settings.REQUEST_INPUT.VERSION] : version,
            [Const.Settings.REQUEST_INPUT.SYSTEM] : system,
            [Const.Settings.REQUEST_INPUT.TASK] :
                {
                    [controllerKey] : controllerName,
                    [Const.Settings.REQUEST_INPUT.INPUT] : data,
                }
        };

        if(!!signToken) {
            res[Const.Settings.REQUEST_INPUT.TOKEN] = signToken;
        }

        return res;
    }

    static buildAuthRequestData(data : object,system : string, version : number,signToken ?: string | null)
    {
        let res = {
            [Const.Settings.REQUEST_INPUT.VERSION] : version,
            [Const.Settings.REQUEST_INPUT.SYSTEM] : system,
            [Const.Settings.REQUEST_INPUT.AUTH] :
                {
                    [Const.Settings.REQUEST_INPUT.INPUT] : data,
                }
        };

        if(!!signToken) {
            res[Const.Settings.REQUEST_INPUT.TOKEN] = signToken;
        }

        return res;
    }

    static buildValidationRequestData(input : object,constrollerName : string,isSystemController : boolean)
    {
        const controllerKey = !isSystemController ?
            Const.Settings.REQ_IN_C.CONTROLLER :
            Const.Settings.REQ_IN_C.SYSTEM_CONTROLLER;

        return {
            [Const.Settings.VALIDATION_REQUEST_INPUT.MAIN] :
                {
                    [Const.Settings.VALIDATION_REQUEST_INPUT.INPUT] : input,
                    [controllerKey] : constrollerName,
                }
        };
    }
}

export = RequestJsonBuilder;

