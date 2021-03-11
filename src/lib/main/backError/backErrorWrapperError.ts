/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {BackError}             from "./backError";
import {BackErrorFilter}       from "./backErrorFilter";
import {filterBackErrors}      from './errorFilterEngine';

export class BackErrorWrapperError extends Error
{
    readonly rawError: Error;
    readonly backErrors: BackError[] = [];

    constructor(message: string,rawError: Error)
    {
        super(message);
        this.rawError = rawError;
        const rawBackErrors = rawError['backErrors'];
        if (Array.isArray(rawBackErrors)) {
            let tmpRawBackError;
            for(let i = 0; i < rawBackErrors.length; i++) {
                tmpRawBackError = rawBackErrors[i];
                if(typeof tmpRawBackError === 'object') this.backErrors.push(new BackError(tmpRawBackError));
            }
        }
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * The raw error code.
     */
    get code(): any {
        return this.rawError['code'];
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * The raw error name.
     */
    get name(): string {
        return this.rawError.name;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Filter the BackErrors by using a forint query.
     * @example
     * filter: ({name: {$in: ['name1','name2']}, info: {path: 'password'}})
     * @param filter
     */
    filterBackErrors(filter: BackErrorFilter): BackError[] {
        return filterBackErrors(this.backErrors,filter);
    }
}


