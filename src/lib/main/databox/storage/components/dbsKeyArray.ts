/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import DbsComponent, {
    DbsComponentType,
    isDbsComponent,
    isDbsKeyArray,
    MergeResult,
    ModifyLevel} from "./dbsComponent";
import DbDataParser                                    from "../dbDataParser";
import DbUtils                                         from "../../dbUtils";
import DbsSimplePathCoordinator                        from "./dbsSimplePathCoordinator";
import {dbsMerger, DbsValueMerger, defaultValueMerger} from "../dbsMergerUtils";
import {DbsComparator}                                 from "../dbsComparator";
import {RawKeyArray}                                   from "../keyArrayUtils";
import {deepEqual}                                     from "../../../utils/deepEqual";
import {ModifyToken}                                   from "./modifyToken";
import {
    DeleteProcessArgs,
    InsertProcessArgs,
    UpdateProcessArgs}                                 from "../../dbDefinitions";

export default class DbsKeyArray extends DbsSimplePathCoordinator implements DbsComponent {

    private readonly data: any[];
    private readonly componentStructure: any[];
    private readonly keysSorted: string[];
    private readonly keyMap: Map<string,number>;
    private readonly timestampMap: Map<string,number> = new Map<string, number>();
    private valueMerger: DbsValueMerger = defaultValueMerger;
    private comparator: DbsComparator | undefined = undefined;
    private hasCompartor: boolean = false;

    constructor(rawData: RawKeyArray) {
        super();

        this.data = [];
        this.componentStructure = [];
        this.keysSorted = [];
        this.keyMap = new Map<string, number>();

        this.buildKeyArray(rawData);
    }

    /**
     * Builds the keyArray from the raw data.
     * @param raw
     */
    private buildKeyArray(raw: RawKeyArray) {
        const array = raw.___a___;
        const rawKeyKey = raw.k;
        const rawValueKey = raw.v;
        const withValue = typeof rawValueKey === 'string';

        let item;
        let itemKey;
        let tmpIndex;
        let parsed;
        let i = 0;
        for(let j = 0; j < array.length; j++){
            item = array[j];
            if(typeof item === 'object'){
                itemKey = item[rawKeyKey].toString();
                tmpIndex = this.keyMap.get(itemKey);
                if(tmpIndex === undefined){
                    tmpIndex = i;
                    this.keyMap.set(itemKey,i);
                    this.keysSorted[i] = itemKey;
                    i++;
                }

                parsed = DbDataParser.parse(withValue ? item[rawValueKey as string]: item);
                this.componentStructure[tmpIndex] = parsed;
                this.data[tmpIndex] = isDbsComponent(parsed) ? parsed.getData(): parsed;
            }
        }
    }

    get dbsComponent(){return true;}
    get dbsComponentType(){return DbsComponentType.dbsKeyArray}

    /**
     * Sorts the key array if a comparator is provided.
     * @return if the data has changed.
     */
    sort(): boolean {
        if(this.hasCompartor){
            let dataChanged = false;
            const tmpArray: {i: number,k: string,v: any}[] = [];
            for (let [k, i] of this.keyMap.entries()){
                tmpArray[i] = {i,k,v: this.data[i]};
            }
            tmpArray.sort(((a, b) => (this.comparator as DbsComparator)(a.v,b.v,a.k,b.k)));

            let wrapper: {i: number,k: string,v: any};
            let targetIndex;
            const tmpData = this.data.slice();
            this.data.length = 0;
            const tmpComponentStructure = this.componentStructure.slice();
            this.componentStructure.length = 0;
            this.keysSorted.length = 0;
            const tmpArrayLength = tmpArray.length;
            for(let i = 0; i < tmpArrayLength; i++){
                wrapper = tmpArray[i];
                dataChanged = (wrapper.i !== i) || dataChanged;
                targetIndex = wrapper.i;
                this.keyMap.set(wrapper.k,i);
                this.keysSorted[i] = wrapper.k;
                this.data[i] = tmpData[targetIndex];
                this.componentStructure[i] = tmpComponentStructure[targetIndex];
            }
            return dataChanged;
        }
        return false;
    }

    /**
     * Returns the index where the element should be sortd in.
     * Only works if comparator is not undefined.
     * Notice that it returns -1 if it needs to push at the end.
     * @param key
     * @param value
     */
    private getSortInIndex(key: string,value: any) {
        let sortInIndex = -1;
        const length = this.keysSorted.length;
        let tmpIterateKey;
        for(let i = 0; i < length; i++){
            tmpIterateKey = this.keysSorted[i];
            if((this.comparator as DbsComparator)(value,this.data[i],key,tmpIterateKey) <= 0){
                sortInIndex = i; break;
            }

        }
        return sortInIndex;
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
        if(comparator !== undefined){
            if(comparator !== this.comparator){
                this.comparator = comparator;
                this.hasCompartor = true;
                return this.sort();
            }
        }
        else {
            this.comparator = undefined;
            this.hasCompartor = false;
        }
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
        const length = this.componentStructure.length;
        for(let i = 0; i < length; i++){
            value = this.componentStructure[i];
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
        return this.keyMap.has(key);
    }

    /**
     * Returns a value with a key.
     * @param key
     * @private
     */
    private getComponentValue(key: string): any {
        const index = this.keyMap.get(key);
        return index !== undefined ?
            this.componentStructure[index]: undefined;
    }

    /**
     * Returns all keys.
     * @private
     */
    _getAllKeys(): string[] {
        return Array.from(this.keyMap.keys());
    }

    /**
     * Returns the data value of the key.
     * @param key
     * @private
     */
    _getValue(key: string): any {
        const index = this.keyMap.get(key);
        return index !== undefined ? this.data[index]: undefined;
    }

    /**
     * Returns the dbs component on this
     * key or undefined if it not exists.
     * @param key
     */
    _getDbsComponent(key: string): DbsComponent | undefined {
        const component = this.getComponentValue(key);
        return isDbsComponent(component) ? component: undefined;
    }

    /**
     * Returns a copy of the data.
     */
    getDataCopy(): Record<string,any> {
        const data: any[] = [];
        let value;
        for(let i = 0; i < this.componentStructure.length; i++){
            value = this.componentStructure[i];
            data[i] = isDbsComponent(value) ? value.getDataCopy(): value;
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
    mergeWithNew(newValue: any): MergeResult {
        if(isDbsKeyArray(newValue)){
            let mainDc: boolean = false;
            let needResort: boolean = false;
            let mergedDataValueTmp;
            newValue.forEachPair((key, value, componentValue, timestamp) => {
                const index = this.keyMap.get(key);
                if(index !== undefined){
                    const {mergedValue,dataChanged} = dbsMerger(this.componentStructure[index],componentValue,this.valueMerger);
                    mainDc = mainDc || dataChanged;
                    this.componentStructure[index] = mergedValue;
                    mergedDataValueTmp = isDbsComponent(mergedValue) ? mergedValue.getData(): mergedValue;
                    this.data[index] = mergedDataValueTmp;

                    if(dataChanged && this.hasCompartor && !needResort) { //resort?
                        needResort = this.getSortInIndex(key,mergedDataValueTmp) !== index;
                    }
                }
                else {
                    this.pushWithComponentValue(key,value,componentValue);
                    mainDc = true;
                }
                if(timestamp !== undefined && DbUtils.isNewerTimestamp(this.timestampMap.get(key),timestamp)){
                    this.timestampMap.set(key,timestamp);
                }
            });
            //value is changed when we resort.
            if(needResort) this.sort();
            return {mergedValue: this,dataChanged: mainDc};
        }
        return {mergedValue: newValue,dataChanged: true};
    }

    /**
     * Pushes new key-value pair at the end.
     * Or if a comparator function is provided,
     * it will push the item in the correct sorted position.
     * @param key
     * @param value
     */
    private push(key: string,value: any) {
        const componentValue = DbDataParser.parse(value);
        this.pushWithComponentValue
        (key,isDbsComponent(componentValue) ? componentValue.getData(): componentValue,componentValue);
    }

    /**
     * Pushes new key-value pair at the end.
     * Or if a comparator function is provided,
     * it will push the item in the correct sorted position.
     * @param key
     * @param value
     * @param componentValue
     */
    private pushWithComponentValue(key: string,value: any,componentValue: any) {
        if(this.hasCompartor){
            const sortInIndex = this.getSortInIndex(key,value);

            if(sortInIndex > -1){
                this.pushOnIndexWithComponentValue(sortInIndex,key,value,componentValue);
                return;
            }
        }
        //fallback
        this.componentStructure.push(componentValue);
        this.data.push(value);
        const index = this.componentStructure.length - 1;
        this.keysSorted[index] = key;
        this.keyMap.set(key,index);
    }

    /**
     * Pushes a new key-value pair on a specific index.
     * @param index
     * @param key
     * @param value
     * @param componentValue
     */
    private pushOnIndexWithComponentValue(index: number,key: string,value: any,componentValue: any) {
        this.componentStructure.splice(index,0,componentValue);
        this.data.splice(index,0,value);
        this.keysSorted.splice(index,0,key);

        //update keyMap
        for (let [key, i] of this.keyMap.entries()){
            if(i >= i){
                this.keyMap.set(key,++i);
            }
        }
        this.keyMap.set(key,index);
    }

    /**
     * Deletes a value from this key array.
     * @param key
     */
    private deleteValue(key: string) {
        const index = this.keyMap.get(key);
        if(index !== undefined){
            this.componentStructure.splice(index,1);
            this.data.splice(index,1);
            this.keysSorted.splice(index, 1);

            //update keyMap
            this.keyMap.delete(key);
            for (let [key, i] of this.keyMap.entries()){
                if(i > index){
                    this.keyMap.set(key,--i);
                }
            }
        }
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

        if(this.hasKey(key)) {
            if(potentialUpdate){
                mt.potential = true;
                this._update(key,value,args,mt);
                mt.potential = false;
            }
            return;
        }

        if(ifOption !== undefined && !(args.if = this.checkIfConditions(ifOption))) return;

        if (DbUtils.checkTimestamp(this.getTimestamp(key),timestamp)) {
            this.push(key,value);
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

        const index = this.keyMap.get(key);

        if(index === undefined){
            if(potentialInsert){
                mt.potential = true;
                this._insert(key,value,args,mt);
                mt.potential = true;
            }
            return;
        }

        if(ifOption !== undefined && !(args.if = this.checkIfConditions(ifOption))) return;

        if (DbUtils.checkTimestamp(this.getTimestamp(key),timestamp)) {
            mt.level = ModifyLevel.DATA_TOUCHED;
            const parsed = DbDataParser.parse(value);
            const newData = isDbsComponent(parsed) ? parsed.getData(): parsed;
            if(mt.checkDataChange && !deepEqual(newData,this.data[index as number])){
                mt.level = ModifyLevel.DATA_CHANGED;
            }
            if(this.hasCompartor){
                //sort in the correct position
                this.deleteValue(key);
                this.pushWithComponentValue(key,newData,parsed);
            }
            else {
                this.componentStructure[index as number] = parsed;
                this.data[index as number] = newData;
            }
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
            this.deleteValue(key);
            this.timestampMap.set(key,timestamp);
            mt.level = ModifyLevel.DATA_CHANGED;
        }
    }

    /**
     * For each pair in this dbsKeyArray.
     * @param func
     */
    forEachPair(func: (key: string,value: any,componentValue: any,timestamp: number | undefined) => void): void {
        const length = this.keysSorted.length;
        let tmpkey;
        for(let i = 0; i < length; i++){
            tmpkey = this.keysSorted[i];
            func(tmpkey,this.data[i],this.componentStructure[i],this.timestampMap.get(tmpkey));
        }
    }
}