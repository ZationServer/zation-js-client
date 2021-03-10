/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {Client} from "../../core/client";

export class ReactionBox<S>
{
    protected self: S;

    protected active: boolean;
    private client: Client | undefined;

    constructor() {
        this.active = true;
        this.client = undefined;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @internal
     * @description
     * This method is used internal!
     */
    _link(client: Client) {
        this.client = client;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @internal
     * @description
     * This method is used internal!
     */
    _unlink() {
        this.client = undefined;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the linked client.
     * Notice that it can be undefined if no client is linked.
     */
    getLinkedClient(): Client | undefined {
        return this.client;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Activate the reaction box.
     */
    activate(): void {
        this.active = true;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Deactivate the reaction box.
     */
    deactivate(): void {
        this.active = false;
    }
}


