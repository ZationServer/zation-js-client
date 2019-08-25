/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import DbsComponent, {DbsComponentType, isDbsComponent, isDbsHead, MergeResult, ModifyLevel} from "./dbsComponent";
import DbDataParser                                        from "../dbDataParser";
import DbUtils                                             from "../../dbUtils";
import {dbsMerger, DbsValueMerger, defaultValueMerger}     from "../dbsMergerUtils";
import {DbsComparator}                                     from "../dbsComparator";
import {deepEqual}                                         from "../../../utils/deepEqual";

export default class DbsHead implements DbsComponent {

    private data: any;
    private componentValue: any;
    private timestamp: number = 0;
    private valueMerger: DbsValueMerger = defaultValueMerger;

    constructor(rawData: any = undefined) {
        this.componentValue = DbDataParser.parse(rawData);

        this.data = isDbsComponent(this.componentValue) ?
            this.componentValue.getData() : this.componentValue;
    }

    get dbsComponent() {
        return true;
    }

    get dbsComponentType() {
        return DbsComponentType.dbsHead
    }

    /**
     * Returns a copy of the data.
     */
    getDataCopy(): any {
        if (isDbsComponent(this.componentValue)) {
            return this.componentValue.getDataCopy();
        } else {
            return this.componentValue;
        }
    }

    /**
     * Returns the data.
     */
    getData() {
        return this.data;
    }

    /**
     * Creates a loop for each DbsComponent in the complete structure.
     * Also includes the component from which you call the method.
     * @param func
     */
    forEachComp(func: (comp: DbsComponent) => void): void {
        func(this);
        if (isDbsComponent(this.componentValue)) {
            this.componentValue.forEachComp(func);
        }
    }

    /**
     * Returns the dbs component on that path.
     * @param keyPath
     */
    getDbsComponent(keyPath: string[]): DbsComponent | undefined {
        if (keyPath.length === 0) {
            return isDbsComponent(this.componentValue) ?
                this.componentValue : undefined;
        } else if (keyPath.length > 0) {
            if (isDbsComponent(this.componentValue)) {
                return this.componentValue.getDbsComponent(keyPath);
            }
        }
        return undefined;
    }

    /**
     * Sets the value merger of this component.
     * Undefined will reset the valueMerger.
     * @param valueMerger
     */
    setValueMerger(valueMerger : DbsValueMerger | undefined) : void {
        this.valueMerger = valueMerger || defaultValueMerger;
    }

    /**
     * Sets the comparator of this component.
     * Undefined will reset the comparator.
     * @return if the data has changed.
     * @param comparator
     */
    setComparator(comparator : DbsComparator | undefined) : boolean {
        return false;
    }

    /**
     * Merge this dbs component with the new component.
     * @param newValue
     */
    meregeWithNew(newValue: any) : MergeResult {
        if (isDbsHead(newValue)) {
            const newTimestamp = newValue.getTimestamp();
            const newComponentValue = newValue.getComponentValue();
            const {mergedValue : mergedValue,dataChanged} = dbsMerger(this.componentValue,newComponentValue,this.valueMerger);
            this.componentValue = mergedValue;
            this.data = isDbsComponent(mergedValue) ? mergedValue.getData() : mergedValue;

            if (DbUtils.isNewerTimestamp(this.timestamp,newTimestamp)) {
                this.timestamp = newTimestamp;
            }
            return {mergedValue : this,dataChanged: dataChanged};
        }
        return {mergedValue : newValue,dataChanged : true};
    }

    /**
     * Insert.
     * @return if the action was fully executed. (Data changed)
     * @param keyPath
     * @param value
     * @param timestamp
     * @param ifContains
     */
    insert(keyPath: string[], value: any, timestamp: number, ifContains ?: string): boolean {
        if (keyPath.length > 0 && isDbsComponent(this.componentValue)) {
            return (this.componentValue as DbsComponent).insert(keyPath, value, timestamp, ifContains)
        }
        return false;
    }

    /**
     * Update.
     * @return the modify level.
     * @param keyPath
     * @param value
     * @param timestamp
     * @param checkDataChange
     */
    update(keyPath: string[], value: any, timestamp: number,checkDataChange : boolean = false) : ModifyLevel {
        if (keyPath.length === 0) {
            if (this.componentValue !== undefined && DbUtils.checkTimestamp(this.timestamp, timestamp)) {
                let ml = ModifyLevel.DATA_TOUCHED;
                this.componentValue = DbDataParser.parse(value);
                const newData = isDbsComponent(this.componentValue) ?
                    this.componentValue.getData() : this.componentValue;
                if(checkDataChange && !deepEqual(newData,this.data)){
                    ml = ModifyLevel.DATA_CHANGED;
                }
                this.data = newData;
                this.timestamp = timestamp;
                return ml;
            }

        } else if (keyPath.length > 0 && isDbsComponent(this.componentValue)) {
            return (this.componentValue as DbsComponent).update(keyPath,value,timestamp,checkDataChange);
        }
        return ModifyLevel.NOTHING;
    }

    /**
     * Delete coordinator.
     * @return if the action was fully executed. (Data changed)
     * @param keyPath
     * @param timestamp
     */
    delete(keyPath: string[], timestamp: number): boolean {
        if (keyPath.length === 0) {
            this.componentValue = undefined;
            this.data = undefined;
            this.timestamp = timestamp;
            return true
        } else if (keyPath.length > 0 && isDbsComponent(this.componentValue)) {
            return (this.componentValue as DbsComponent).delete(keyPath, timestamp);
        }
        return false;
    }

    /**
     * Returns the component value.
     */
    getComponentValue(): any {
        return this.componentValue;
    }

    /**
     * Returns the timestamp.
     */
    getTimestamp() : number {
        return this.timestamp;
    }

    /**
     * Cast a value to an instance of this class.
     * That can be useful if you are programming in javascript,
     * but the IDE can interpret the typescript information of this library.
     * @param value
     */
    static cast(value : any) : DbsHead {
        return value as DbsHead;
    }
}