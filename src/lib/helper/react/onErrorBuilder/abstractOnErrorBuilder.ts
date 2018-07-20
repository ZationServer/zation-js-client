/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {OrBuilder} from "../statementBuilder/orBuilder";
import {PairOrAndBuilder} from "../statementBuilder/pairOrAndBuilder";
import {ReactionOnError} from "../reactionHandler";
import ResponseReactAble = require("../responseReactAble");

export abstract class AbstractOnErrorBuilder<T extends ResponseReactAble>
{
    protected readonly main : T;

    private errorNameFilter : string[][] = [];
    private errorTypeFilter : string[][] = [];
    private errorInfoFilter : object[] = [];
    private errorInfoKeyFilter : string[][] = [];
    private errorInfoValueFilter : string[][] = [];

    protected constructor(main : T)
    {
        this.main = main;
    }

    errorNameIs(name : string) : AbstractOnErrorBuilder<T>
    {
        this.errorNameFilter.push([name]);
        return this;
    }

    hasErrorNames(...names : string[]) : OrBuilder<AbstractOnErrorBuilder<T>,string>
    {
        this.errorNameFilter.push(names);
        return new OrBuilder<AbstractOnErrorBuilder<T>,string>(this,(res) => {this.errorNameFilter.push(res)});
    }

    errorTypeIs(errorType : string) : AbstractOnErrorBuilder<T>
    {
        this.errorTypeFilter.push([errorType]);
        return this;
    }

    hasErrorTypes(...names : string[]) : OrBuilder<AbstractOnErrorBuilder<T>,string>
    {
        this.errorTypeFilter.push(names);
        return new OrBuilder<AbstractOnErrorBuilder<T>,string>(this,(res) => {this.errorTypeFilter.push(res)});
    }

    errorInfoIs(obj : object)
    {
        this.errorInfoFilter.push(obj);
    }

    hasErrorInfo(key : string, value : any) : PairOrAndBuilder<AbstractOnErrorBuilder<T>>
    {
        return new PairOrAndBuilder<AbstractOnErrorBuilder<T>>
        (
            this,
            (res : object[]) =>
            {
                res.forEach((obj : object) =>
                {
                    this.errorInfoFilter.push(obj);
                })
            },
            {[key] : value}
        );
    }

    hasErrorInfoKeys(...keys : string[]) : OrBuilder<AbstractOnErrorBuilder<T>,string>
    {
        this.errorInfoKeyFilter.push(keys);
        return new OrBuilder<AbstractOnErrorBuilder<T>,string>(this,(res) => {this.errorInfoKeyFilter.push(res)});
    }

    errorInfoKeyIs(key : string) : AbstractOnErrorBuilder<T>
    {
        this.errorInfoKeyFilter.push([key]);
        return this;
    }

    hasErrorInfoValues(...values : any[]) : OrBuilder<AbstractOnErrorBuilder<T>,string>
    {
        this.errorInfoValueFilter.push(values);
        return new OrBuilder<AbstractOnErrorBuilder<T>,string>(this,(res) => {this.errorInfoValueFilter.push(res)});
    }

    errorInfoValueIs(value: any) : AbstractOnErrorBuilder<T>
    {
        this.errorInfoValueFilter.push([value]);
        return this;
    }

    react(...reactions : ReactionOnError[]) : T
    {
        this.save(this._mergeReaction(reactions),this._buildFilter());
        return this.main;
    }

    abstract save(reaction : ReactionOnError,filter : object) : void;

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

    private _buildFilter() : object
    {
        return {
            name : this.errorNameFilter,
            type : this.errorTypeFilter,
            info : this.errorInfoFilter,
            infoKey : this.errorInfoKeyFilter,
            infoValue : this.errorInfoValueFilter
        }
    }
}