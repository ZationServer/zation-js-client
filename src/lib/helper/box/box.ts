/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

type ValidatorFunction<T> = (item : T) => boolean;
type ForEeachFunction<T> = (item : T) => Promise<void>;
type ForEeachFunctionSync<T> = (item : T) => void;

class Box<T>
{
    private readonly validator : ValidatorFunction<T>;

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

        for(let i = 0; i < this.items.length; i++) {
            promise.push(func(this.items[i]));
        }
        for(let i = 0; i < this.fixedItems.length; i++) {
            promise.push(func(this.fixedItems[i]));
        }

        await Promise.all(promise);
    }

    forEachSync(func : ForEeachFunctionSync<T>)
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
    addItem(item : T)
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
    removeItem(item : T) : boolean
    {
        const index = this.items.indexOf(item);
        if (index > -1) {
            this.items.splice(index, 1);
            return true;
        }
        return false;
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
    }


}

export = Box;