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
    static readonly GROUP                        = 'group';
    static readonly DESCRIPTION                  = 'description';
    static readonly TYPE                         = 'type';
    static readonly SEND_INFO                    = 'sendInfo';
    static readonly IS_FROM_ZATION_SYSTEM        = 'isFromZationSystem';
    static readonly IS_PRIVATE                   = 'isPrivate';
    static readonly INFO = ERROR_INFO;
}

class REQUEST_INPUT
{
    static readonly INPUT                        = 'i';
    static readonly TASK                         = 't';
    static readonly VERSION                      = 'v';
    static readonly SYSTEM                       = 's';
    static readonly AUTH                         = 'a';
    static readonly TOKEN                        = 'to';
}

class RESPONSE_ERROR
{
    static readonly NAME                         = 'n';
    static readonly GROUP                        = 'g';
    static readonly TYPE                         = 't';
    static readonly FROM_ZATION_SYSTEM           = 'zs';
    static readonly DESCRIPTION                  = 'd';
    static readonly INFO                         = 'i';
}

class HTTP_GET_REQ
{
    static readonly VERSION                      = 'v';
    static readonly SYSTEM                       = 's';
    static readonly AUTH_REQ                     = 'a';
    static readonly CONTROLLER                   = 'c';
    static readonly SYSTEM_CONTROLLER            = 'sc';
    static readonly INPUT                        = 'i';
    static readonly TOKEN                        = 't';
}

class ZATION_HTTP_INFO
{
    static readonly DEAUTHENTICATE               = 'deauthenticate';
}

class RESPONSE
{
    static readonly ERRORS                       = 'e';
    static readonly SUCCESSFUL                   = 's';
    static readonly RESULT                       = 'r';
    static readonly TOKEN                        = 't';
    static readonly ZATION_HTTP_INFO             = 'zhi';

    static readonly TOKEN_SIGNED                 = 'st';
    static readonly TOKEN_PLAIN                  = 'pt';

    static readonly RESULT_MAIN                  = 'r';
    static readonly RESULT_STATUS                = 's';

    static readonly ERROR                        = RESPONSE_ERROR;
}

class REQ_IN_C
{
    static readonly CONTROLLER        = 'c';
    static readonly SYSTEM_CONTROLLER = 'sc';
}

class VALIDATION_REQUEST_INPUT
{
    static readonly MAIN              = 'v';
    static readonly INPUT             = 'i';
    static readonly KEY_PATH          = 'kp';
    static readonly VALUE             = 'v';
}

class TOKEN
{
    static readonly AUTH_USER_GROUP             = 'zationAuthUserGroup';
    static readonly USER_ID                     = 'zationUserId';
    static readonly TOKEN_ID                    = 'zationTokenId';
    static readonly PANEL_ACCESS                = 'zationPanelAccess';
    static readonly EXPIRE                      = 'exp';
    static readonly CUSTOM_VARIABLES            = 'zationCustomVariables';
}


class CHANNEL
{
    //Zation Main Channels
    static readonly USER_CHANNEL_PREFIX       = 'ZATION.USER.';
    static readonly AUTH_USER_GROUP_PREFIX    = 'ZATION.AUTH_USER_GROUP.';
    static readonly DEFAULT_USER_GROUP        = 'ZATION.DEFAULT_USER_GROUP';
    static readonly ALL                       = 'ZATION.ALL';
    static readonly PANEL_IN                  = 'ZATION.PANEL_IN';
    static readonly PANEL_OUT                 = 'ZATION.PANEL_OUT';

    //Custom Channels
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
    static readonly TOKEN = TOKEN;
    static readonly CHANNEL = CHANNEL;
    static readonly USER_CHANNEL = USER_CHANNEL;
    static readonly RESPONSE = RESPONSE;
    static readonly ZATION_HTTP_INFO = ZATION_HTTP_INFO;
    static readonly REQ_IN_C = REQ_IN_C;
    static readonly HTTP_GET_REUQEST = HTTP_GET_REQ;
}

export = Settings;