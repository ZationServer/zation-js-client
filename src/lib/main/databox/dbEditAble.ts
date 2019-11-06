/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {
    DbProcessedSelector,
    IfOption,
    InfoOption, PotentialInsertOption,
    PotentialUpdateOption,
    TimestampOption
} from "./dbDefinitions";

export interface DbEditAble {
    _insert(selector : DbProcessedSelector, value : any, options : IfOption & PotentialUpdateOption & InfoOption & TimestampOption) : any;
    _update(selector : DbProcessedSelector, value : any, options : IfOption & PotentialInsertOption & InfoOption & TimestampOption) : any;
    _delete(selector : DbProcessedSelector, options : IfOption & InfoOption & TimestampOption) : any;
}