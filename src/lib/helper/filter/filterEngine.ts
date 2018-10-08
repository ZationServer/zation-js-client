/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

type HowToGetFunction<T> = (inputData : T) => any;

class FilterEngine
{
    static getWhoHasOneOfInputVar<T>(input : any[], filter : any[] | any, howToGet : HowToGetFunction<T>, searchFilter = FilterHandlerLib.equals) : any[]
    {
        let res : any[] = [];
        if(Array.isArray(filter)) {
            res = FilterEngine.getWhoHasOneOf<T>(input,filter,howToGet,searchFilter);
        }
        else {
            res = FilterEngine.getWhoHas<T>(input,filter,howToGet,searchFilter);
        }
        return res;
    }

    static getWhoHas<T>(input : any[], filter : any, howToGet : HowToGetFunction<T>, searchFilter = FilterHandlerLib.equals) : object[]
    {
        let filterObj : any[] = [];
        for (let i = 0; i < input.length; i++) {
            if (searchFilter(howToGet(input[i]), filter)) {
                filterObj.push(input[i]);
            }
        }
        return filterObj;
    }

    static getWhoHasOneOf<T>(input : any[], filter : any[], howToGet : HowToGetFunction<T>, searchFilter = FilterHandlerLib.equals) : object[]
    {
        let filterObj : any[] = [];
        for (let i = 0; i < input.length; i++) {
            for (let j = 0; j < filter.length; j++) {
                if (searchFilter(howToGet(input[i]), filter[j])) {
                    filterObj.push(input[i]);
                    break;
                }
            }
        }
        return filterObj;
    }
}

exports = FilterEngine;
