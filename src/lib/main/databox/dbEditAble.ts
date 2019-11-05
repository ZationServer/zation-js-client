/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {
    DbCudProcessedSelector,
    IfOption,
    InfoOption, PotentialInsertOption,
    PotentialUpdateOption,
    TimestampOption
} from "./dbDefinitions";

export interface DbEditAble {
    _insert(selector : DbCudProcessedSelector, value : any,options : IfOption & PotentialUpdateOption & InfoOption & TimestampOption) : any;
    _update(selector : DbCudProcessedSelector, value : any,options : IfOption & PotentialInsertOption & InfoOption & TimestampOption) : any;
    _delete(selector : DbCudProcessedSelector, options : IfOption & InfoOption & TimestampOption) : any;
}