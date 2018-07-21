/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

class FilterEngine
{
    static getWhoHasOneOfInputVar(input : any[], filter : any[] | any, prop : string, searchFilter = FilterHandlerLib.equals) : any[]
    {
        let res : any[] = [];
        if(Array.isArray(filter)) {
            res = FilterEngine.getWhoHasOneOf(input,filter,prop,searchFilter);
        }
        else {
            res = FilterEngine.getWhoHas(input,filter,prop,searchFilter);
        }
        return res;
    }

    static getWhoHas(input : any[], filter : any, prop : string, searchFilter = FilterHandlerLib.equals) : object[]
    {
        let filterObj : any[] = [];
        for (let i = 0; i < input.length; i++) {
            if (searchFilter(input[i][prop], filter)) {
                filterObj.push(input[i]);
            }
        }
        return filterObj;
    }

    static getWhoHasOneOf(input : any[], filter : any[], prop : string, searchFilter = FilterHandlerLib.equals) : object[]
    {
        let filterObj : any[] = [];
        for (let i = 0; i < input.length; i++) {
            for (let j = 0; j < filter.length; j++) {
                if (searchFilter(input[i][prop], filter[j])) {
                    filterObj.push(input[i]);
                    break;
                }
            }
        }
        return filterObj;
    }
}

exports = FilterEngine;
