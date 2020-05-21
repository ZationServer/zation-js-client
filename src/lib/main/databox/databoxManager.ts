/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import Databox from "./databox";

export default class DataboxManager {

    private readonly _initializedDataboxes: Set<Databox> = new Set<Databox>();

    add(databox: Databox) {
        this._initializedDataboxes.add(databox);
    }

    delete(databox: Databox){
        this._initializedDataboxes.delete(databox);
    }

    async disconnectAll() {
        const promises: Promise<void>[] = [];
        for(const databox of this._initializedDataboxes) {
            promises.push(databox.disconnect());
        }
        await Promise.all(promises);
    }
}