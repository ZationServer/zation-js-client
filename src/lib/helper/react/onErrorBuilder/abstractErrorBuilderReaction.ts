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

export abstract class AbstractErrorBuilderReaction<T extends ResponseReactAble>
{
    protected readonly main : T;

    private errorNameFilter : string[] = [];
    private errorTypeFilter : string[] = [];
    private errorInfoFilter : object[] = [];
    private errorInfoKeyFilter : string[][] = [];
    private errorInfoValueFilter : string[][] = [];
    private errorFromZationSystem : boolean | undefined = undefined;

    protected constructor(main : T)
    {
        this.main = main;
    }

    errorNameIs(name : string) : AbstractErrorBuilderReaction<T>
    {
        this.errorNameFilter = [name];
        return this;
    }

    errorNameIsOneOf(...names : string[]) : AbstractErrorBuilderReaction<T>
    {
        this.errorNameFilter = names;
        return this;
    }

    errorTypeIs(errorType : string) : AbstractErrorBuilderReaction<T>
    {
        this.errorTypeFilter = [errorType];
        return this;
    }

    errorTypeIsOneOf(...names : string[]) : AbstractErrorBuilderReaction<T>
    {
        this.errorTypeFilter = names;
        return this;
    }

    errorInfoIs(obj : object)
    {
        this.errorInfoFilter.push(obj);
    }

    hasErrorInfo(key : string, value : any) : PairOrAndBuilder<AbstractErrorBuilderReaction<T>>
    {
        return new PairOrAndBuilder<AbstractErrorBuilderReaction<T>>
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

    errorInfoKeys(...keys : string[]) : OrBuilder<AbstractErrorBuilderReaction<T>,string>
    {
        this.errorInfoKeyFilter.push(keys);
        return new OrBuilder<AbstractErrorBuilderReaction<T>,string>(this,(res) => {this.errorInfoKeyFilter.push(res)});
    }

    errorInfoKeyIs(key : string) : AbstractErrorBuilderReaction<T>
    {
        this.errorInfoKeyFilter.push([key]);
        return this;
    }

    hasErrorInfoValues(...values : any[]) : OrBuilder<AbstractErrorBuilderReaction<T>,string>
    {
        this.errorInfoValueFilter.push(values);
        return new OrBuilder<AbstractErrorBuilderReaction<T>,string>(this,(res) => {this.errorInfoValueFilter.push(res)});
    }

    errorInfoValueIs(value: any) : AbstractErrorBuilderReaction<T>
    {
        this.errorInfoValueFilter.push([value]);
        return this;
    }

    errorIsFromZationSystem() : AbstractErrorBuilderReaction<T>
    {
        this.errorFromZationSystem = true;
        return this;
    }

    errorIsNotFromZationSystem() : AbstractErrorBuilderReaction<T>
    {
        this.errorFromZationSystem = false;
        return this;
    }

    errorCanFromZationSystemOrNot() : AbstractErrorBuilderReaction<T>
    {
        this.errorFromZationSystem = undefined;
        return this;
    }

    react(...reactions : ReactionOnError[]) : T
    {
        this._save(this._mergeReaction(reactions),this._buildFilter());
        return this.main;
    }

    protected abstract _save(reaction : ReactionOnError, filter : object) : void;

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

    private _buildFilter() : ErrorFilter
    {
        return {
            name : this.errorNameFilter,
            type : this.errorTypeFilter,
            info : this.errorInfoFilter,
            infoKey : this.errorInfoKeyFilter,
            infoValue : this.errorInfoValueFilter,
            fromZationSystem : this.errorFromZationSystem
        }
    }
}