/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import DbsComponent, {
    DbsComponentType,
    isDbsComponent,
    isDbsHead,
    MergeResult,
    ModifyLevel} from "./dbsComponent";
import DbDataParser                                    from "../dbDataParser";
import DbUtils                                         from "../../dbUtils";
import {dbsMerger, DbsValueMerger, defaultValueMerger} from "../dbsMergerUtils";
import {DbsComparator}                                 from "../dbsComparator";
import forint                                          from "forint";
import {ModifyToken}                                   from "./modifyToken";
import {deepEqual}                                     from "../../../utils/deepEqual";
import {
    DbProcessedSelector,
    IfOptionProcessArgsValue,
    IfQuery,
    InsertProcessArgs,
    UpdateProcessArgs,
    DeleteProcessArgs
} from "../../dbDefinitions";

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
     * Returns the dbs component with that selector.
     * @param selector
     */
    getDbsComponents(selector : DbProcessedSelector): DbsComponent[] {
        if (selector.length === 0) {
            return isDbsComponent(this.componentValue) ? [this.componentValue] : [];
        } else if (selector.length > 0) {
            if (isDbsComponent(this.componentValue)) {
                return this.componentValue.getDbsComponents(selector);
            }
        }
        return [];
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

    private checkIfConditions(ifOption : IfOptionProcessArgsValue) : boolean {
        if(typeof ifOption === 'boolean') return ifOption;

        const data = this.data;
        const dataExists = data !== undefined;
        const queriesLength = ifOption.length;
        let tmpRes;
        let tmpQuery : IfQuery;
        let tmpKeyQuery;
        let tmpKeyQueryFunc;
        let tmpValueQuery;
        let tmpValueQueryFunc;
        for(let i = 0; i < queriesLength; i++) {
            //query
            tmpQuery = ifOption[i];
            tmpKeyQuery = tmpQuery.key;
            tmpValueQuery = tmpQuery.value;
            if(tmpKeyQuery || tmpValueQuery) {
                tmpKeyQueryFunc = tmpKeyQuery ? forint(tmpKeyQuery) : undefined;
                tmpValueQueryFunc = tmpValueQuery ? forint(tmpValueQuery) : undefined;
                if ((!tmpKeyQuery || tmpKeyQueryFunc('')) && (!tmpValueQuery || tmpValueQueryFunc(data))) {
                    //query match
                    tmpRes = !tmpQuery.not;
                }
                else {
                    //not match
                    tmpRes = !!tmpQuery.not;
                }
            }
            else {
                //any constant
                tmpRes = tmpQuery.not ? !dataExists : dataExists;
            }
            if (!tmpRes) return false;
        }
        return true;
    }

    /**
     * Insert coordinator.
     * @return the modify level.
     * @param selector
     * @param value
     * @param args
     * @param mt
     */
    insert(selector : DbProcessedSelector, value: any, args : InsertProcessArgs, mt : ModifyToken): void {
        if (selector.length === 0) {
            this._insert(value,args,mt);
        } else if (isDbsComponent(this.componentValue)) {
            (this.componentValue as DbsComponent).insert(selector,value,args,mt);
        }
    }

    _insert(value: any,args : InsertProcessArgs,mt : ModifyToken): void {
        const {timestamp,if : ifOption,potentialUpdate} = args;

        if(this.componentValue !== undefined){
            if(potentialUpdate){
                mt.potential = true;
                this._update(value,args,mt);
                mt.potential = false;
            }
            return;
        }

        if(ifOption !== undefined && !(args.if = this.checkIfConditions(ifOption))) return;

        if (DbUtils.checkTimestamp(this.timestamp,timestamp)) {
            const parsed = DbDataParser.parse(value);
            this.componentValue = parsed;
            this.data = isDbsComponent(parsed) ? parsed.getData() : parsed;
            this.timestamp = timestamp;
            mt.level = ModifyLevel.DATA_CHANGED;
        }
    }

    /**
     * Update coordinator.
     * @return the modify level.
     * @param selector
     * @param value
     * @param args
     * @param mt
     */
    update(selector : DbProcessedSelector, value : any, args : UpdateProcessArgs, mt : ModifyToken): void {
        if (selector.length === 0) {
            this._update(value,args,mt);
        } else if (isDbsComponent(this.componentValue)) {
            (this.componentValue as DbsComponent).update(selector,value,args,mt);
        }
    }

    _update(value : any, args : UpdateProcessArgs, mt : ModifyToken): void {
        const {timestamp,if : ifOption,potentialInsert} = args;

        if(this.componentValue === undefined){
            if(potentialInsert){
                mt.potential = true;
                this._insert(value,args,mt);
                mt.potential = false;
            }
            return;
        }

        if(ifOption !== undefined && !(args.if = this.checkIfConditions(ifOption))) return;

        if (DbUtils.checkTimestamp(this.timestamp, timestamp)) {
            mt.level = ModifyLevel.DATA_TOUCHED;
            const parsed = DbDataParser.parse(value);
            this.componentValue = parsed;
            const newData = isDbsComponent(parsed) ? parsed.getData() : parsed;
            if(mt.checkDataChange && !deepEqual(newData,this.data)){
                mt.level = ModifyLevel.DATA_CHANGED;
            }
            this.data = newData;
            this.timestamp = timestamp;
        }
    }

    /**
     * Delete coordinator.
     * @return the modify level.
     * @param selector
     * @param args
     * @param mt
     */
    delete(selector : DbProcessedSelector, args : DeleteProcessArgs, mt : ModifyToken): void {
        if (selector.length === 0) {
            this._delete(args,mt);
        } else if (isDbsComponent(this.componentValue)) {
            (this.componentValue as DbsComponent).delete(selector,args,mt);
        }
    }

    _delete(args : DeleteProcessArgs, mt : ModifyToken): void {
        if(this.componentValue === undefined) return;

        const {timestamp,if : ifOption} = args;

        if(ifOption !== undefined && !(args.if = this.checkIfConditions(ifOption))) return;

        if (DbUtils.checkTimestamp(this.timestamp, timestamp)) {
            this.componentValue = undefined;
            this.data = undefined;
            this.timestamp = timestamp;
            mt.level = ModifyLevel.DATA_CHANGED;
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