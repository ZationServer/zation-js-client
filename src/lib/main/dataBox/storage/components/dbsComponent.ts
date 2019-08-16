/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {DbsValueMerger}  from "../dbsMergerUtils";
import DbsObject         from "./dbsObject";
import DbsArray          from "./dbsArray";
import DbsKeyArray       from "./dbsKeyArray";
import {DbsComparator}       from "../dbsComparator";
import DbsHead           from "./dbsHead";

export default interface DbsComponent {

    dbsComponent : boolean;
    dbsComponentType : DbsComponentType;

    insert(keyPath : string[], value : any,timestamp : number,ifContains ?: string) : void;
    update(keyPath : string[], value : any,timestamp : number) : void
    delete(keyPath : string[],timestamp : number) : void

    /**
     * Merge this dbs component with the new component.
     * @param newValue
     */
    meregeWithNew(newValue : any) : any;

    /**
     * Sets the value merger of this component.
     * Undefined will reset the valueMerger.
     * @param valueMerger
     */
    setValueMerger(valueMerger : DbsValueMerger | undefined) : void;

    /**
     * Sets the comparator of this component.
     * Undefined will reset the comparator.
     * @param comparator
     */
    setComparator(comparator : DbsComparator | undefined) : void;

    /**
     * Creates a loop for each DbsComponent in the complete structure.
     * Also includes the component from which you call the method.
     * @param func
     */
    forEachComp(func : (comp : DbsComponent) => void) : void;

    getDbsComponent(keyPath : string[]) : DbsComponent | undefined;

    getDataCopy() : any
    getData() : any

}

export interface DbsComponentOptions {
    comparator ?: DbsComparator,
    valueMerger ?: DbsValueMerger
}

export enum DbsComponentType {
    dbsObject,
    dbsKeyArray,
    dbsArray,
    dbsHead
}

export function isDbsComponent(value : any) : value is DbsComponent  {
    return value['dbsComponent'];
}

export function isDbsObject(value : any) : value is DbsObject {
    return value['dbsComponentType'] === DbsComponentType.dbsObject;
}

export function isDbsKeyArray(value : any) : value is DbsKeyArray {
    return value['dbsComponentType'] === DbsComponentType.dbsKeyArray;
}

export function isDbsArray(value : any) : value is DbsArray {
    return value['dbsComponentType'] === DbsComponentType.dbsArray;
}

export function isDbsHead(value : any) : value is DbsHead {
    return value['dbsComponentType'] === DbsComponentType.dbsHead;
}