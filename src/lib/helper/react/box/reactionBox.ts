/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

class ReactionBox
{

    protected active : boolean;

    constructor()
    {
        this.active = true;
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

