/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

export type OrAddFunction<T> = (res : T[]) => void;

export class OrBuilder<T,R>
{
    private readonly main : T;
    private readonly orAdd : Function;

    constructor(main : T,orAdd : OrAddFunction<R>)
    {
        this.main = main;
        this.orAdd = orAdd;
    }

    or(... searchValues : R[]) : OrBuilder<T,R>
    {
        this.orAdd(searchValues);
        return this;
    }

    next() : T
    {
        return this.main;
    }
}