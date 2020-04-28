/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

export class FullReaction<T extends Function,F extends object = any>
{
    private readonly reactionHandler: T;
    private readonly filter: F;
    private readonly once: boolean;

    constructor(reactionHandler: T,filter: F,once: boolean = false) {
        this.once = once;
        this.reactionHandler = reactionHandler;
        this.filter = filter;
    }

    /**
     * @description
     * Returns if it is a once reaction.
     */
    isOnce(): boolean {
        return this.once;
    }

    /**
     * @description
     * Returns the reaction handler.
     */
    getReactionHandler(): T {
        return this.reactionHandler;
    }

    /**
     * @description
     * Returns the filter.
     */
    getFilter(): F {
        return this.filter;
    }

}


