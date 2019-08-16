/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import DbDataParser                                    from "../dbDataParser";
import DbsComponent, {DbsComponentType, isDbsComponent, isDbsHead} from "./dbsComponent";
import DbUtils                                         from "../../dbUtils";
import {dbsMerger, DbsValueMerger, defaultValueMerger} from "../dbsMergerUtils";
import {DbsComparator}                                 from "../dbsComparator";

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
     * @param comparator
     */
    setComparator(comparator : DbsComparator | undefined) : void {}

    /**
     * Merge this dbs component with the new component.
     * @param newValue
     */
    meregeWithNew(newValue: any) {
        if (isDbsHead(newValue)) {
            const newTimestamp = newValue.getTimestamp();
            const newComponentValue = newValue.getComponentValue();

            const mergedValue = dbsMerger(this.componentValue,newComponentValue,this.valueMerger);
            this.componentValue = mergedValue;
            this.data = isDbsComponent(mergedValue) ? mergedValue.getData() : mergedValue;

            if (DbUtils.isNewerTimestamp(this.timestamp,newTimestamp)) {
                this.timestamp = newTimestamp;
            }
            return this;
        }
        return newValue;
    }

    /**
     * Insert.
     * @param keyPath
     * @param value
     * @param timestamp
     * @param ifContains
     */
    insert(keyPath: string[], value: any, timestamp: number, ifContains ?: string): void {
        if (keyPath.length > 0 && isDbsComponent(this.componentValue)) {
            (this.componentValue as DbsComponent).insert(keyPath, value, timestamp, ifContains)
        }
    }

    /**
     * Update.
     * @param keyPath
     * @param value
     * @param timestamp
     */
    update(keyPath: string[], value: any, timestamp: number): void {
        if (keyPath.length === 0) {
            if (this.componentValue !== undefined && DbUtils.checkTimestamp(this.timestamp, timestamp)) {
                this.componentValue = DbDataParser.parse(value);
                this.data = isDbsComponent(this.componentValue) ?
                    this.componentValue.getData() : this.componentValue;
                this.timestamp = timestamp;
            }

        } else if (keyPath.length > 0 && isDbsComponent(this.componentValue)) {
            (this.componentValue as DbsComponent).update(keyPath, value, timestamp);
        }
    }

    /**
     * Delete coordinator.
     * @param keyPath
     * @param timestamp
     */
    delete(keyPath: string[], timestamp: number): void {
        if (keyPath.length === 0) {
            this.componentValue = undefined;
            this.data = undefined;
            this.timestamp = timestamp;
        } else if (keyPath.length > 0 && isDbsComponent(this.componentValue)) {
            (this.componentValue as DbsComponent).delete(keyPath, timestamp);
        }
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
}