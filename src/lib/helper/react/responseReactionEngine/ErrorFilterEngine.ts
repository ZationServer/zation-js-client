/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import Const = require("../../constants/constWrapper");

export class ErrorFilterEngine
{

    static filterErrors(errors : object[],filter : object) : object[]
    {
        if(filter === {}) {
            return errors;
        }

        let cachedFilterErrors = errors;

        if(Array.isArray(filter['name']) || typeof filter['name'] === 'string')
        {
            cachedFilterErrors =
                FilterEngine.getWhoHasOneOfInputVar(cachedFilterErrors,filter['name'],Const.Settings.RESPONSE.ERROR.Name);

            if(cachedFilterErrors.length === 0) {
                return [];
            }
        }

        if(Array.isArray(filter['type']) || typeof filter['name'] === 'string')
        {
            cachedFilterErrors =
                FilterEngine.getWhoHasOneOfInputVar(cachedFilterErrors,filter['type'],Const.Settings.RESPONSE.ERROR.TYPE);

            if(cachedFilterErrors.length === 0) {
                return [];
            }
        }

        if(Array.isArray(filter['info']) || typeof filter['info'] === "object")
        {
            cachedFilterErrors =
                FilterEngine.getWhoHasOneOfInputVar
                (
                    cachedFilterErrors,
                    filter['info'],
                    Const.Settings.RESPONSE.ERROR.INFO,
                    FilterHandlerLib.allParamsAreSame
                );

            if(cachedFilterErrors.length === 0) {
                return [];
            }
        }

        if(Array.isArray(filter['infoKey']))
        {
            cachedFilterErrors =
                FilterEngine.getWhoHasOneOfInputVar
                (
                    cachedFilterErrors,
                    filter['infoKey'],
                    Const.Settings.RESPONSE.ERROR.INFO,
                    FilterHandlerLib.objValuesAre
                );

            if(cachedFilterErrors.length === 0) {
                return [];
            }
        }

        if(Array.isArray(filter['infoValue']))
        {
            cachedFilterErrors =
                FilterEngine.getWhoHasOneOfInputVar
                (
                    cachedFilterErrors,
                    filter['infoValue'],
                    Const.Settings.RESPONSE.ERROR.INFO,
                    FilterHandlerLib.objKeysAre
                );

            if(cachedFilterErrors.length === 0) {
                return [];
            }
        }

        return cachedFilterErrors;
    }

}