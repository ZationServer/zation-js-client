/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

export type OrAddFunction<T> = (res: T[]) => void;

export class OrBuilder<T,R>
{
    private readonly main: T;
    private readonly orAdd: Function;

    constructor(main: T,orAdd: OrAddFunction<R>)
    {
        this.main = main;
        this.orAdd = orAdd;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Link new values with in OR connection.
     * @param searchValues
     * The values are connected with AND.
     */
    or(... searchValues: R[]): OrBuilder<T,R>
    {
        this.orAdd(searchValues);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Continue with the builder before.
     */
    continue(): T
    {
        return this.main;
    }
}