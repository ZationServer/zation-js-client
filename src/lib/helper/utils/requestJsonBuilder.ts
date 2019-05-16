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
        controllerId : string,
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
            ...(apiLevel ? {al : apiLevel} : {}),
            t : {
                i : data,
                [!isSystemController ? 'c' : 'sc'] : controllerId
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
        controllerId : string,
        isSystemController : boolean,
        apiLevel : number | undefined
    ) : ZationRequest
    {
        return  {
            ...(apiLevel ? {al : apiLevel} : {}),
            t : {
                [!isSystemController ? 'c' : 'sc'] : controllerId,
                i : data
            }
        };
    }

    static buildHttpAuthRequestData(data : any,system : string, version : number,apiLevel : number | undefined,signToken ?: string | null) : ZationRequest
    {
        const res : ZationRequest = {
            v : version,
            s : system,
            ...(apiLevel ? {al : apiLevel} : {}),
            a : {
                i : data,
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
            ...(apiLevel ? {al : apiLevel} : {}),
            a : {
                i : data
            }
        };
    }

    static buildValidationRequestData(input : object | any[],controllerId : string,isSystemController : boolean,apiLevel : number | undefined) : ZationRequest
    {
        return {
            ...(apiLevel ? {al : apiLevel} : {}),
            v : {
                [!isSystemController ? 'c' : 'sc'] : controllerId,
                i : input
            }
        };
    }
}


