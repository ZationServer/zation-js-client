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

    /**
     * @description
     * Returns the reaction handler.
     */
    getReactionHandler() : T {
        return this.reactionHandler;
    }

    /**
     * @description
     * Returns the filter.
     */
    getFilter() : any {
        return this.filter;
    }

}

export = FullReaction;

