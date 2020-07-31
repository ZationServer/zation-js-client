/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import DbsComponent, {
    DbsComponentType,
    isDbsComponent,
    isDbsObject,
    MergeResult,
    ModifyLevel} from "./dbsComponent";
import DbDataParser                                    from "../dbDataParser";
import DbUtils                                         from "../../dbUtils";
import DbsSimplePathCoordinator                        from "./dbsSimplePathCoordinator";
import {dbsMerger, DbsValueMerger, defaultValueMerger} from "../dbsMergerUtils";
import {DbsComparator}                                 from "../dbsComparator";
import {deepEqual}                                     from "../../../utils/deepEqual";
import {ModifyToken}                                   from "./modifyToken";
import {
    DeleteProcessArgs,
    InsertProcessArgs,
    UpdateProcessArgs}                                 from "../../dbDefinitions";
import {ImmutableJson}                                 from "../../../utils/typeUtils";

export default class DbsObject extends DbsSimplePathCoordinator implements DbsComponent {

    public readonly data: ImmutableJson;
    private readonly componentStructure: Record<string,any>;
    private readonly keys: Set<string>;
    private readonly timestampMap: Map<string,number> = new Map<string, number>();
    private valueMerger: DbsValueMerger = defaultValueMerger;

    constructor(rawData: Record<string,any>) {
        super();

        this.keys = new Set<string>(Object.keys(rawData));
        this.data = {};
        this.componentStructure = {};

        let parsed;
        for (let key of this.keys.values()) {
            parsed = DbDataParser.parse(rawData[key]);
            this.componentStructure[key] = parsed;
            (this.data as any)[key] = isDbsComponent(parsed) ? parsed.data : parsed;
        }
    }

    get dbsComponent(){return true;}
    get dbsComponentType(){return DbsComponentType.dbsObject}

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
        for(let key of this.keys.values()){
            value = this.componentStructure[key];
            if(isDbsComponent(value)){
                value.forEachComp(func);
            }
        }
    }

    /**
     * Returns the time on this key or if
     * it does not exist a 0.
     * @param key
     */
    private getTimestamp(key: string): number {
        const timestamp = this.timestampMap.get(key);
        return timestamp !== undefined ? timestamp: 0;
    }

    /**
     * Returns if the key exists.
     * @param key
     */
    private hasKey(key: string): boolean {
        return key in this.componentStructure;
    }

    /**
     * Returns all keys.
     * @private
     */
    _getAllKeys(): string[] {
        return Array.from(this.keys);
    }

    /**
     * Returns the data value of the key.
     * @param key
     * @private
     */
    _getValue(key: string): any {
        return (this.data as any)[key];
    }

    /**
     * Returns the dbs component on this
     * key or undefined if it not exists.
     * @param key
     */
    _getDbsComponent(key: string): DbsComponent | undefined {
        const component = this.componentStructure[key];
        return isDbsComponent(component) ? component: undefined;
    }

    /**
     * Returns a copy of the data.
     */
    getDataClone(): Record<string,any> {
        const data = {};
        let value;
        for(let key of this.keys.values()){
            value = this.componentStructure[key];
            data[key] = isDbsComponent(value) ? value.getDataClone() : value;
        }
        return data;
    }

    /**
     * Merge this dbs component with the new component.
     * @param newValue
     */
    mergeWithNew(newValue: any): MergeResult {
        if(isDbsObject(newValue)){
            let mainDc: boolean = false;
            newValue.forEachPair((key, value, componentValue, timestamp) => {
                if(this.hasKey(key)){
                    const {mergedValue,dataChanged} = dbsMerger(this.componentStructure[key],componentValue,this.valueMerger);
                    mainDc = mainDc || dataChanged;
                    this.componentStructure[key] = mergedValue;
                    (this.data as any)[key] = isDbsComponent(mergedValue) ? mergedValue.data : mergedValue;
                }
                else {
                    (this.data as any)[key] = value;
                    this.componentStructure[key] = componentValue;
                    mainDc = true;
                }
                this.keys.add(key);
                if(timestamp !== undefined && DbUtils.isNewerTimestamp(this.timestampMap.get(key),timestamp)){
                    this.timestampMap.set(key,timestamp);
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

        if(this.hasKey(key)){
            if(potentialUpdate){
                mt.potential = true;
                this._update(key,value,args,mt);
                mt.potential = false;
            }
            return;
        }

        if(ifOption !== undefined && !(args.if = this.checkIfConditions(ifOption))) return;

        if (DbUtils.checkTimestamp(this.getTimestamp(key),timestamp)) {
            const parsed = DbDataParser.parse(value);
            this.componentStructure[key] = parsed;
            (this.data as any)[key] = isDbsComponent(parsed) ? parsed.data : parsed;

            this.keys.add(key);
            this.timestampMap.set(key,timestamp);

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

        if(!this.hasKey(key)) {
            if(potentialInsert){
                mt.potential = true;
                this._insert(key,value,args,mt);
                mt.potential = false;
            }
            return;
        }

        if(ifOption !== undefined && !(args.if = this.checkIfConditions(ifOption))) return;

        if (DbUtils.checkTimestamp(this.getTimestamp(key),timestamp)) {
            mt.level = ModifyLevel.DATA_TOUCHED;
            const parsed = DbDataParser.parse(value);
            const newData = isDbsComponent(parsed) ? parsed.data : parsed;
            if(mt.checkDataChange && !deepEqual(newData,(this.data as any)[key])){
                mt.level = ModifyLevel.DATA_CHANGED;
            }
            this.componentStructure[key] = parsed;
            (this.data as any)[key] = newData;

            this.timestampMap.set(key,timestamp);
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
        if(!this.hasKey(key)) return;

        const {timestamp,if: ifOption} = args;

        if(ifOption !== undefined && !(args.if = this.checkIfConditions(ifOption))) return;

        if (DbUtils.checkTimestamp(this.getTimestamp(key),timestamp)) {
            delete (this.data as any)[key];
            delete this.componentStructure[key];
            this.keys.delete(key);
            this.timestampMap.set(key,timestamp);
            mt.level = ModifyLevel.DATA_CHANGED;
        }
    }

    /**
     * For each pair in this dbsObject.
     * @param func
     */
    forEachPair(func: (key: string,value: any,componentValue: any,timestamp: number | undefined) => void): void {
        for(let key of this.keys.values()){
            func(key,(this.data as any)[key],this.componentStructure[key],this.timestampMap.get(key));
        }
    }
}