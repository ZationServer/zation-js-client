/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */
import Const = require("../constants/constWrapper");

class RequestJsonBuilder
{
    static buildRequestData(data : object,controllerName : string,system : string, version : number,signToken ?: string)
    {
        let res = {
            [Const.Settings.REQUEST_INPUT.VERSION] : version,
            [Const.Settings.REQUEST_INPUT.SYSTEM] : system,
            [Const.Settings.REQUEST_INPUT.TASK] :
                {
                    [Const.Settings.REQUEST_INPUT.CONTROLLER] : controllerName,
                    [Const.Settings.REQUEST_INPUT.INPUT] : data,
                }
        };

        if(!!signToken) {
            res[Const.Settings.REQUEST_INPUT.TOKEN] = signToken;
        }

        return res;
    }

    static buildAuthRequestData(data : object,system : string, version : number,signToken ?: string)
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

    static buildValidationRequestData(input : object,constrollerName : string)
    {
        return {
            [Const.Settings.VALIDATION_REQUEST_INPUT.MAIN] :
                {
                    [Const.Settings.VALIDATION_REQUEST_INPUT.INPUT] : input,
                    [Const.Settings.VALIDATION_REQUEST_INPUT.CONTROLLER] : constrollerName,
                }
        };
    }


}

export = RequestJsonBuilder;

