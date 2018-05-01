/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

const Respond = require('./../helper/respond/respond');
const Result  = require('./result');
const Box     = require('./../helper/box/box');
const Filter  = require('./../helper/filter/filter');

class ResultRespond extends Respond
{
    constructor(json)
    {
        super();

        //Reactions
        this._onErrorReactionBox      = new Box(ResultRespond._checkOnReactionValid);
        this._onSuccesfulReactionBox  = new Box(ResultRespond._checkOnReactionValid);
        this._onBothReactionBox       = new Box(ResultRespond._checkOnReactionValid);

        if(json !== undefined)
        {
            this.addReactions(json);
        }
    }

    static _checkOnReactionValid(config)
    {
        return config['reaction'] !== undefined;
    }

    addReactions(json)
    {
        if(json['onError'] !== undefined)
        {
            Respond._addJsonReactions(this._onErrorReactionBox,json['onError']);
        }
        if(json['onSuccessful'] !== undefined)
        {
            Respond._addJsonReactions(this._onErrorReactionBox,json['onSuccessful']);
        }
        if(json['onBoth'] !== undefined)
        {
            Respond._addJsonReactions(this._onErrorReactionBox,json['onBoth']);
        }
    }

    _trigger(result)
    {
        if (this._active && result instanceof Result)
        {

            this._onBothReactionBox.forEach((reaction) => {ResultRespond._triggerReaction(reaction,result);});

            if (result.isSuccessful())
            {
                ResultRespond._triggerOnSuccessfulReactions(this._onSuccesfulReactionBox,result);
            }
            else
            {
                ResultRespond._triggerOnErrorReactions(this._onErrorReactionBox,result);
            }
        }
    }

    static _triggerOnSuccessfulReactions(box,result)
    {
        box.forEach((reaction) => {

            if(ResultRespond._filterForSuccessfulReaction(reaction,result))
            {
                ResultRespond._triggerReaction(reaction,result);
            }
        });
    }

    static _triggerOnErrorReactions(box,result)
    {
        box.forEach((reaction) => {

            let res = ResultRespond._filterForErrorReaction(reaction,result);
            if(res.length > 0)
            {
                ResultRespond._triggerReaction(reaction,result,res,true);
            }

        });
    }

    static _triggerReaction(reaction,res,res2,onError = false)
    {
        let reactionObj = reaction.reaction;
        if (typeof reactionObj === "function")
        {
            reactionObj(res,res2);
        }
        else if(reactionObj instanceof ResultRespond)
        {
            if(onError)
            {
                reactionObj._trigger(ResultRespond._getFilteredResult(res2));
            }
            else
            {
                reactionObj._trigger(res);
            }
        }
    }

    static _getFilteredResult(filterErr)
    {
        let data = {};
        data.s = false;
        data.e = filterErr;
        return new Result(data);
    }

    static _filterForSuccessfulReaction(reaction, result)
    {
        let resultData = {};
        resultData.v = result.getValueResults();
        resultData.kv = result.getKeyValuePairResults();
        resultData = [resultData];

        let filter = reaction.filter;

        if (filter !== undefined)
        {

            if (filter['pair'] !== undefined || filter['pairs'] !== undefined)
            {
                let input = filter['pair'] !== undefined ? filter['pair'] : filter['pairs'];
                let res = Filter._getWithOneOrMultiOr(resultData,input,'kv',Filter._filterAllParamsSame);

                if(res.length === 0) {return false;}
            }

            if (filter['pairKey'] !== undefined || filter['pairKeys'] !== undefined)
            {
                let input = filter['pairKey'] !== undefined ? filter['pairKey'] : filter['pairKeys'];
                let res = Filter._getWithOneOrMultiOr(resultData, input, 'kv',Filter._filterOneOrMultiAndKey);

                if(res.length === 0) {return false;}
            }

            if (filter['pairValue'] !== undefined || filter['pairValues'] !== undefined)
            {
                let input = filter['pairValue'] !== undefined ? filter['pairValue'] : filter['pairValues'];
                let res = Filter._getWithOneOrMultiOr(resultData, input, 'kv',Filter._filterOneOrMultiAndValue);

                if(res.length === 0) {return false;}
            }

            if (filter['value'] !== undefined || filter['values'] !== undefined)
            {
                let input = filter['value'] !== undefined ? filter['value'] : filter['values'];
                let res = Filter._getWithOneOrMultiOr(resultData, input, 'v',Filter._filterOneOrMultiAndArray);

                if(res.length === 0) {return false;}
            }

        }

        return true;
    }

    static _filterForErrorReaction(reaction, result)
    {
        let filterObj = result.getErrors();
        let filter = reaction.filter;

        if (filter !== undefined) {

            if (filter['name'] !== undefined || filter['names'] !== undefined)
            {
                let input = filter['name'] !== undefined ? filter['name'] : filter['names'];
                filterObj = Filter._getWithOneOrMultiOr(filterObj, input, 'n');
            }

            if (filter['type'] !== undefined || filter['types'] !== undefined)
            {
                let input = filter['type'] !== undefined ? filter['type'] : filter['types'];
                filterObj = Filter._getWithOneOrMultiOr(filterObj, input, 't');
            }

            if (filter['info'] !== undefined)
            {
                filterObj = Filter._getWithOneOrMultiOr(filterObj,filter['info'],'i',Filter._filterAllParamsSame);
            }

            if (filter['infoKey'] !== undefined || filter['infoKeys'] !== undefined)
            {
                let input = filter['infoKey'] !== undefined ? filter['infoKey'] : filter['infoKeys'];
                filterObj = Filter._getWithOneOrMultiOr(filterObj, input, 'i',Filter._filterOneOrMultiAndKey);
            }

            if (filter['infoValue'] !== undefined || filter['infoValues'] !== undefined)
            {
                let input = filter['infoValue'] !== undefined ? filter['infoValue'] : filter['infoValues'];
                filterObj = Filter._getWithOneOrMultiOr(filterObj, input, 'i',Filter._filterOneOrMultiAndValue);
            }
        }
        return filterObj;
    }

    // noinspection JSUnusedGlobalSymbols
    onError(reaction, filter, key, overwrite = true)
    {
        return ResultRespond._addReaction(reaction, filter, key, overwrite, this._onErrorReactionBox);
    }

    // noinspection JSUnusedGlobalSymbols
    removeOnError(key)
    {
        return this._onBothReactionBox.removeItem(key);
    }

    // noinspection JSUnusedGlobalSymbols
    onBoth(reaction, key, overwrite = true)
    {
        return ResultRespond._addReaction(reaction, undefined, key, overwrite, this._onBothReactionBox);
    }

    // noinspection JSUnusedGlobalSymbols
    removeOnBoth(key)
    {
        return this._onBothReactionBox.removeItem(key);
    }

    // noinspection JSUnusedGlobalSymbols
    onSuccessful(reaction, filter, key, overwrite = true)
    {
        return ResultRespond._addReaction(reaction, filter, key, overwrite, this._onSuccesfulReactionBox);
    }

    // noinspection JSUnusedGlobalSymbols
    removeOnSuccessful(key)
    {
        return this._onSuccesfulReactionBox.removeItem(key);
    }

    // noinspection JSUnusedGlobalSymbols
    removeFromAll(key)
    {
        this._onBothReactionBox.removeItem(key);
        this._onSuccesfulReactionBox.removeItem(key);
        this._onErrorReactionBox.removeItem(key);
    }


    static _addReaction(reaction, filter, key, overwrite, box)
    {
        let storageReaction = {reaction: reaction, filter: filter};
        return box.addItem(storageReaction,key,overwrite);
    }
}

module.exports = ResultRespond;