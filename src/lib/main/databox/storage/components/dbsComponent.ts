/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {DbsValueMerger}  from "../dbsMergerUtils";
import DbsObject         from "./dbsObject";
import DbsArray          from "./dbsArray";
import DbsKeyArray       from "./dbsKeyArray";
import {DbsComparator}   from "../dbsComparator";
import DbsHead           from "./dbsHead";
import {ModifyToken}     from "./modifyToken";
import {ImmutableJson}   from "../../../utils/typeUtils";
import {
    DbProcessedSelector,
    DeleteProcessArgs,
    InsertProcessArgs,
    UpdateProcessArgs
} from "../../dbDefinitions";

export default interface DbsComponent {

    dbsComponent: boolean;
    dbsComponentType: DbsComponentType;

    /**
     * @return the modify level.
     * @param selector
     * @param value
     * @param args
     * @param mt
     */
    insert(selector: DbProcessedSelector, value: any, args: InsertProcessArgs, mt: ModifyToken): void;
    /**
     * @return the modify level.
     * @param selector
     * @param value
     * @param args
     * @param mt
     */
    update(selector: DbProcessedSelector, value: any, args: UpdateProcessArgs, mt: ModifyToken): void;
    /**
     * @return the modify level.
     * @param selector
     * @param args
     * @param mt
     */
    delete(selector: DbProcessedSelector, args: DeleteProcessArgs, mt: ModifyToken): void;

    /**
     * Merge this dbs component with the new component.
     * @param newValue
     */
    mergeWithNew(newValue: any): MergeResult;

    /**
     * Sets the value merger of this component.
     * Undefined will reset the valueMerger.
     * @param valueMerger
     */
    setValueMerger(valueMerger: DbsValueMerger | undefined): void;

    /**
     * Sets the comparator of this component.
     * Undefined will reset the comparator.
     * @return if the data has changed.
     * @param comparator
     */
    setComparator(comparator: DbsComparator | undefined): boolean;

    /**
     * Creates a loop for each DbsComponent in the complete structure.
     * Also includes the component from which you call the method.
     * @param func
     */
    forEachComp(func: (comp: DbsComponent) => void): void;

    getDbsComponents(selector: DbProcessedSelector): DbsComponent[];

    getDataClone(): any;
    readonly data: ImmutableJson;
}

export interface DbsComponentOptions {
    comparator?: DbsComparator,
    valueMerger?: DbsValueMerger
}

export enum DbsComponentType {
    dbsObject,
    dbsKeyArray,
    dbsArray,
    dbsHead
}

export function isDbsComponent(value: any): value is DbsComponent  {
    return value && value['dbsComponent'];
}

export function isDbsObject(value: any): value is DbsObject {
    return value && value['dbsComponentType'] === DbsComponentType.dbsObject;
}

export function isDbsKeyArray(value: any): value is DbsKeyArray {
    return value && value['dbsComponentType'] === DbsComponentType.dbsKeyArray;
}

export function isDbsArray(value: any): value is DbsArray {
    return value && value['dbsComponentType'] === DbsComponentType.dbsArray;
}

export function isDbsHead(value: any): value is DbsHead {
    return value && value['dbsComponentType'] === DbsComponentType.dbsHead;
}

export const enum ModifyLevel {
    NOTHING = 0,
    DATA_TOUCHED = 1,
    DATA_CHANGED= 2
}

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