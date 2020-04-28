/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {OrBuilder}               from "../../utils/orBuilder";
import {PairOrAndBuilder}        from "../../utils/pairOrAndBuilder";
// noinspection TypeScriptPreferShortImport
import {ErrorFilter}             from "./errorFilter";
import {PresetErrorFilter}       from "./presetErrorFilter";

export abstract class AbstractErrorFilterBuilder<R extends AbstractErrorFilterBuilder<R>>
{
    protected filter: ErrorFilter[] = [];
    protected tmpFilter: ErrorFilter = {};

    protected abstract self(): R;

    protected constructor() {
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Filter errors with the same error name.
     * More names are linked with OR.
     * @param name
     */
    nameIs(...name: string[]): R
    {
        if(!Array.isArray(this.tmpFilter.name)) {
            this.tmpFilter.name = [];
        }
        this.tmpFilter.name.push(...name);
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Reset the filter property name.
     * Than all names are allowed.
     */
    resetName(): R {
        delete this.tmpFilter.name;
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Filter errors with the same type.
     * More types are linked with OR.
     * @param type
     */
    typeIs(...type: string[]): R
    {
        if(!Array.isArray(this.tmpFilter.type)) {
            this.tmpFilter.type = [];
        }
        this.tmpFilter.type.push(...type);
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Reset the filter property type.
     * Than all types are allowed.
     */
    resetType(): R {
        delete this.tmpFilter.type;
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Filter errors with as all keys and values in the info.
     * More info filters are linked with OR.
     * @param obj
     */
    infoHas(...obj: object[]): R
    {
        if(!Array.isArray(this.tmpFilter.info)) {
            this.tmpFilter.info = [];
        }
        // @ts-ignore
        this.tmpFilter.info.push(...obj);
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Reset the filter property info.
     * Than all infos are allowed.
     */
    resetInfo(): R {
        delete this.tmpFilter.info;
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns an easy builder for the filter property info.
     * Notice that the infos will be added to the tmpFilter with OR.
     */
    infoIsBuilder(): PairOrAndBuilder<R>
    {
        if(!Array.isArray(this.tmpFilter.info)) {
            this.tmpFilter.info = [];
        }
        return new PairOrAndBuilder<R>
        (
            this.self(),
            (res: object[]) => {
                if(Array.isArray(this.tmpFilter.info)) {
                    this.tmpFilter.info.push(...res);
                }
            }
        );
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Filter erros with has this info keys.
     * More keys are linked with AND.
     * Every invoke will be linked with OR.
     */
    infoKeys(...keys: string[]): R
    {
        if(!Array.isArray(this.tmpFilter.infoKey)) {
            this.tmpFilter.infoKey = [];
        }
        this.tmpFilter.infoKey.push(keys);
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Reset the filter property infoKey.
     * Than all info keys are allowed.
     */
    resetInfoKeys(): R {
        delete this.tmpFilter.infoKey;
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns an easy builder for the filter property infoKey.
     * Notice that the info keys will be added to the tmpFilter with OR.
     */
    infoKeysBuilder(): OrBuilder<R,string>
    {
        this.tmpFilter.infoKey = [];
        return new OrBuilder<R,string>
        (
            this.self(),
            (res) =>
            {
                if(Array.isArray(this.tmpFilter.infoKey)) {
                    this.tmpFilter.infoKey.push(res);
                }
            }
        );
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Filter erros with has this info values.
     * More values are linked with AND.
     * Every invoke will be linked with OR.
     */
    infoValues(...values: string[]): R
    {
        if(!Array.isArray(this.tmpFilter.infoValue)) {
            this.tmpFilter.infoValue = [];
        }
        this.tmpFilter.infoValue.push(values);
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Reset the filter property infoValue.
     * Than all info values are allowed.
     */
    resetInfoValues(): R {
        delete this.tmpFilter.infoValue;
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns an easy builder for the filter property infoValue.
     * Notice that the info values will be added to the tmpFilter with OR.
     */
    infoValuesBuilder(): OrBuilder<R,string>
    {
        this.tmpFilter.infoValue = [];
        return new OrBuilder<R,string>
        (
            this.self(),
            (res) =>
            {
                if(Array.isArray(this.tmpFilter.infoValue)) {
                    this.tmpFilter.infoValue.push(res);
                }
            }
        );
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Filters errors there from the zation system.
     * True means the error needs to be from the zation system.
     * False means the error needs to be not from the zation system.
     * Undefined means it dosent matter (like a reset).
     * Notice that the filter property fromZationSystem will be reseted when you calling this method.
     */
    fromZationSystem(fromZationSystem: boolean | undefined): R
    {
        this.tmpFilter.fromZationSystem = fromZationSystem;
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Add the filter and beginn with new one.
     * The filter are linked with OR so the filtered errors
     * of each filter are counted together.
     */
    or(): R
    {
        this._pushTmpFilter();
        //reset tmpFilter
        this.tmpFilter = {};
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @internal
     * @description
     * Add a raw filter to the filters of this builder.
     * The filter are linked with OR so the filtered errors
     * of each filter are counted together.
     * This method is used internal.
     * @example
     * -FilterExamples-
     * For errors with the name:
     * {name: 'errorName1'}
     * For errors with the names:
     * {name: ['errorName1','errorName2']}
     * For errors with the group:
     * {group: 'errorGroup1'}
     * For errors with the groups:
     * {group: ['errorGroup1','errorGroup2']}
     * For errors with the type:
     * {type: 'errorType1'}
     * For errors with the types:
     * {type: ['errorType1','errorType2']}
     * For errors with has all keys and values in the info:
     * {info: {path: 'name', value: 'value'}}
     * For errors with has at least one of all keys and values in the info:
     * {info: [{path: 'name'},{path: 'firstName'}]}
     * For errors with the info key:
     * {infoKey: 'path'}
     * For errors with at least one of the info keys:
     * {infoKey: ['path','value']}
     * For errors with all of the info keys:
     * {infoKey: [['path','value']]}
     * For errors with the info value:
     * {infoValue: 'name'}
     * For errors with at least one of the info values:
     * {infoValue: ['name','firstName']}
     * For errors with all of the info values:
     * {infoValue: [['value1','value2']]}
     * For errors there from the zation system:
     * {fromZationSystem: true}
     * For errors there not from the zation system:
     * {fromZationSystem: false}
     * You can combine all of this properties.
     */
    addErrorFilter(filter: ErrorFilter): R {
        this.filter.push(filter);
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @internal
     * @description
     * Sets the tmp filter with of this builder.
     * Notice that you override the tmpFilter
     * This method is used internal.
     * @example
     * -FilterExamples-
     * For errors with the name:
     * {name: 'errorName1'}
     * For errors with the names:
     * {name: ['errorName1','errorName2']}
     * For errors with the group:
     * {group: 'errorGroup1'}
     * For errors with the groups:
     * {group: ['errorGroup1','errorGroup2']}
     * For errors with the type:
     * {type: 'errorType1'}
     * For errors with the types:
     * {type: ['errorType1','errorType2']}
     * For errors with has all keys and values in the info:
     * {info: {path: 'name', value: 'value'}}
     * For errors with has at least one of all keys and values in the info:
     * {info: [{path: 'name'},{path: 'firstName'}]}
     * For errors with the info key:
     * {infoKey: 'path'}
     * For errors with at least one of the info keys:
     * {infoKey: ['path','value']}
     * For errors with all of the info keys:
     * {infoKey: [['path','value']]}
     * For errors with the info value:
     * {infoValue: 'name'}
     * For errors with at least one of the info values:
     * {infoValue: ['name','firstName']}
     * For errors with all of the info values:
     * {infoValue: [['value1','value2']]}
     * For errors there from the zation system:
     * {fromZationSystem: true}
     * For errors there not from the zation system:
     * {fromZationSystem: false}
     * You can combine all of this properties.
     */
    setTmpFilter(filter: ErrorFilter): R {
        this.tmpFilter = filter;
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the acutally tmpFilter that you are building.
     */
    getTmpFilter(): ErrorFilter {
        return this.tmpFilter;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns an presetErrorFilter.
     * You can use it to easy filter preset errors like
     * validation or zation main errors.
     * @param pushPreset
     * Indicates if you want to push the preset error filter directly into the filters.
     * If not you can modify it later with this builder.
     */
    presets(pushPreset: boolean = false): PresetErrorFilter<R> {
        return new PresetErrorFilter<R>(this.self(),pushPreset);
    }

    protected _pushTmpFilter(): void {
        this.filter.push(this.tmpFilter);
    }
}