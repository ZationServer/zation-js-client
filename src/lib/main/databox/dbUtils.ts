/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {DbEditAble}            from "./dbEditAble";
import {CudOperation, CudType} from "./dbDefinitions";

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

    static handleKeyPath(keyPath : string | string[]) : string[] {
        return typeof keyPath === 'string' ?
            (keyPath === '' ? [] : keyPath.split('.')) : keyPath;
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
                    target.insert(operation.k,operation.v,
                        {code : operation.c,data : operation.d,timestamp,ifContains : operation.i});
                    break;
                case CudType.update:
                    target.update(operation.k,operation.v,
                        {code : operation.c,data : operation.d,timestamp});
                    break;
                case CudType.delete:
                    target.delete(operation.k,
                        {code : operation.c,data : operation.d,timestamp});
                    break;
            }
        }
    }

}