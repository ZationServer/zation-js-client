/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {List} from "./list";

type ForEachFunction<T> = (item: T) => Promise<void>;

export class MultiList<T> extends List<T>
{
    private fixedItems: T[] = [];

    constructor() {super();}

    // noinspection JSUnusedGlobalSymbols
    async forEach(func: ForEachFunction<T>): Promise<void>
    {
        for(let i = 0; i < this.items.length; i++) {
            await func(this.items[i]);
        }
        for(let i = 0; i < this.fixedItems.length; i++) {
            await func(this.fixedItems[i]);
        }
    }

    async forEachParallel(func: ForEachFunction<T>): Promise<void>
    {
        let promise: Promise<void>[] = [];
        for(let i = 0; i < this.items.length; i++) {
            promise.push(func(this.items[i]));
        }
        for(let i = 0; i < this.fixedItems.length; i++) {
            promise.push(func(this.fixedItems[i]));
        }
        await Promise.all(promise);
    }
    //Part Fixed Items

    // noinspection JSUnusedGlobalSymbols
    addFixedItem(item: T): void {
        this.fixedItems.push(item)
    }

}

