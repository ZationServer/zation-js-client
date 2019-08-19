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
     * @param rawData
     */
    static parse(rawData : any) : any | DbsComponent {
        if(typeof rawData === 'object'){
            if(Array.isArray(rawData)) {
                return new DbsArray(rawData);
            }
            else if(isRawKeyArray(rawData)) {
                return new DbsKeyArray(rawData);
            }
            else {
                return new DbsObject(rawData);
            }
        }
        else {
            return rawData;
        }
    }

}