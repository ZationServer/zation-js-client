/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {TaskError} from "../react/taskError/taskError";

export enum ErrorInfo {
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

export interface ResponseTaskError {
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
    e : TaskError[],
    s : boolean,
    r : {
        r : any,
        s : string | number
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
    USER_CHANNEL_PREFIX = 'ZATION.USER.',
    AUTH_USER_GROUP_PREFIX = 'ZATION.AUTH_USER_GROUP.',
    DEFAULT_USER_GROUP = 'ZATION.DEFAULT_USER_GROUP',
    ALL = 'ZATION.ALL',
    PANEL_IN = 'ZATION.PANEL_IN',
    PANEL_OUT = 'ZATION.PANEL_OUT',

    //Custom Channels
    CUSTOM_ID_CHANNEL_PREFIX = 'ZATION.CUSTOM_ID_CHANNEL.',
    CUSTOM_CHANNEL_ID = '.CH_ID.',

    CUSTOM_CHANNEL_PREFIX = 'ZATION.CUSTOM_CHANNEL.'
}



