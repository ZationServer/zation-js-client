/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {BackError}        from "./backError";
import {BackErrorFilter}  from './backErrorFilter';
import forint             from 'forint';

export function filterBackErrors(errors: BackError[], filter?: BackErrorFilter): BackError[] {
    return filter === undefined ? errors : errors.filter(forint<BackErrorFilter>(filter));
}