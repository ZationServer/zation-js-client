/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {List} from "./list";

export class ListMap<T>
{
    private map: object = {};

    constructor() {
    }

    add(key: PropertyKey,item: T): void {
        this.get(key).addItem(item);
    }

    remove(key: PropertyKey,item?: T): void{
        const sBox = this.tryGet(key);
        if(sBox){
            sBox.remove(item);
        }
    }

    get(key: PropertyKey): List<T> {
        if(this.map.hasOwnProperty(key)) {
            return this.map[key];
        }
        else{
            this.map[key] = new List<T>();
            return this.map[key];
        }
    }

    tryGet(key: PropertyKey): List<T> | undefined {
        return this.map[key];
    }
}

