/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

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

}