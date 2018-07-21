/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import ResponseReactionBox = require("./responseReactionBox");
import ChannelReactionBox = require("./channelReactionBox");

export interface ZationOptions {
    system ?: string;
    version ?: number;
    hostname ?: string;
    path ?: string;
    port ?: number;
    secure ?: boolean;
    rejectUnauthorized ?: boolean;
    postKeyWord ?: string;
    debug ?: boolean;
    reactions ?:
        ResponseReactionBox | ChannelReactionBox | (ResponseReactionBox | ChannelReactionBox)[] |
        Record<string,ResponseReactionBox | ChannelReactionBox>;
    autoAllChSub ?: boolean;
    autoUserChSub ?: boolean;
    autoDefaultUserGroupChSub ?: boolean;
    autoAuthUserGroupChSub ?: boolean;
}