/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {FilterHandlerLib} from "./filterHandlerLib";

type HowToGetFunction<T> = (inputData : T) => any;

export class FilterEngine
{
    static getWhoHasOneOfInputVar<T>(input : any[], filter : any[] | any, howToGet : HowToGetFunction<T>, searchFilter = FilterHandlerLib.equals) : any[]
    {
        return Array.isArray(filter) ? FilterEngine.getWhoHasOneOf<T>(input,filter,howToGet,searchFilter) :
            FilterEngine.getWhoHas<T>(input,filter,howToGet,searchFilter);
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

