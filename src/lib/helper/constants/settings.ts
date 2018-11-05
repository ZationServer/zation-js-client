/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

export enum ErrorInfo {
    MAIN = 'main'
}

export enum RequestInput {
    INPUT = 'i',
    TASK = 't',
    VERSION = 'v',
    SYSTEM = 's',
    AUTH = 'a',
    TOKEN = 'to'
}

export enum ResponseTaskError {
    NAME = 'n',
    GROUP = 'g',
    TYPE = 't',
    FROM_ZATION_SYSTEM = 'zs',
    DESCRIPTION = 'd',
    INFO = 'i'
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


export enum ZationResponse {
    ERRORS = 'e',
    SUCCESSFUL = 's',
    RESULT = 'r',
    TOKEN = 't',
    ZATION_HTTP_INFO = 'zhi',

    TOKEN_SIGNED = 'st',
    TOKEN_PLAIN = 'pt',

    RESULT_MAIN = 'r',
    RESULT_STATUS = 's'
}

export enum ReqInC {
    CONTROLLER = 'c',
    SYSTEM_CONTROLLER = 'sc'
}

export enum ValidationRequestInput {
    MAIN = 'v',
    INPUT = 'i',
    KEY_PATH = 'kp',
    VALUE = 'v'
}

export enum Token {
    AUTH_USER_GROUP = 'zationAuthUserGroup',
    USER_ID = 'zationUserId',
    TOKEN_ID = 'zationTokenId',
    PANEL_ACCESS = 'zationPanelAccess',
    EXPIRE = 'exp',
    CUSTOM_VARIABLES = 'zationCustomVariables'
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



