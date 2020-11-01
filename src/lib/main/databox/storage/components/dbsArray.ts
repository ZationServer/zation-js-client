/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import DbsComponent, {
    isDbsComponent,
    dbsComponentSymbol
} from "./dbsComponent";
import DbDataParser                                    from "../dbDataParser";
import DbUtils                                         from "../../dbUtils";
import DbsSimplePathCoordinator                        from "./dbsSimplePathCoordinator";
import {dbsMerger, DbsValueMerger, defaultValueMerger, MergeResult} from "../dbsMerge";
import {DbsComparator}                                 from "../dbsComparator";
import {deepEqual}                                     from "../../../utils/deepEqual";
import {
    DeleteProcessArgs,
    InsertProcessArgs,
    UpdateProcessArgs}                                 from "../../dbDefinitions";
import {ModifyLevel, ModifyToken}                      from "../modifyToken";
import {ImmutableJson}                                 from "../../../utils/typeUtils";

export default class DbsArray extends DbsSimplePathCoordinator implements DbsComponent {

    public readonly [dbsComponentSymbol] = true;

    public readonly data: ReadonlyArray<ImmutableJson>;
    private readonly componentStructure: any[];
    private readonly timestamps: number[] = [];
    private valueMerger: DbsValueMerger = defaultValueMerger;

    constructor(rawData: any[]) {
        super();

        this.data = [];
        this.componentStructure = [];

        let parsed;
        for (let i = 0; i < rawData.length; i++) {
            parsed = DbDataParser.parse(rawData[i]);
            this.componentStructure[i] = parsed;
            (this.data as any[])[i] = isDbsComponent(parsed) ? parsed.data : parsed;
        }
    }

    /**
     * Sets the value merger of this component.
     * Undefined will reset the valueMerger.
     * @param valueMerger
     */
    setValueMerger(valueMerger: DbsValueMerger | undefined): void {
        this.valueMerger = valueMerger || defaultValueMerger;
    }

    /**
     * Sets the comparator of this component.
     * Undefined will reset the comparator.
     * @return if the data has changed.
     * @param comparator
     */
    setComparator(comparator: DbsComparator | undefined): boolean {
        return false;
    }

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
    private getTimestamp(index: number): number {
        const timestamp = this.timestamps[index];
        return timestamp !== undefined ? timestamp: 0;
    }

    /**
     * Returns if the index exists.
     * @param index
     */
    private hasIndex(index: number): boolean {
        return this.componentStructure[index] !== undefined;
    }

    /**
     * Returns all keys.
     * @private
     */
    _getAllKeys(): string[] {
        const keys: string[] = [];
        const componentsLength = this.componentStructure.length;
        for(let i = 0; i < componentsLength; i++){
            keys[i] = i.toString();
        }
        return keys;
    }

    /**
     * Returns the data value of the key.
     * @param key
     * @private
     */
    _getValue(key: string): any {
        return this.data[parseInt(key)];
    }

    /**
     * Returns the dbs component on this
     * key or undefined if it not exists.
     * @param key
     */
    _getDbsComponent(key: string): DbsComponent | undefined {
        const component = this.componentStructure[parseInt(key)];
        return isDbsComponent(component) ? component: undefined;
    }

    /**
     * Returns a copy of the data.
     */
    getDataClone(): any[] {
        const data: any[] = [];
        let value;
        for(let i = 0; i < this.componentStructure.length; i++){
            value = this.componentStructure[i];
            data[i] = isDbsComponent(value) ? value.getDataClone() : value;
        }
        return data;
    }

    /**
     * Merge this dbs component with the new component.
     * @param newValue
     */
    mergeWithNew(newValue: any): MergeResult {
        if(newValue instanceof DbsArray){
            let mainDc: boolean = false;
            newValue.forEachPair((index, value, componentValue, timestamp) => {
                if(this.hasIndex(index)){
                    const {mergedValue,dataChanged} = dbsMerger(this.componentStructure[index],componentValue,this.valueMerger);
                    mainDc = mainDc || dataChanged;
                    this.componentStructure[index] = mergedValue;
                    (this.data as any[])[index] = isDbsComponent(mergedValue) ? mergedValue.data : mergedValue;
                }
                else {
                    (this.data as any[])[index] = value;
                    this.componentStructure[index] = componentValue;
                    mainDc = true;
                }
                if(timestamp !== undefined && DbUtils.isNewerTimestamp(this.timestamps[index],timestamp)){
                    this.timestamps[index] = timestamp;
                }
            });
            return {mergedValue: this,dataChanged: mainDc};
        }
        return {mergedValue: newValue,dataChanged: true};
    }

    /**
     * Insert process.
     * @return if the action was fully executed. (Data changed)
     * @param key
     * @param value
     * @param args
     * @param mt
     * @private
     */
    _insert(key: string, value: any, args: InsertProcessArgs, mt: ModifyToken): void
    {
        const {timestamp,if: ifOption,potentialUpdate} = args;

        let index = parseInt(key);
        if(isNaN(index)){
            index = this.componentStructure.length;
        }

        if(this.hasIndex(index)) {
            if(potentialUpdate){
                mt.potential = true;
                this._update(key,value,args,mt);
                mt.potential = false;
            }
            return;
        }

        if(ifOption !== undefined && !(args.if = this.checkIfConditions(ifOption))) return;

        if (DbUtils.checkTimestamp(this.getTimestamp(index),timestamp)) {
            const parsed = DbDataParser.parse(value);
            this.componentStructure[index] = parsed;
            (this.data as any[])[index] = isDbsComponent(parsed) ? parsed.data : parsed;
            this.timestamps[index] = timestamp;
            mt.level = ModifyLevel.DATA_CHANGED;
        }
    }

    /**
     * Update process.
     * @return the modify level.
     * @param key
     * @param value
     * @param args
     * @param mt
     * @private
     */
    _update(key: string, value: any, args: UpdateProcessArgs, mt: ModifyToken): void
    {
        const {timestamp,if: ifOption,potentialInsert} = args;

        const index = parseInt(key);

        if(!this.hasIndex(index)) {
            if(potentialInsert){
                mt.potential = true;
                this._insert(key,value,args,mt);
                mt.potential = false;
            }
            return;
        }

        if(ifOption !== undefined && !(args.if = this.checkIfConditions(ifOption))) return;

        if (DbUtils.checkTimestamp(this.getTimestamp(index),timestamp)) {
            mt.level = ModifyLevel.DATA_TOUCHED;
            const parsed = DbDataParser.parse(value);
            this.componentStructure[index] = parsed;
            const newData = isDbsComponent(parsed) ? parsed.data : parsed;
            if(mt.checkDataChange && !deepEqual(newData,this.data[index])){
                mt.level = ModifyLevel.DATA_CHANGED;
            }
            (this.data as any[])[index] = newData;
            this.timestamps[index] = timestamp;
        }
    }

    /**
     * Delete process.
     * @return if the action was fully executed. (Data changed)
     * @param key
     * @param args
     * @param mt
     * @private
     */
    _delete(key: string, args: DeleteProcessArgs, mt: ModifyToken): void {
        let index = parseInt(key);
        if(isNaN(index)){
            index = this.componentStructure.length-1;
            if(index < 0){return;}
        }

        if(!this.hasIndex(index)) return;

        const {timestamp,if: ifOption} = args;

        if(ifOption !== undefined && !(args.if = this.checkIfConditions(ifOption))) return;

        if (DbUtils.checkTimestamp(this.getTimestamp(index),timestamp)) {
            (this.data as any[]).splice(index, 1);
            this.componentStructure.splice(index, 1);
            this.timestamps.splice(index, 1);
            mt.level = ModifyLevel.DATA_CHANGED;
        }
    }

    /**
     * For each pair in this dbsArray.
     * @param func
     */
    forEachPair(func: (index: number,value: any,componentValue: any,timestamp: number | undefined) => void): void {
        for(let i = 0; i < this.componentStructure.length; i++){
            func(i,this.data[i],this.componentStructure[i],this.timestamps[i]);
        }
    }
}