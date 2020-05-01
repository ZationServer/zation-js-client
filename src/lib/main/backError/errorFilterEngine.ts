/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {BackError}        from "./backError";
import {BackErrorFilter}      from "./backErrorFilter";
import {FilterEngine}     from "../filter/filterEngine";
import {FilterHandlerLib} from "../filter/filterHandlerLib";

export class ErrorFilterEngine
{
    static filterErrors(errors: BackError[], filters: BackErrorFilter[]): BackError[] {
        if (filters.length === 0) {
            return errors;
        }
        else {
            let filteredErrors: BackError[] = [];
            for(let i = 0; i < filters.length; i++) {
                filteredErrors = filteredErrors.concat(ErrorFilterEngine._oneFilterErrors(errors,filters[i]));
            }
            return filteredErrors;
        }
    }

    private static _oneFilterErrors(errors: BackError[], filter: BackErrorFilter): BackError[]
    {
        if(filter === {}) {
            return errors;
        }

        let cachedFilterErrors = errors;

        if(Array.isArray(filter['name']) || typeof filter['name'] === 'string')
        {
            cachedFilterErrors =
                FilterEngine.getWhoHasOneOfInputVar<BackError>(cachedFilterErrors,filter['name'],
                    (te) => {return te.getName();});

            if(cachedFilterErrors.length === 0) {
                return [];
            }
        }

        if(Array.isArray(filter['group']) || typeof filter['group'] === 'string')
        {
            cachedFilterErrors =
                FilterEngine.getWhoHasOneOfInputVar<BackError>(cachedFilterErrors,filter['group'],
                    (te) => {return te.getGroup();});

            if(cachedFilterErrors.length === 0) {
                return [];
            }
        }

        if(Array.isArray(filter['type']) || typeof filter['type'] === 'string')
        {
            cachedFilterErrors =
                FilterEngine.getWhoHasOneOfInputVar<BackError>(cachedFilterErrors,filter['type'],
                    (te) => {return te.getType();});

            if(cachedFilterErrors.length === 0) {
                return [];
            }
        }

        if(Array.isArray(filter['info']) || typeof filter['info'] === "object")
        {
            cachedFilterErrors =
                FilterEngine.getWhoHasOneOfInputVar<BackError>
                (
                    cachedFilterErrors,
                    filter['info'],
                    (te) => {return te.getInfo();},
                    FilterHandlerLib.allParamsAreSame
                );

            if(cachedFilterErrors.length === 0) {
                return [];
            }
        }

        if(Array.isArray(filter['infoKey']) || typeof filter['infoKey'] === 'string')
        {
            cachedFilterErrors =
                FilterEngine.getWhoHasOneOfInputVar<BackError>
                (
                    cachedFilterErrors,
                    filter['infoKey'],
                    (te) => {return te.getInfo();},
                    FilterHandlerLib.objKeysAre
                );

            if(cachedFilterErrors.length === 0) {
                return [];
            }
        }

        if(Array.isArray(filter['infoValue']) || typeof filter['infoValue'] !== 'undefined')
        {
            cachedFilterErrors =
                FilterEngine.getWhoHasOneOfInputVar<BackError>
                (
                    cachedFilterErrors,
                    filter['infoValue'],
                    (te) => {return te.getInfo();},
                    FilterHandlerLib.objValuesAre
                );

            if(cachedFilterErrors.length === 0) {
                return [];
            }
        }

        if(typeof filter['fromZationSystem'] === 'boolean')
        {
            let filTemp: BackError[] = [];
            for(let i = 0; i < cachedFilterErrors.length; i++) {
                if (cachedFilterErrors[i].isFromZationSystem() === filter['fromZationSystem']) {
                    filTemp.push(cachedFilterErrors[i]);
                }
            }
            cachedFilterErrors = filTemp;

            if(cachedFilterErrors.length === 0) {
                return [];
            }
        }

        return cachedFilterErrors;
    }

}