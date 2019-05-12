/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {ZationRequest} from "../constants/internal";

export class RequestJsonBuilder
{
    static buildHttpRequestData
    (
        data : any,
        controllerName : string,
        isSystemController : boolean,
        system : string,
        version : number,
        apiLevel : number | undefined,
        signToken ?: string | null
    ) : ZationRequest
    {
        const request : ZationRequest = {
            v : version,
            s : system,
            t : {
                i : data,
                [!isSystemController ? 'c' : 'sc'] : controllerName,
                ...(apiLevel ? {al : apiLevel} : {})
            }
        };

        if(!!signToken) {
            request.to = signToken;
        }
        return request;
    }

    static buildWsRequestData
    (
        data : any,
        controllerName : string,
        isSystemController : boolean,
        apiLevel : number | undefined
    ) : ZationRequest
    {
        return  {
            t : {
                [!isSystemController ? 'c' : 'sc'] : controllerName,
                i : data,
                ...(apiLevel ? {al : apiLevel} : {})
            }
        };
    }

    static buildHttpAuthRequestData(data : any,system : string, version : number,apiLevel : number | undefined,signToken ?: string | null) : ZationRequest
    {
        const res : ZationRequest = {
            v : version,
            s : system,
            a : {
                i : data,
                ...(apiLevel ? {al : apiLevel} : {})
            }
        };
        if(!!signToken) {
            res.to = signToken;
        }
        return res;
    }

    static buildWsAuthRequestData(data : any,apiLevel : number | undefined) : ZationRequest
    {
        return {
           a : {
               i : data,
               ...(apiLevel ? {al : apiLevel} : {})
           }
        };
    }

    static buildValidationRequestData(input : object | any[],controllerName : string,isSystemController : boolean,apiLevel : number | undefined) : ZationRequest
    {
        return {
            v : {
                [!isSystemController ? 'c' : 'sc'] : controllerName,
                i : input,
                ...(apiLevel ? {al : apiLevel} : {})
            }
        };
    }
}


