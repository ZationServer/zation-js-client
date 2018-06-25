/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

class Settings {}

Settings.CLIENT = {};
Settings.CLIENT.AUTH_USER_GROUP             = 'zationAuthUserGroup';
Settings.CLIENT.USER_ID                     = 'zationUserId';
Settings.CLIENT.TOKEN_ID                    = 'zationTokenId';
Settings.CLIENT.PANEL_ACCESS                = 'zationPanelAccess';
Settings.CLIENT.EXPIRE                      = 'exp';

//ZATION SOCKET CHANNELS
Settings.CHANNEL = {};
Settings.CHANNEL.USER_CHANNEL_PREFIX        = 'ZATION.USER.';
Settings.CHANNEL.AUTH_USER_GROUP_PREFIX     = 'ZATION.AUTH_USER_GROUP.';
Settings.CHANNEL.DEFAULT_USER_GROUP         = 'ZATION.DEFAULT_USER_GROUP';
Settings.CHANNEL.ALL                        = 'ZATION.ALL';
Settings.CHANNEL.PANNEL                     = 'ZATION.PANEL';

Settings.CHANNEL.CUSTOM_ID_CHANNEL_PREFIX  = 'ZATION.CUSTOM_ID_CHANNEL.';
Settings.CHANNEL.CUSTOM_CHANNEL_ID         = '.CH_ID.';

Settings.CHANNEL.CUSTOM_CHANNEL_PREFIX     = 'ZATION.CUSTOM_CHANNEL.';

//Zation User Channel Events
Settings.USER_CHANNEL = {};
Settings.USER_CHANNEL.AUTH_OUT              = 'zationAuthOut';
Settings.USER_CHANNEL.RE_AUTH               = 'zationReAuth';

module.exports = Settings;