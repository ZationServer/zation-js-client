/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import DbsComponent, {
    dbsComponentSymbol,
    isDbsComponent
} from "./dbsComponent";
import DbDataParser                                    from "../dbDataParser";
import DbUtils                                         from "../../dbUtils";
import {dbsMerger, DbsValueMerger, defaultValueMerger, MergeResult} from "../dbsMerge";
import {DbsComparator}                                 from "../dbsComparator";
import forint                                          from "forint";
import {ModifyLevel, ModifyToken}                      from "../modifyToken";
import {deepEqual}                                     from "../../../utils/deepEqual";
import {ImmutableJson, Writeable}                      from "../../../utils/typeUtils";
import {
    DbProcessedSelector,
    IfOptionProcessArgsValue,
    IfQuery,
    InsertProcessArgs,
    UpdateProcessArgs,
    DeleteProcessArgs, IfQueryType
} from "../../dbDefinitions";

export default class DbsHead implements DbsComponent {

    public readonly [dbsComponentSymbol] = true;

    public readonly data: ImmutableJson;
    private componentValue: any;
    private timestamp: number = 0;
    private valueMerger: DbsValueMerger = defaultValueMerger;

    constructor(rawData: any = undefined) {
        this.componentValue = DbDataParser.parse(rawData);

        this.data = isDbsComponent(this.componentValue) ?
            this.componentValue.data : this.componentValue;
    }

    /**
     * Returns a copy of the data.
     */
    getDataClone(): any {
        if (isDbsComponent(this.componentValue)) {
            return this.componentValue.getDataClone();
        } else {
            return this.componentValue;
        }
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
    getDbsComponents(selector: DbProcessedSelector): DbsComponent[] {
        if (selector.length === 0) {
            return isDbsComponent(this.componentValue) ? [this.componentValue]: [];
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
     * Merge this dbs component with the new component.
     * @param newValue
     */
    mergeWithNew(newValue: any): MergeResult {
        if (newValue instanceof DbsHead) {
            const newTimestamp = newValue.getTimestamp();
            const newComponentValue = newValue.getComponentValue();
            const {mergedValue: mergedValue,dataChanged} = dbsMerger(this.componentValue,newComponentValue,this.valueMerger);
            this.componentValue = mergedValue;
            (this as Writeable<DbsComponent>).data = isDbsComponent(mergedValue) ? mergedValue.data : mergedValue;

            if (DbUtils.isNewerTimestamp(this.timestamp,newTimestamp)) {
                this.timestamp = newTimestamp;
            }
            return {mergedValue: this,dataChanged: dataChanged};
        }
        return {mergedValue: newValue,dataChanged: true};
    }

    private checkIfConditions(ifOption: IfOptionProcessArgsValue): boolean {
        if(typeof ifOption === 'boolean') return ifOption;

        const data = this.data;
        const dataExists = data !== undefined;
        const queriesLength = ifOption.length;
        let tmpRes;
        let tmpQuery: IfQuery;
        let tmpKeyQuery;
        let tmpKeyQueryFunc;
        let tmpValueQuery;
        let tmpValueQueryFunc;
        for(let i = 0; i < queriesLength; i++) {
            //query
            tmpQuery = ifOption[i];
            switch (tmpQuery.t) {
                case IfQueryType.full:
                    tmpRes = forint(tmpQuery.q)(data) ? !tmpQuery.n: !!tmpQuery.n;
                    break;
                case IfQueryType.search:
                    tmpKeyQuery = tmpQuery.q.k;
                    tmpValueQuery = tmpQuery.q.v;
                    if(tmpKeyQuery || tmpValueQuery) {
                        tmpKeyQueryFunc = tmpKeyQuery ? forint(tmpKeyQuery): undefined;
                        tmpValueQueryFunc = tmpValueQuery ? forint(tmpValueQuery): undefined;
                        if ((!tmpKeyQuery || tmpKeyQueryFunc('')) && (!tmpValueQuery || tmpValueQueryFunc(data))) {
                            //query match
                            tmpRes = !tmpQuery.n;
                        }
                        else {
                            //not match
                            tmpRes = !!tmpQuery.n;
                        }
                    }
                    else {
                        //any constant
                        tmpRes = tmpQuery.n ? !dataExists: dataExists;
                    }
                    break;
                default:
                    tmpRes = false;
                    break;
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
    insert(selector: DbProcessedSelector, value: any, args: InsertProcessArgs, mt: ModifyToken): void {
        //clone args (if condition result prepare) and selector (shift) (more storages don't conflict with refernces)
        args = {...args};
        selector = [...selector];
        if (selector.length === 0) {
            this._insert(value,args,mt);
        } else if (isDbsComponent(this.componentValue)) {
            (this.componentValue as DbsComponent).insert(selector,value,args,mt);
        }
    }

    _insert(value: any,args: InsertProcessArgs,mt: ModifyToken): void {
        const {timestamp,if: ifOption,potentialUpdate} = args;

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
            (this as Writeable<DbsComponent>).data = isDbsComponent(parsed) ? parsed.data : parsed;
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
    update(selector: DbProcessedSelector, value: any, args: UpdateProcessArgs, mt: ModifyToken): void {
        //clone args (if condition result prepare) and selector (shift) (more storages don't conflict with refernces)
        args = {...args};
        selector = [...selector];
        if (selector.length === 0) {
            this._update(value,args,mt);
        } else if (isDbsComponent(this.componentValue)) {
            (this.componentValue as DbsComponent).update(selector,value,args,mt);
        }
    }

    _update(value: any, args: UpdateProcessArgs, mt: ModifyToken): void {
        const {timestamp,if: ifOption,potentialInsert} = args;

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
            const newData = isDbsComponent(parsed) ? parsed.data : parsed;
            if(mt.checkDataChange && !deepEqual(newData,this.data)){
                mt.level = ModifyLevel.DATA_CHANGED;
            }
            (this as Writeable<DbsComponent>).data = newData;
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
    delete(selector: DbProcessedSelector, args: DeleteProcessArgs, mt: ModifyToken): void {
        //clone args (if condition result prepare) and selector (shift) (more storages don't conflict with refernces)
        args = {...args};
        selector = [...selector];
        if (selector.length === 0) {
            this._delete(args,mt);
        } else if (isDbsComponent(this.componentValue)) {
            (this.componentValue as DbsComponent).delete(selector,args,mt);
        }
    }

    _delete(args: DeleteProcessArgs, mt: ModifyToken): void {
        if(this.componentValue === undefined) return;

        const {timestamp,if: ifOption} = args;

        if(ifOption !== undefined && !(args.if = this.checkIfConditions(ifOption))) return;

        if (DbUtils.checkTimestamp(this.timestamp, timestamp)) {
            this.componentValue = undefined;
            (this as Writeable<DbsComponent>).data = undefined;
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
    getTimestamp(): number {
        return this.timestamp;
    }

    /**
     * Cast a value to an instance of this class.
     * That can be useful if you are programming in javascript,
     * but the IDE can interpret the typescript information of this library.
     * @param value
     */
    static cast(value: any): DbsHead {
        return value as DbsHead;
    }
}