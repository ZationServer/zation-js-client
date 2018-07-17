/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

class ReactionBox
{

    private active : boolean;

    constructor()
    {
        this.active = true;
    }

    // noinspection JSUnusedGlobalSymbols
    activate() : void
    {
        this.active = true;
    }

    // noinspection JSUnusedGlobalSymbols
    deactivate() : void
    {
        this.active = false;
    }

    _trigger(data : any)
    {
    };

}

export = ReactionBox;

