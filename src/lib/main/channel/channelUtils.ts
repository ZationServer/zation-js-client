/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {CHANNEL_MEMBER_SPLIT} from "./channelDefinitions";

export function buildFullChId(chId: string = '', member?: string): string {
    return member === undefined ? (chId) : (chId + CHANNEL_MEMBER_SPLIT + member);
}

