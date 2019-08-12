/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

export class FullReaction<T extends Function>
{
    private readonly reactionHandler : T;
    private readonly filter : object;
    private readonly once : boolean;

    constructor(reactionHandler : T,filter ?: object,once : boolean = false)
    {
        this.once = once;
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
     * Returns if it is a once reaction.
     */
    isOnce() : boolean {
        return this.once;
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


