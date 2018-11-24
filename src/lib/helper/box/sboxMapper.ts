/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {SBox} from "./sBox";

export class SboxMapper<T>
{
    private map : object = {};

    constructor() {
    }

    add(key : PropertyKey,item : T) : void {
        this.get(key).addItem(item);
    }

    remove(key : PropertyKey,item ?: T) : void{
        const sBox = this.tryGet(key);
        if(sBox){
            sBox.remove(item);
        }
    }

    get(key : PropertyKey) : SBox<T> {
        if(this.map.hasOwnProperty(key)) {
            return this.map[key];
        }
        else{
            this.map[key] = new SBox<T>();
            return this.map[key];
        }
    }

    tryGet(key : PropertyKey) : SBox<T> | undefined {
        return this.map[key];
    }
}

