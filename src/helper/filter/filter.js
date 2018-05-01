/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

class Filter
{
    static _filterEquals(v1, v2)
    {
        return v1 === v2;
    }

    static _filterOneOrMultiAndValue(v1, v2)
    {
        if(Array.isArray(v2))
        {
            for(let i = 0; i < v2.length; i++)
            {
                if(! Filter._objectHasValue(v1,v2[i]))
                {
                    return false;
                }
            }
            return true;
        }
        else
        {
            return Filter._objectHasValue(v1,v2);
        }
    }

    static _objectHasValue(obj,value)
    {
        for(let k in obj)
        {
            if(obj.hasOwnProperty(k) && obj[k] === value)
            {
                return true;
            }
        }
        return false;
    }

    static _filterOneOrMultiAndKey(v1, v2)
    {
        if(Array.isArray(v2))
        {
            for(let i = 0; i < v2.length; i++)
            {
                if(!v1.hasOwnProperty(v2[i]))
                {
                    return false;
                }
            }
            return true;
        }
        else
        {
            return v1.hasOwnProperty(v2);
        }
    }

    static _filterOneOrMultiAndArray(v1, v2)
    {
        if(Array.isArray(v2))
        {
            for(let i = 0; i < v2.length; i++)
            {
                if(!v1.includes(v2[i]))
                {
                    return false;
                }
            }
            return true;
        }
        else
        {
            return v1.includes(v2);
        }
    }

    static _filterAllParamsSame(v1, v2)
    {
        for (let k in v2) {
            if (v2.hasOwnProperty(k)) {
                if(!(v1.hasOwnProperty(k) &&
                    v2[k] === v1[k]))
                {
                    return false;
                }
            }
            else {
                return false;
            }
        }
        return true;
    }

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

module.exports = Filter;