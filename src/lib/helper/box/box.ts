/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

type ValidatorFunction<T> = (item : T) => boolean;
type ForEeachFunction<T> = (item : T) => Promise<void>;

class Box<T>
{
    private readonly validator : ValidatorFunction<T>;

    private itemsWithKey : object = {};
    private items : T[] = [] = [];

    private fixedItems : T[] = [];
    
    constructor(validator : ValidatorFunction<T> = () => {return true;})
    {
        this.validator = validator;
    }

    // noinspection JSUnusedGlobalSymbols
    async forEach(func : ForEeachFunction<T>)
    {
        let promise : Promise<void>[] = [];

        for(let i = 0; i < this.fixedItems.length; i++) {
            promise.push(func(this.fixedItems[i]));
        }

        for(let i = 0; i < this.items.length; i++) {
            promise.push(func(this.items[i]));
        }

        for(let k in this.itemsWithKey) {
            if(this.itemsWithKey.hasOwnProperty(k)) {
                promise.push(func(this.itemsWithKey[k]));
            }
        }
        await Promise.all(promise);
    }

    //Part Items

    // noinspection JSUnusedGlobalSymbols
    addItem(item : T,key ?: string,overwrite : boolean = true)
    {
        if(key !== undefined) {
            return this.addKeyItem(key,item,overwrite);
        }
        else {
            return this.addIndexItem(item)
        }
    }

    //Part Fixed Items

    // noinspection JSUnusedGlobalSymbols
    addFixedItem(item : T)
    {
        if(this.validator(item)) {
            return this.fixedItems.push(item) -1;
        }
        else {
            return false;
        }
    }

    //Part Remove All

    // noinspection JSUnusedGlobalSymbols
    removeAllItems() : void
    {
        this.items = [];
        this.itemsWithKey = {};
    }

    // noinspection JSUnusedGlobalSymbols
    removeAllKeylessItems() : void
    {
        this.items = [];
    }

    //Part ADD

    // noinspection JSUnusedGlobalSymbols
    addIndexItem(item : T) : boolean
    {
        if(this.validator(item)) {
            this.items.push(item);
            return true;
        }
        else {
            return false;
        }
    }

    // noinspection JSUnusedGlobalSymbols
    addKeyItem(key,item,overwrite = true)
    {
        if(this.validator(item))
        {
            if((this.itemsWithKey.hasOwnProperty(key) && overwrite) ||
                !this.itemsWithKey.hasOwnProperty(key)) {
                this.itemsWithKey[key] = item;
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }

    //Part Key Items

    getKeyItem(key : string) : T
    {
        return this.itemsWithKey[key];
    }

    // noinspection JSUnusedGlobalSymbols
    removeKeyItem(key : string) : boolean
    {
        if(this.itemsWithKey.hasOwnProperty(key)) {
            delete this.itemsWithKey[key];
            return true;
        }
        else {
            return false;
        }
    }

}

export = Box;