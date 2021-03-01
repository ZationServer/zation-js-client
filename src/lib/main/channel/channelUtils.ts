/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {CHANNEL_MEMBER_SPLIT} from "./channelDefinitions";

export function buildFullChId(chId: string = '', memberStr?: string): string {
    return memberStr === undefined ? (chId) : (chId + CHANNEL_MEMBER_SPLIT + memberStr);
}

