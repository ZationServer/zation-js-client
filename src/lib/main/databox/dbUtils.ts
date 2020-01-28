/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {
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
}