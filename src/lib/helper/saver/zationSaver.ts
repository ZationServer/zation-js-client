/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {Zation}                    from "../../api/zation";
import {NoZationClientSetOnTheKey} from "../error/noZationClientSetOnTheKey";

export class ZationSaver {

    private static client : Record<string,Zation> = {};

    static save(client : Zation,key : string) {
        this.client[key] = client;
    }

    static load(key) : Zation {
        if(!this.client.hasOwnProperty(key)) {
            throw new NoZationClientSetOnTheKey(key);
        }
        return this.client[key];
    }
}