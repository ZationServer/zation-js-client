/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import DbsComponent, {DbsComponentType, isDbsArray, isDbsComponent} from "./dbsComponent";
import DbStorageParser                                 from "../dbStorageParser";
import DbUtils                                         from "../../dbUtils";
import DbsSimplePathCoordinator                        from "./dbsSimplePathCoordinator";
import {dbsMerger, DbsValueMerger, defaultValueMerger} from "../dbsMergerUtils";
import {DbsComparator}                                 from "../dbsComparator";

export default class DbsArray extends DbsSimplePathCoordinator implements DbsComponent {

    private readonly data : any[];
    private readonly componentStructure : any[];
    private readonly timestamps : number[] = [];
    private valueMerger : DbsValueMerger = defaultValueMerger;

    constructor(rawData : any[]) {
        super();

        this.data = [];
        this.componentStructure = [];

        let parsed;
        for (let i = 0; i < rawData.length; i++) {
            parsed = DbStorageParser.parse(rawData[i]);
            this.componentStructure[i] = parsed;
            this.data[i] = isDbsComponent(parsed) ? parsed.getData() : parsed;
        }
    }

    get dbsComponent(){return true;}
    get dbsComponentType(){return DbsComponentType.dbsArray}

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
     * Creates a loop for each DbsComponent in the complete structure.
     * Also includes the component from which you call the method.
     * @param func
     */
    forEachComp(func: (comp: DbsComponent) => void): void {
        func(this);
        let value;
        for(let i = 0; i < this.componentStructure.length; i++){
            value = this.componentStructure[i];
            if(isDbsComponent(value)){
                value.forEachComp(func);
            }
        }
    }

    /**
     * Returns the time on this index or if
     * it does not exist a 0.
     * @param index
     */
    private getTimestamp(index : number) : number {
        const timestamp = this.timestamps[index];
        return timestamp !== undefined ? timestamp : 0;
    }

    /**
     * Returns if the index exists.
     * @param index
     */
    private hasIndex(index : number) : boolean {
        return this.componentStructure[index] !== undefined;
    }

    /**
     * Returns the dbs component on this
     * key or undefined if it not exists.
     * @param key
     */
    _getDbsComponent(key: string): DbsComponent | undefined {
        const component = this.componentStructure[parseInt(key)];
        return isDbsComponent(component) ? component : undefined;
    }

    /**
     * Returns a copy of the data.
     */
    getDataCopy() : any[] {
        const data : any[] = [];
        let value;
        for(let i = 0; i < this.componentStructure.length; i++){
            value = this.componentStructure[i];
            data[i] = isDbsComponent(value) ? value.getDataCopy() : value;
        }
        return data;
    }

    /**
     * Returns the data.
     */
    getData() {
        return this.data;
    }

    /**
     * Merge this dbs component with the new component.
     * @param newValue
     */
    meregeWithNew(newValue: any) {
        if(isDbsArray(newValue)){
            newValue.forEachPair((index, value, componentValue, timestamp) => {
                if(this.hasIndex(index)){
                    const mergedValue = dbsMerger(this.componentStructure[index],componentValue,this.valueMerger);
                    this.componentStructure[index] = mergedValue;
                    this.data[index] = isDbsComponent(mergedValue) ? mergedValue.getData() : mergedValue;
                }
                else {
                    this.data[index] = value;
                    this.componentStructure[index] = componentValue;
                }
                if(timestamp !== undefined && DbUtils.isNewerTimestamp(this.timestamps[index],timestamp)){
                    this.timestamps[index] = timestamp;
                }
            });
            return this;
        }
        return newValue;
    }

    /**
     * Insert process.
     * @param key
     * @param value
     * @param timestamp
     * @param ifContains
     * @private
     */
    _insert(key: string, value: any, timestamp : number,ifContains ?: string): void {
        let index = parseInt(key);
        if(isNaN(index)){
            index = this.componentStructure.length;
        }

        if(ifContains !== undefined && !this.hasIndex(parseInt(ifContains))){
            return;
        }

        if (!this.hasIndex(index) && DbUtils.checkTimestamp(this.getTimestamp(index),timestamp)) {
            const parsed = DbStorageParser.parse(value);
            this.componentStructure[index] = parsed;
            this.data[index] = isDbsComponent(parsed) ? parsed.getData() : parsed;
            this.timestamps[index] = timestamp;
        }
    }

    /**
     * Update process.
     * @param key
     * @param value
     * @param timestamp
     * @private
     */
    _update(key: string, value: any, timestamp : number): void {
        const index = parseInt(key);

        if (this.hasIndex(index) && DbUtils.checkTimestamp(this.getTimestamp(index),timestamp)) {
            const parsed = DbStorageParser.parse(value);
            this.componentStructure[index] = parsed;
            this.data[index] = isDbsComponent(parsed) ? parsed.getData() : parsed;
            this.timestamps[index] = timestamp;
        }
    }

    /**
     * Delete process.
     * @param key
     * @param timestamp
     * @private
     */
    _delete(key: string, timestamp : number): void {
        let index = parseInt(key);
        if(isNaN(index)){
            index = this.componentStructure.length-1;
            if(index < 0){return;}
        }

        if (this.hasIndex(index) && DbUtils.checkTimestamp(this.getTimestamp(index),timestamp)) {
            this.data.splice(index, 1);
            this.componentStructure.splice(index, 1);
            this.timestamps.splice(index, 1);
        }
    }

    /**
     * For each pair in this dbsArray.
     * @param func
     */
    forEachPair(func : (index : number,value : any,componentValue : any,timestamp : number | undefined) => void) : void {
        for(let i = 0; i < this.componentStructure.length; i++){
            func(i,this.data[i],this.componentStructure[i],this.timestamps[i]);
        }
    }
}