/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {RawPackage} from "./receiverDefinitions";

export function buildRawPackage(receiver: string, data: any, apiLevel?: number): RawPackage {
    return {
        r: receiver,
        ...(data !== undefined ? {d: data} : {}),
        ...(apiLevel !== undefined ? {a: apiLevel}: {})
    };
}