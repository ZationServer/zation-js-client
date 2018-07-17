/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

class ERROR_INFO
{
    static readonly MAIN                    = 'main';
}

class ERROR
{
    static readonly NAME                         = 'name';
    static readonly DESCRIPTION                  = 'description';
    static readonly TYPE                         = 'type';
    static readonly SEND_INFO                    = 'sendInfo';
    static readonly IS_FROM_ZATION_SYSTEM        = 'isFromZationSystem';
    static readonly IS_PRIVATE                   = 'isPrivate';
    static readonly INFO = ERROR_INFO;
}

class REQUEST_INPUT
{
    static readonly CONTROLLER                   = 'c';
    static readonly INPUT                        = 'i';
    static readonly TASK                         = 't';
    static readonly VERSION                      = 'v';
    static readonly SYSTEM                       = 's';
    static readonly AUTH                         = 'a';
    static readonly TOKEN                        = 'to';
}

class RESPONSE
{
    static readonly ERRORS                       = 'e';
    static readonly SUCCESSFUL                   = 's';
    static readonly RESULT                       = 'r';
    static readonly TOKEN                        = 't';

    static readonly TOKEN_SIGNED                 = 'st';
    static readonly TOKEN_PLAIN                  = 'pt';

    static readonly RESULT_PAIRS                 = 'kv';
    static readonly RESULT_VALUES                = 'v';
}

class VALIDATION_REQUEST_INPUT
{
    static readonly MAIN              = 'v';
    static readonly CONTROLLER        = 'c';
    static readonly INPUT             = 'i';
    static readonly KEY_PATH          = 'kp';
    static readonly VALUE             = 'v';
}

class CLIENT
{
    static readonly AUTH_USER_GROUP             = 'zationAuthUserGroup';
    static readonly USER_ID                     = 'zationUserId';
    static readonly TOKEN_ID                    = 'zationTokenId';
    static readonly PANEL_ACCESS                = 'zationPanelAccess';
    static readonly EXPIRE                      = 'exp';
}


class CHANNEL
{
    static readonly USER_CHANNEL_PREFIX       = 'ZATION.USER.';
    static readonly AUTH_USER_GROUP_PREFIX    = 'ZATION.AUTH_USER_GROUP.';
    static readonly DEFAULT_USER_GROUP        = 'ZATION.DEFAULT_USER_GROUP';
    static readonly ALL                       = 'ZATION.ALL';
    static readonly PANEL                     = 'ZATION.PANEL';
    static readonly ALL_WORKER                = 'ZATION.ALL_WORKER';
    static readonly ALL_WORKER_LEADER         = 'ZATION.ALL_WORKER_LEADER';

    static readonly CUSTOM_ID_CHANNEL_PREFIX  = 'ZATION.CUSTOM_ID_CHANNEL.';
    static readonly CUSTOM_CHANNEL_ID         = '.CH_ID.';

    static readonly CUSTOM_CHANNEL_PREFIX     = 'ZATION.CUSTOM_CHANNEL.';
}


class USER_CHANNEL
{
    static readonly AUTH_OUT              = 'zationAuthOut';
    static readonly RE_AUTH               = 'zationReAuth';
}


class Settings
{
    static readonly ERROR = ERROR;
    static readonly REQUEST_INPUT = REQUEST_INPUT;
    static readonly VALIDATION_REQUEST_INPUT = VALIDATION_REQUEST_INPUT;
    static readonly CLIENT = CLIENT;
    static readonly CHANNEL = CHANNEL;
    static readonly USER_CHANNEL = USER_CHANNEL;
    static readonly RESPONSE = RESPONSE;
}

export = Settings;