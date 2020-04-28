/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

export enum BackErrorInfo {
    Main = 'main'
}

export interface ZationRequest {
    s?: string,
    to?: string,
    al?: number
    t?: {
        i: object | any[]
        c?: string,
        sc?: string,
    }
    a?: {
        i: object | any[]
    },
    v?: {
        i: any[] | object,
        c?: string,
        sc?: string
    } | number
}

export interface ResponseBackError {
    n: string,
    g?: string,
    t: string
    d?: string,
    zs: boolean,
    i?: object
}

export class HttpGetReq {
    static readonly VERSION = 'v';
    static readonly SYSTEM = 's';
    static readonly AUTH_REQ = 'a';
    static readonly VALI_REQ = 'vr';
    static readonly CONTROLLER = 'c';
    static readonly SYSTEM_CONTROLLER = 'sc';
    static readonly API_LEVEL = 'al';
    static readonly INPUT = 'i';
    static readonly TOKEN = 't';
}

export enum ZationHttpInfo {
    Deauthenticate = 'deauthenticate'
}

export interface ZationResponse {
    e: ResponseBackError[],
    r: {
        r?: any,
        s?: string | number
    }
    t?: {
        st: string,
        pt: object
    },
    zhi: string[]
}

export interface ZationToken {
    authUserGroup?: string,
    userId?: string | number,
    /**
     * Token id
     */
    tid?: string,
    panelAccess?: boolean,
    exp?: number,
    variables?: object
}

export const ZATION_CUSTOM_EVENT_NAMESPACE = '>CE.';
