/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

export type NextFunction = (res : object[]) => void;

export class PairOrAndBuilder<T>
{
    private readonly main : T;
    private readonly nextFunc : NextFunction;

    private andCache : {};
    private resCache : object[];

    constructor(main : T,next : NextFunction,startObj : object = {})
    {
        this.andCache = startObj;
        this.main = main;
        this.nextFunc = next;
    }

    or(key : string, value : any) : PairOrAndBuilder<T>
    {
        this.resCache.push(this.andCache);
        this.andCache = {[key] : value};
        return this;
    }

    and(key : string, value : any) : PairOrAndBuilder<T>
    {
        this.andCache[key] = value;
        return this;
    }

    next() : T
    {
        if(this.andCache !== {}) {
            this.resCache.push(this.andCache);
        }
        this.nextFunc(this.resCache);
        return this.main;
    }
}