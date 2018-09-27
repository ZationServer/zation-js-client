/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

class Config {
    static readonly DEBUG                 = 'debug';
    static readonly SYSTEM                = 'system';
    static readonly VERSION               = 'version';
    static readonly HOSTNAME              = 'hostname';
    static readonly PATH                  = 'path';
    static readonly PORT                  = 'port';
    static readonly SECURE                = 'secure';
    static readonly REJECT_UNAUTHORIZED   = 'rejectUnauthorized';
    static readonly POST_KEY              = 'postKey';

    static readonly AUTO_ALL_CH_SUB       = 'autoAllChSub';
    static readonly AUTO_USER_CH_SUB      = 'autoUserChSub';
    static readonly AUTO_DEFAULT_USER_GROUP_CH_SUB  = 'autoDefaultUserGroupChSub';
    static readonly AUTO_AUTH_USER_GROUP_CH_SUB     = 'autoAuthUserGroupChSub';

}

export = Config;