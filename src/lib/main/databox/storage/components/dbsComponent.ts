/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {DbsComparator}               from "../dbsComparator";
import {ModifyToken}                 from "../modifyToken";
import {ImmutableJson}               from "../../../utils/typeUtils";
import {MergeResult, DbsValueMerger} from "../dbsMerge";
import {
    DbProcessedSelector,
    DeleteProcessArgs,
    InsertProcessArgs,
    UpdateProcessArgs
} from "../../dbDefinitions";

export const dbsComponentSymbol = Symbol();

export default interface DbsComponent {

    readonly [dbsComponentSymbol]: true;

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

export function isDbsComponent(value: any): value is DbsComponent  {
    return value && value[dbsComponentSymbol];
}