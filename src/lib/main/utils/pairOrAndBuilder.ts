/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

export type ContinueFunction = (res : object[]) => void;

export class PairOrAndBuilder<T>
{
    private readonly main : T;
    private readonly continueFunc : ContinueFunction;

    private andCache : {};
    private resCache : object[];

    constructor(main : T, continueFunction : ContinueFunction, startObj : object = {})
    {
        this.andCache = startObj;
        this.main = main;
        this.continueFunc = continueFunction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Link new values with in OR connection.
     * @param key
     * @param value
     */
    or(key : string, value : any) : PairOrAndBuilder<T>
    {
        this.resCache.push(this.andCache);
        this.andCache = {[key] : value};
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Link new values with in AND connection.
     * Notice that you reset your chain of OR statements.
     * @param key
     * @param value
     */
    and(key : string, value : any) : PairOrAndBuilder<T>
    {
        this.andCache[key] = value;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Continue with the builder before.
     */
    continue() : T
    {
        if(this.andCache !== {}) {
            this.resCache.push(this.andCache);
        }
        this.continueFunc(this.resCache);
        return this.main;
    }
}