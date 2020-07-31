/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

export enum ErrorName {
    MemberMissing                = 'MemberMissing',
    UnnecessaryMember            = 'UnnecessaryMember',
    IdentifierMissing            = 'IdentifierMissing',
    UnknownChannel               = 'UnknownChannel',
    NoAccessWithVersion          = 'NoAccessWithVersion',
    NoAccessWithSystem           = 'NoAccessWithSystem',
    AccessDenied                 = 'AccessDenied',
    InvalidMember                = 'InvalidMember',

    InvalidToken                 = 'InvalidToken',
    InvalidPackage               = 'InvalidPackage',
    InvalidRequest               = 'InvalidRequest',
    ApiLevelIncompatible         = 'ApiLevelIncompatible',
    UnknownDatabox               = 'UnknownDatabox',
    DataboxLimitReached          = 'DataboxLimitReached',
    UnknownSessionTarget         = 'UnknownSessionTarget',
    UnknownAction                = 'UnknownAction',
    NoMoreDataAvailable          = 'NoMoreDataAvailable',
    NoDataAvailable              = 'NoDataAvailable',
    MaxBackpressureReached       = 'MaxBackpressureReached',
    InvalidInput                 = 'InvalidInput',
    MaxInputChannelsReached      = 'MaxInputChannelsReached',

    UnknownServerError           = 'Error'
}