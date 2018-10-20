/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

type ForEeachFunction<T> = (item : T) => Promise<void>;

class SBox<T>
{
    protected items : T[] = [] = [];

    constructor() {}

    // noinspection JSUnusedGlobalSymbols
    async forEach(func : ForEeachFunction<T>) : Promise<void>
    {
        for(let i = 0; i < this.items.length; i++) {
            await func(this.items[i]);
        }
    }

    async forEachAll(func : ForEeachFunction<T>) : Promise<void>
    {
        let promise : Promise<void>[] = [];
        for(let i = 0; i < this.items.length; i++) {
            promise.push(func(this.items[i]));
        }
        await Promise.all(promise);
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

    remove(item ?: T) : void
    {
        if(item){
            this.removeItem(item);
        }
        else {
            this.removeAllItems();
        }
    }

    //Part Remove All

    // noinspection JSUnusedGlobalSymbols
    removeAllItems() : void
    {
        this.items = [];
    }


}

export = SBox;