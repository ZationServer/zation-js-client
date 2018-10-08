/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

class FullReaction<T extends Function>
{
    private readonly reactionHandler : T;
    private readonly filter : object;

    constructor(reactionHandler : T,filter ?: object)
    {
        this.reactionHandler = reactionHandler;

        if(filter !== undefined) {
            this.filter = filter;
        }
        else {
            this.filter = {};
        }
    }

    getReactionHandler() : T {
        return this.reactionHandler;
    }

    getFilter() : object {
        return this.filter;
    }

}

export = FullReaction;

