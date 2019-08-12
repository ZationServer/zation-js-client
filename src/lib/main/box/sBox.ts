/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

type ForEeachFunction<T> = (item : T) => Promise<void>;

export class SBox<T>
{
    protected items : T[] = [] = [];
    protected inUse : boolean = false;

    constructor() {}

    // noinspection JSUnusedGlobalSymbols
    setInUse(inUse : boolean) {
        this.inUse = inUse;
    }

    // noinspection JSUnusedGlobalSymbols
    async forEach(func : ForEeachFunction<T>) : Promise<void>
    {
        this.inUse = true;
        //use extra refernce
        //the this.items can maybe changed to a new list. (by edit the list)
        const array = this.items;
        for(let i = 0; i < array.length; i++) {
            await func(array[i]);
        }
        this.inUse = false;
    }

    async forEachAll(func : ForEeachFunction<T>) : Promise<void>
    {
        this.inUse = true;
        //use extra refernce
        //the this.items can maybe changed to a new list. (by edit the list)
        const array = this.items;
        const promise : Promise<void>[] = [];
        for(let i = 0; i < array.length; i++) {
            promise.push(func(array[i]));
        }
        this.inUse = false;
        await Promise.all(promise);
    }

    getItems() : T[] {
        return this.items;
    }

    //Part Items

    // noinspection JSUnusedGlobalSymbols
    addItem(item : T) : void {
        if(this.inUse){this._copyInternal();}
        this.items.push(item);
    }

    private _copyInternal() {
        this.items = this.items.slice();
    }

    // noinspection JSUnusedGlobalSymbols
    removeItem(item : T) : boolean {
        const index = this.items.indexOf(item);
        if (index != -1) {
            if(this.inUse){this._copyInternal();}
            this.items.splice(index, 1);
            return true;
        }
        else{
            return false;
        }
    }

    remove(item ?: T) : void {
        if(item){
            this.removeItem(item);
        }
        else {
            this.removeAllItems();
        }
    }

    //Part Remove All

    // noinspection JSUnusedGlobalSymbols
    removeAllItems() : void {
        this.items = [];
    }
}

