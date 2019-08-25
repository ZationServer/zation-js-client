/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {IfContainsOption, InfoOption, TimestampOption} from "./dbDefinitions";

export interface DbEditAble {
    insert(keyPath : string[] | string, value : any,options : IfContainsOption & InfoOption & TimestampOption) : any;
    update(keyPath : string[] | string, value : any,options : InfoOption & TimestampOption) : any;
    delete(keyPath : string[] | string,options : InfoOption & TimestampOption) : any;
}