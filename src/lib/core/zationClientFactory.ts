/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {ZationClient}              from "./zationClient";
import {ZationClientNotFoundError} from "../main/error/zationClientNotFoundError";

export class ZationClientFactory {

    private static client: Record<string,ZationClient> = {};

    static save(client: ZationClient, key: string) {
        this.client[key] = client;
    }

    static load(key): ZationClient {
        if(!this.client.hasOwnProperty(key)) {
            throw new ZationClientNotFoundError(key);
        }
        return this.client[key];
    }
}