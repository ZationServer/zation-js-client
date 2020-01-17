/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {isDbsComponent, MergeResult}              from "./components/dbsComponent";
import DbDataParser                               from "./dbDataParser";

export type DbsValueMerger = (oldValue : any, newValue : any) => any;

export function defaultValueMerger(oldValue : any, newValue : any) : any {
    return newValue;
}

export function dbsMerger(oldValue : any, newValue : any,valueMerger : DbsValueMerger) : MergeResult {
    if(isDbsComponent(oldValue)){
        return oldValue.mergeWithNew(newValue);
    }
    else {
        if(isDbsComponent(newValue)){
            return {
                mergedValue : newValue,
                dataChanged : true
            };
        }
        else {
            const merged = DbDataParser.parse(valueMerger(oldValue,newValue));
            return {
                mergedValue : merged,
                dataChanged : (isDbsComponent(merged) ? merged.getData() : merged) !== oldValue
            }
        }
    }
}