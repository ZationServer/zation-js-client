/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {isDbsComponent} from "./components/dbsComponent";
import DbDataParser  from "./dbDataParser";

export type DbsValueMerger = (oldValue : any, newValue : any) => any;

export function defaultValueMerger(oldValue : any, newValue : any) : any {
    return newValue;
}

export function dbsMerger(oldValue : any, newValue : any,valueMerger : DbsValueMerger) : any {
    if(isDbsComponent(oldValue)){
        return oldValue.meregeWithNew(newValue);
    }
    else {
        return isDbsComponent(newValue) ? newValue :
            DbDataParser.parse(valueMerger(oldValue,newValue));
    }
}