/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

class FilterEngine
{
    static _getWithOneOrMultiOr(array, input, prop, filter = Filter._filterEquals)
    {
        let res = [];
        if(Array.isArray(input))
        {
            res = Filter._getWhoHasOneOf(array,input,prop,filter);
        }
        else
        {
            res = Filter._getWhoHas(array,input,prop,filter);
        }
        return res;
    }

    static _getWhoHas(array, value, prop, filter = Filter._filterEquals)
    {
        let filterObj = [];
        for (let i = 0; i < array.length; i++) {
            if (filter(array[i][prop], value)) {
                filterObj.push(array[i]);
            }
        }
        return filterObj;
    }

    static _getWhoHasOneOf(array, values, prop, filter = Filter._filterEquals)
    {
        let filterObj = [];
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < values.length; j++) {
                if (filter(array[i][prop], values[j])) {
                    filterObj.push(array[i]);
                    break;
                }
            }
        }
        return filterObj;
    }

    // noinspection JSUnusedGlobalSymbols
    static _getWhoHasAllOf(array, values, prop, filter = Filter._filterEquals)
    {
        let filterObj = [];
        for (let i = 0; i < array.length; i++) {
            let allFound = true;
            for (let j = 0; j < values.length; j++) {
                if (!filter(array[i][prop], values[j])) {
                    allFound = false;
                    break;
                }
            }
            if (allFound) {
                filterObj.push(array[i]);
            }
        }
        return filterObj;
    }



}

exports = FilterEngine;
