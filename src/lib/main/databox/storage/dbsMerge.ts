/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {isDbsComponent}                           from "./components/dbsComponent";
import DbDataParser                               from "./dbDataParser";

export interface MergeResult {
    /**
     * merged value
     */
    mergedValue: any,
    /**
     * Indicates if the data has changed.
     */
    dataChanged: boolean
}

export type DbsValueMerger = (oldValue: any, newValue: any) => any;

export function defaultValueMerger(oldValue: any, newValue: any): any {
    return newValue;
}

export function dbsMerger(oldValue: any, newValue: any,valueMerger: DbsValueMerger, newTimestamp: number): MergeResult {
    if(isDbsComponent(oldValue)){
        return oldValue.mergeWithNew(newValue);
    }
    else {
        if(isDbsComponent(newValue)){
            return {
                mergedValue: newValue,
                dataChanged: true
            };
        }
        else {
            const merged = DbDataParser.parse(valueMerger(oldValue,newValue),newTimestamp);
            return {
                mergedValue: merged,
                dataChanged: (isDbsComponent(merged) ? merged.data : merged) !== oldValue
            }
        }
    }
}