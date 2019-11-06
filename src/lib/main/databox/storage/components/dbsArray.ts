/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import DbsComponent, {
    DbsComponentType,
    isDbsArray,
    isDbsComponent,
    MergeResult,
    ModifyLevel
} from "./dbsComponent";
import DbDataParser                                    from "../dbDataParser";
import DbUtils                                         from "../../dbUtils";
import DbsSimplePathCoordinator                        from "./dbsSimplePathCoordinator";
import {dbsMerger, DbsValueMerger, defaultValueMerger} from "../dbsMergerUtils";
import {DbsComparator}                                 from "../dbsComparator";
import {deepEqual}                                     from "../../../utils/deepEqual";
import {
    DeleteProcessArgs,
    InsertProcessArgs,
    UpdateProcessArgs}                                 from "../../dbDefinitions";
import {ModifyToken}                                   from "./modifyToken";

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
            parsed = DbDataParser.parse(rawData[i]);
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
     * @return if the data has changed.
     * @param comparator
     */
    setComparator(comparator : DbsComparator | undefined) : boolean {
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
     * Returns all keys.
     * @private
     */
    _getAllKeys(): string[] {
        const keys : string[] = [];
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
    meregeWithNew(newValue: any) : MergeResult {
        if(isDbsArray(newValue)){
            let mainDc : boolean = false;
            newValue.forEachPair((index, value, componentValue, timestamp) => {
                if(this.hasIndex(index)){
                    const {mergedValue,dataChanged} = dbsMerger(this.componentStructure[index],componentValue,this.valueMerger);
                    mainDc = mainDc || dataChanged;
                    this.componentStructure[index] = mergedValue;
                    this.data[index] = isDbsComponent(mergedValue) ? mergedValue.getData() : mergedValue;
                }
                else {
                    this.data[index] = value;
                    this.componentStructure[index] = componentValue;
                    mainDc = true;
                }
                if(timestamp !== undefined && DbUtils.isNewerTimestamp(this.timestamps[index],timestamp)){
                    this.timestamps[index] = timestamp;
                }
            });
            return {mergedValue : this,dataChanged : mainDc};
        }
        return {mergedValue : newValue,dataChanged : true};
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
    _insert(key: string, value: any, args : InsertProcessArgs, mt : ModifyToken): void
    {
        const {timestamp,if : ifOption,potentialUpdate} = args;

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
            this.data[index] = isDbsComponent(parsed) ? parsed.getData() : parsed;
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
    _update(key: string, value: any, args : UpdateProcessArgs, mt : ModifyToken): void
    {
        const {timestamp,if : ifOption,potentialInsert} = args;

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
            const newData = isDbsComponent(parsed) ? parsed.getData() : parsed;
            if(mt.checkDataChange && !deepEqual(newData,this.data[index])){
                mt.level = ModifyLevel.DATA_CHANGED;
            }
            this.data[index] = newData;
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
    _delete(key: string, args : DeleteProcessArgs, mt : ModifyToken): void {
        let index = parseInt(key);
        if(isNaN(index)){
            index = this.componentStructure.length-1;
            if(index < 0){return;}
        }

        if(!this.hasIndex(index)) return;

        const {timestamp,if : ifOption} = args;

        if(ifOption !== undefined && !(args.if = this.checkIfConditions(ifOption))) return;

        if (DbUtils.checkTimestamp(this.getTimestamp(index),timestamp)) {
            this.data.splice(index, 1);
            this.componentStructure.splice(index, 1);
            this.timestamps.splice(index, 1);
            mt.level = ModifyLevel.DATA_CHANGED;
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