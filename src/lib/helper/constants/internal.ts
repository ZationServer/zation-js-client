/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

export enum BackErrorInfo {
    MAIN = 'main'
}

export interface ZationRequest {
    s ?: string,
    to ?: string,
    t ?: {
        i : object | any[]
        c ?: string,
        sc ?: string
    }
    a ?: {
        i : object | any[],
    },
    v ?: {
        i : any[] | object,
        c ?: string,
        sc ?: string
    } | number
}

export interface ResponseBackError {
    n : string,
    g ?: string,
    t : string
    d ?: string,
    zs : boolean,
    i ?: object
}

export enum HttpGetReq {
    VERSION = 'v',
    SYSTEM = 's',
    AUTH_REQ = 'a',
    VALI_REQ = 'vr',
    CONTROLLER = 'c',
    SYSTEM_CONTROLLER = 'sc',
    INPUT = 'i',
    TOKEN = 't'
}

export enum ZationHttpInfo {
    DEAUTHENTICATE = 'deauthenticate'
}

export interface ZationResponse {
    e : ResponseBackError[],
    s : boolean,
    r : {
        r ?: any,
        s ?: string | number
    }
    t ?: {
        st : string,
        pt : object
    },
    zhi : string[]
}

export interface ZationToken {
    zationAuthUserGroup ?: string,
    zationUserId ?: string | number,
    zationTokenId ?: string,
    zationPanelAccess ?: boolean,
    exp ?: number,
    zationCustomVariables ?: object
}

export enum ZationChannel {
    //Zation Main Channels
    USER_CHANNEL_PREFIX = 'Z_U.',
    AUTH_USER_GROUP_PREFIX = 'Z_AUG.',
    DEFAULT_USER_GROUP = 'Z_DUG',
    ALL = 'Z_ALL',
    PANEL_IN = 'Z_PI',
    PANEL_OUT = 'Z_PO',
    //Custom Channels
    CUSTOM_ID_CHANNEL_PREFIX = 'Z_CID_C.',
    CUSTOM_CHANNEL_ID = '.',
    CUSTOM_CHANNEL_PREFIX = 'Z_C_C.',
}



