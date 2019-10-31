/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {
    DbCudProcessedSelector,
    IfContainsOption,
    InfoOption, PotentialInsertOption,
    PotentialUpdateOption,
    TimestampOption
} from "./dbDefinitions";

export interface DbEditAble {
    _insert(selector : DbCudProcessedSelector, value : any,options : IfContainsOption & PotentialUpdateOption & InfoOption & TimestampOption) : any;
    _update(selector : DbCudProcessedSelector, value : any,options : IfContainsOption & PotentialInsertOption & InfoOption & TimestampOption) : any;
    _delete(selector : DbCudProcessedSelector, options : IfContainsOption & InfoOption & TimestampOption) : any;
}