/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {DbEditAble}            from "./dbEditAble";
import {
    CudOperation,
    CudType,
    DbProcessedSelector,
    DbSelector,
    IfOptionProcessedValue,
    IfOptionValue
} from "./dbDefinitions";

export default class DbUtils {

    /**
     * Utils function to check the time stamp for cud operations.
     * @param currentTimeStamp
     * @param newTimestamp
     */
    static checkTimestamp(currentTimeStamp : number,newTimestamp : number) : boolean {
        return currentTimeStamp <= newTimestamp;
    }

    /**
     * A function that returns if the new timestamp
     * is newer than the old one.
     * @param currentTimeStamp
     * @param newTimestamp
     */
    static isNewerTimestamp(currentTimeStamp : number = 0,newTimestamp : number) : boolean {
        return newTimestamp > currentTimeStamp;
    }

    /**
     * Processes the timestamp.
     * If the timestamp is undefined it will create a new one.
     * @param timestamp
     */
    static processTimestamp(timestamp ?: number) : number {
        return timestamp === undefined ? Date.now() : timestamp;
    }

    /**
     * Processes the if option.
     * @param ifOption
     */
    static processIfOption(ifOption ?: IfOptionValue) : IfOptionProcessedValue | undefined {
        if(ifOption !== undefined && !Array.isArray(ifOption)){
            return [ifOption];
        }
        return ifOption;
    }

    static processSelector(selector : DbSelector) : DbProcessedSelector {
        if(Array.isArray(selector)) return selector.map((v) => typeof v === 'number' ? v.toString() : v);
        else if (typeof selector === 'string') return (selector === '' ? [] : selector.split('.'));
        return [typeof selector === 'number' ? selector.toString() : selector];
    }

    static buildInsert(selector : DbSelector, value : any, ifOption ?: IfOptionValue, potentialUpdate ?: boolean,
                       code ?: number | string, data ?: any) : CudOperation {
        return {
            t : CudType.insert,
            s : DbUtils.processSelector(selector),
            v : value,
            ...(ifOption !== undefined ? {i : Array.isArray(ifOption) ? ifOption : [ifOption]} : {}),
            ...(potentialUpdate !== undefined ? {p : potentialUpdate ? 1 : 0} : {}),
            ...(code !== undefined ? {c : code} : {}),
            ...(data !== undefined ? {d : data} : {})
        };
    }

    static buildUpdate(selector : DbSelector, value : any, ifOption ?: IfOptionValue, potentialInsert ?: boolean,
                       code ?: number | string, data ?: any) : CudOperation {
        return {
            t : CudType.update,
            s : DbUtils.processSelector(selector),
            v : value,
            ...(ifOption !== undefined ? {i : Array.isArray(ifOption) ? ifOption : [ifOption]} : {}),
            ...(potentialInsert !== undefined ? {p : potentialInsert ? 1 : 0} : {}),
            ...(code !== undefined ? {c : code} : {}),
            ...(data !== undefined ? {d : data} : {})
        };
    }

    static buildDelete(selector : DbSelector, ifOption ?: IfOptionValue,
                       code ?: number | string, data ?: any) : CudOperation {
        return {
            t : CudType.delete,
            s : DbUtils.processSelector(selector),
            ...(ifOption !== undefined ? {i : Array.isArray(ifOption) ? ifOption : [ifOption]} : {}),
            ...(code !== undefined ? {c : code} : {}),
            ...(data !== undefined ? {d : data} : {})
        };
    }

    /**
     * Processes the operations with a dbEditAble target.
     * It is used internally for seqEdit.
     * @param target
     * @param operations
     * @param timestamp
     */
    static processOpertions(target : DbEditAble,operations : CudOperation[],timestamp ?: number) : void {
        let operation : CudOperation;
        for(let i = 0; i < operations.length; i++){
            operation = operations[i];
            switch (operation.t) {
                case CudType.insert:
                    target._insert(operation.s,operation.v,
                        {code : operation.c,data : operation.d,timestamp,
                            if : operation.i,potentialUpdate : !!operation.p});
                    break;
                case CudType.update:
                    target._update(operation.s,operation.v,
                        {code : operation.c,data : operation.d,timestamp,
                            if : operation.i,potentialInsert : !!operation.p});
                    break;
                case CudType.delete:
                    target._delete(operation.s,
                        {code : operation.c,data : operation.d,timestamp,
                            if : operation.i});
                    break;
            }
        }
    }

}