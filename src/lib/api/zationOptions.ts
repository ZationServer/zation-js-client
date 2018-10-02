/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import Const              = require("../helper/constants/constWrapper");

export interface ZationOptions {

    [Const.Config.DEBUG] ?: boolean;
    [Const.Config.SYSTEM] ?: string;
    [Const.Config.VERSION] ?: number;
    [Const.Config.HOSTNAME] ?: string;
    [Const.Config.PATH] ?: string;
    [Const.Config.PORT] ?: number;
    [Const.Config.SECURE] ?: boolean;
    [Const.Config.REJECT_UNAUTHORIZED] ?: boolean;
    [Const.Config.POST_KEY] ?: string;

    [Const.Config.AUTO_ALL_CH_SUB] ?: boolean;
    [Const.Config.AUTO_USER_CH_SUB] ?: boolean;
    [Const.Config.AUTO_DEFAULT_USER_GROUP_CH_SUB] ?: boolean;
    [Const.Config.AUTO_AUTH_USER_GROUP_CH_SUB] ?: boolean;
}