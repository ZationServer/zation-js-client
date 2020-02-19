/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {Zation}                    from "./zation";
import {ZationClientNotFoundError} from "../main/error/zationClientNotFoundError";

export class ZationSaver {

    private static client: Record<string,Zation> = {};

    static save(client: Zation,key: string) {
        this.client[key] = client;
    }

    static load(key): Zation {
        if(!this.client.hasOwnProperty(key)) {
            throw new ZationClientNotFoundError(key);
        }
        return this.client[key];
    }
}