/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

type ForEeachFunction<T> = (item : T) => Promise<void>;
type ForEeachFunctionSync<T> = (item : T) => void;

class Box<T>
{
    private items : T[] = [] = [];

    private fixedItems : T[] = [];
    
    constructor() {}

    // noinspection JSUnusedGlobalSymbols
    async forEach(func : ForEeachFunction<T>) : Promise<void>
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

    forEachSync(func : ForEeachFunctionSync<T>) : void
    {
        for(let i = 0; i < this.items.length; i++) {
            func(this.items[i]);
        }
        for(let i = 0; i < this.fixedItems.length; i++) {
            func(this.fixedItems[i]);
        }
    }

    //Part Items

    // noinspection JSUnusedGlobalSymbols
    addItem(item : T) : void
    {
        this.items.push(item);
    }

    // noinspection JSUnusedGlobalSymbols
    removeItem(item : T) : boolean
    {
        const index = this.items.indexOf(item);
        if (index != -1) {
            this.items.splice(index, 1);
            return true;
        }
        else{
            return false;
        }
    }

    //Part Fixed Items

    // noinspection JSUnusedGlobalSymbols
    addFixedItem(item : T) : void
    {
        this.fixedItems.push(item)
    }

    //Part Remove All

    // noinspection JSUnusedGlobalSymbols
    removeAllItems() : void
    {
        this.items = [];
    }


}

export = Box;