/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import Zation = require("../../../api/zation");

class ReactionBox
{

    protected active : boolean;
    private zation : Zation | undefined;

    constructor() {
        this.active = true;
        this.zation = undefined;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * This method is used internal!
     */
    _link(zation : Zation) {
        this.zation = zation;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * This method is used internal!
     */
    _unlink() {
        this.zation = undefined;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the linked client.
     * Notice that it can be undefined if no client is linked.
     */
    getLinkedClient() : Zation | undefined {
        return this.zation;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Activate the reaction box.
     */
    activate() : void
    {
        this.active = true;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Deactivate the reaction box.
     */
    deactivate() : void
    {
        this.active = false;
    }

}

export = ReactionBox;

