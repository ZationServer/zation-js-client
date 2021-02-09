/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import DbsComponent     from "./components/dbsComponent";
import DbsObject        from "./components/dbsObject";
import DbsArray         from "./components/dbsArray";
import {isRawKeyArray}  from "./keyArrayUtils";
import DbsKeyArray      from "./components/dbsKeyArray";

export default class DbDataParser {

    /**
     * Parses the raw data to the DbsComponent.
     * This also creates a clone because every value from type objects will be divided.
     * @param rawData
     * @param timestamp
     */
    static parse(rawData: any, timestamp: number): any | DbsComponent {
        if(typeof rawData === 'object' && rawData){
            if(Array.isArray(rawData)) {
                return new DbsArray(rawData,timestamp);
            }
            else if(isRawKeyArray(rawData)) {
                return new DbsKeyArray(rawData,timestamp);
            }
            else {
                return new DbsObject(rawData,timestamp);
            }
        }
        else {
            return rawData;
        }
    }

}