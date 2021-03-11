/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {ForintQuery}                         from "forint";
// noinspection TypeScriptPreferShortImport
import {BackErrorFilter}                     from "./backErrorFilter";
import {PresetBackErrorFilterSelector}       from "./presetBackErrorFilterSelector";
import {ErrorType}                           from "../definitions/errorType";
import {ErrorGroup}                          from "../definitions/errorGroup";
import {deepClone}                           from '../utils/cloneUtils';

export abstract class AbstractBackErrorFilterBuilder<R extends AbstractBackErrorFilterBuilder<R>>
{
    protected filter: BackErrorFilter[] = [];
    protected tmpFilter: BackErrorFilter & ForintQuery = {};

    protected abstract self(): R;

    protected constructor() {
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Applies a filter rule to filter errors with specific names.
     * By providing nothing, you can remove the current filter rule.
     * Notice it will overwrite the current filtering rule for the names.
     * @param names
     */
    nameIs(...names: string[]): R {
        if(names.length === 0) delete this.tmpFilter.name;
        else this.tmpFilter.name = AbstractBackErrorFilterBuilder._getOptimizedInQuery(names);
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Applies a filter rule to filter errors with specific types.
     * By providing nothing, you can remove the current filter rule.
     * Notice it will overwrite the current filtering rule for the types.
     * @param types
     */
    typeIs(...types: (string | ErrorType)[]): R {
        if(types.length === 0) delete this.tmpFilter.type;
        else this.tmpFilter.type = AbstractBackErrorFilterBuilder._getOptimizedInQuery(types);
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Applies a filter rule to filter errors with specific groups.
     * By providing nothing, you can remove the current filter rule.
     * Notice it will overwrite the current filtering rule for the groups.
     * @param groups
     */
    groupIs(...groups: (string | ErrorGroup)[]): R {
        if(groups.length === 0) delete this.tmpFilter.group;
        else this.tmpFilter.group = AbstractBackErrorFilterBuilder._getOptimizedInQuery(groups);
        return this.self();
    }

    /**
     * @description
     * Applies a filter rule to filter custom or non-custom errors.
     * By providing nothing, you can remove the current filter rule.
     * Notice it will overwrite the current filtering rule for custom.
     */
    isCustom(custom: boolean | undefined): R {
        if(custom === undefined) delete this.tmpFilter.custom;
        else this.tmpFilter.custom = custom;
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Applies a filter rule to filter errors with specific info by using a forint query.
     * By providing nothing, you can remove the current filter rule.
     * Notice it will overwrite the current filtering rule for the error info.
     */
    infoMatches(query?: ForintQuery | {path?: string,value?: any}): R {
        if(query == null) delete this.tmpFilter.info;
        else this.tmpFilter.info = query;
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Adds the current filter and starts building a new one.
     * The filters will be linked with a logical OR.
     */
    or(): R {
        this.filter.push(this.tmpFilter);
        this.tmpFilter = {};
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Sets the current filter.
     * @example
     * filter: ({name: {$in: ['name1','name2']}, info: {path: 'password'}})
     * @param filter
     */
    setFilter(filter: BackErrorFilter): R {
        this.tmpFilter = deepClone(filter);
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns a clone of the current filter that you are building.
     */
    getFilter(): BackErrorFilter {
        return deepClone(this.tmpFilter);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns an PresetBackErrorFilterSelector.
     * You can use it to select an error filter preset.
     * It contains a lot of presets for non-custom Zation BackErrors.
     * The selected preset will overwrite the current filter of the builder.
     */
    preset(): PresetBackErrorFilterSelector<R> {
        return new PresetBackErrorFilterSelector<R>(this.self(),(filter) => {
            this.setFilter(filter);
        });
    }

    private static _getOptimizedInQuery<T>(value: T[]): ForintQuery {
        return value.length === 1 ? value[0] : {$in: value};
    }

    protected buildFinalFilter(): BackErrorFilter {
        if(this.filter.length <= 0) return this.tmpFilter;
        return {$or: [this.tmpFilter,...this.filter]}
    }
}