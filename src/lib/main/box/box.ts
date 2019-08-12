/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {SBox} from "./sBox";

type ForEeachFunction<T> = (item : T) => Promise<void>;

export class Box<T> extends SBox<T>
{
    private fixedItems : T[] = [];
    
    constructor() {super();}

    // noinspection JSUnusedGlobalSymbols
    async forEach(func : ForEeachFunction<T>) : Promise<void>
    {
        for(let i = 0; i < this.items.length; i++) {
            await func(this.items[i]);
        }
        for(let i = 0; i < this.fixedItems.length; i++) {
            await func(this.fixedItems[i]);
        }
    }

    async forEachAll(func : ForEeachFunction<T>) : Promise<void>
    {
        let promise : Promise<void>[] = [];
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
    addFixedItem(item : T) : void {
        this.fixedItems.push(item)
    }

}

