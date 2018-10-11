/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {OrBuilder} from "../statementBuilder/orBuilder";
import {PairOrAndBuilder} from "../statementBuilder/pairOrAndBuilder";
import {ReactionOnError} from "../reaction/reactionHandler";
import ResponseReactAble = require("../responseReactionEngine/responseReactAble");
import {ErrorFilter} from "../../filter/errorFilter";
import {PresetErrorFilter} from "./presetErrorFilter";

export abstract class AbstractErrorFilterBuilder<T extends ResponseReactAble>
{
    protected readonly main : T;

    private filter : ErrorFilter[] = [];
    private tmpFilter : ErrorFilter = {};

    protected constructor(main : T)
    {
        this.main = main;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Filter errors with the same error name.
     * More names are linked with OR.
     * @param name
     */
    nameIs(...name : string[]) : AbstractErrorFilterBuilder<T>
    {
        if(!Array.isArray(this.tmpFilter.name)) {
            this.tmpFilter.name = [];
        }
        this.tmpFilter.name.push(...name);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Reset the filter property name.
     * Than all names are allowed.
     */
    resetName() {
        delete this.tmpFilter.name;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Filter errors with the same type.
     * More types are linked with OR.
     * @param type
     */
    typeIs(...type : string[]) : AbstractErrorFilterBuilder<T>
    {
        if(!Array.isArray(this.tmpFilter.type)) {
            this.tmpFilter.type = [];
        }
        this.tmpFilter.type.push(...type);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Reset the filter property type.
     * Than all types are allowed.
     */
    resetType(){
        delete this.tmpFilter.type;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Filter errors with the info.
     * More infos are linked with OR.
     * @param obj
     */
    infoIs(...obj : object[]) : AbstractErrorFilterBuilder<T>
    {
        if(!Array.isArray(this.tmpFilter.info)) {
            this.tmpFilter.info = [];
        }
        // @ts-ignore
        this.tmpFilter.info.push(...obj);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Reset the filter property info.
     * Than all infos are allowed.
     */
    resetInfo(){
        delete this.tmpFilter.info;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns an easy builder for the filter property info.
     * Notice that the infos will be added to the tmpFilter with OR.
     */
    infoIsBuilder() : PairOrAndBuilder<AbstractErrorFilterBuilder<T>>
    {
        if(!Array.isArray(this.tmpFilter.info)) {
            this.tmpFilter.info = [];
        }
        return new PairOrAndBuilder<AbstractErrorFilterBuilder<T>>
        (
            this,
            (res : object[]) => {
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
    infoKeys(...keys : string[]) : AbstractErrorFilterBuilder<T>
    {
        if(!Array.isArray(this.tmpFilter.infoKey)) {
            this.tmpFilter.infoKey = [];
        }
        this.tmpFilter.infoKey.push(keys);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Reset the filter property infoKey.
     * Than all info keys are allowed.
     */
    resetInfoKeys(){
        delete this.tmpFilter.infoKey;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns an easy builder for the filter property infoKey.
     * Notice that the info keys will be added to the tmpFilter with OR.
     */
    infoKeysBuilder() : OrBuilder<AbstractErrorFilterBuilder<T>,string>
    {
        this.tmpFilter.infoKey = [];
        return new OrBuilder<AbstractErrorFilterBuilder<T>,string>
        (
            this,
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
    infoValues(...values : string[]) : AbstractErrorFilterBuilder<T>
    {
        if(!Array.isArray(this.tmpFilter.infoValue)) {
            this.tmpFilter.infoValue = [];
        }
        this.tmpFilter.infoValue.push(values);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Reset the filter property infoValue.
     * Than all info values are allowed.
     */
    resetInfoValues(){
        delete this.tmpFilter.infoValue;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns an easy builder for the filter property infoValue.
     * Notice that the info values will be added to the tmpFilter with OR.
     */
    infoValuesBuilder() : OrBuilder<AbstractErrorFilterBuilder<T>,string>
    {
        this.tmpFilter.infoValue = [];
        return new OrBuilder<AbstractErrorFilterBuilder<T>,string>
        (
            this,
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
    fromZationSystem(fromZationSystem : boolean | undefined) : AbstractErrorFilterBuilder<T>
    {
        this.tmpFilter.fromZationSystem = fromZationSystem;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Add the reactions that are triggered when the filters
     * have filtered at least one error.
     * @param reactions
     * You also can add more than one reaction.
     */
    react(...reactions : ReactionOnError[]) : T
    {
        //save last tmp
        this._pushTmpFilter();
        this._save(this._mergeReaction(reactions),this.filter);
        return this.main;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Add the filter and beginn with new one.
     * The filter are linked with OR so the filtered errors
     * of each filter are countend together.
     * If there is more than one error at the end,
     * the reaction wil be triggerd with all filtered errors.
     */
    or() : AbstractErrorFilterBuilder<T>
    {
        this._pushTmpFilter();
        //reset tmpFilter
        this.tmpFilter = {};
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Add a raw filter to the filters of this builder.
     * The filter are linked with OR so the filtered errors
     * of each filter are countend together.
     * If there is more than one error at the end,
     * the reaction wil be triggerd with all filtered errors.
     * This method is used internal.
     * @example
     * -FilterExamples-
     * For errors with the name:
     * {name : 'errorName1'}
     * For errors with the names:
     * {name : ['errorName1','errorName2']}
     * For errors with the type:
     * {type : 'errorType1'}
     * For errors with the types:
     * {type : ['errorType1','errorType2']}
     * For errors with the info:
     * {info : {inputPath : 'name', inputValue : 'value'}}
     * For errors with one of the info:
     * {info : [{inputPath : 'name'},{inputPath : 'firstName'}]}
     * For errors with the info key:
     * {infoKey : 'inputPath'}
     * For errors with one of the info keys:
     * {infoKey : ['inputPath','inputValue']}
     * For errors with all of the info keys:
     * {infoKey : [['inputPath','inputValue']]}
     * For errors with the info value:
     * {infoValue : 'name'}
     * For errors with one of the info values:
     * {infoValue : ['name','firstName']}
     * For errors with all of the info values:
     * {infoValue : [['value1','value2']]}
     * For errors there from the zation system:
     * {fromZationSystem : true}
     * For errors there not from the zation system:
     * {fromZationSystem : false}
     * You can combine all of this properties.
     */
    addErrorFilter(filter : ErrorFilter) : AbstractErrorFilterBuilder<T> {
        this.filter.push(filter);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Sets the tmp filter with of this builder.
     * Notice that you override the tmpFilter
     * This method is used internal.
     * @example
     * -FilterExamples-
     * For errors with the name:
     * {name : 'errorName1'}
     * For errors with the names:
     * {name : ['errorName1','errorName2']}
     * For errors with the type:
     * {type : 'errorType1'}
     * For errors with the types:
     * {type : ['errorType1','errorType2']}
     * For errors with the info:
     * {info : {inputPath : 'name', inputValue : 'value'}}
     * For errors with one of the info:
     * {info : [{inputPath : 'name'},{inputPath : 'firstName'}]}
     * For errors with the info key:
     * {infoKey : 'inputPath'}
     * For errors with one of the info keys:
     * {infoKey : ['inputPath','inputValue']}
     * For errors with all of the info keys:
     * {infoKey : [['inputPath','inputValue']]}
     * For errors with the info value:
     * {infoValue : 'name'}
     * For errors with one of the info values:
     * {infoValue : ['name','firstName']}
     * For errors with all of the info values:
     * {infoValue : [['value1','value2']]}
     * For errors there from the zation system:
     * {fromZationSystem : true}
     * For errors there not from the zation system:
     * {fromZationSystem : false}
     * You can combine all of this properties.
     */
    setTmpFilter(filter : ErrorFilter) : AbstractErrorFilterBuilder<T> {
        this.tmpFilter = filter;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the acutally tmpFilter that you are building.
     */
    getTmpFilter() : ErrorFilter {
        return this.tmpFilter;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns an presetErrorFilter.
     * You can use it to easy filter preset errors like
     * validation or zation main errors.
     * Notice that you call
     * @param pushPreset
     * Indicates if you want to push the preset error filter directly into the filters.
     * If not you can modify it later with this builder.
     */
    presets(pushPreset : boolean = false) : PresetErrorFilter
    {
        return new PresetErrorFilter(this,pushPreset);
    }

    protected abstract _save(reaction : ReactionOnError, filter : object[]) : void;

    private _mergeReaction(reactions : ReactionOnError[]) : ReactionOnError
    {
        return (resp,filteredErrors) =>
        {
            reactions.forEach((reaction) =>
            {
                reaction(resp,filteredErrors);
            })
        }
    }

    private _pushTmpFilter() : void
    {
        this.filter.push(this.tmpFilter);
    }
}