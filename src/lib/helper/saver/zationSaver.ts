/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {Zation} from "../../api/zation";

export class ZationSaver {

    private static client : Record<string,Zation>;

    static save(client : Zation,key : string) {
        this.client[key] = client;
    }

    static load(key) : Zation {
        if(!this.client.hasOwnProperty(key)) {
            //todo specific error that also exported
            throw new Error('Key Not Found')
        }
        return this[key];
    }
}