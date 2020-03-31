/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

export class FilterHandlerLib
{
    static equals(v1: any, v2: any): boolean
    {
        return v1 === v2;
    }

    static objValuesAre(object: object, v2: any): boolean
    {
        if(Array.isArray(v2))
        {
            for(let i = 0; i < v2.length; i++) {
                if(!FilterHandlerLib.objectHasValue(object,v2[i])) {
                    return false;
                }
            }
            return true;
        }
        else {
            return FilterHandlerLib.objectHasValue(object,v2);
        }
    }

    static objKeysAre(object: object, v2: any): boolean
    {
        if(Array.isArray(v2))
        {
            for(let i = 0; i < v2.length; i++) {
                if(!object.hasOwnProperty(v2[i])) {
                    return false;
                }
            }
            return true;
        }
        else {
            return object.hasOwnProperty(v2);
        }
    }

    private static objectHasValue(obj: object,value: any): boolean
    {
        for(const k in obj) {
            if(obj.hasOwnProperty(k) && obj[k] === value) {
                return true;
            }
        }
        return false;
    }

    static allParamsAreSame(v1: object, v2: object): boolean
    {
        for (let k in v2) {
            if (v2.hasOwnProperty(k)) {
                if(!(v1.hasOwnProperty(k) &&
                    v2[k] === v1[k])) {
                    return false;
                }
            }
            else {
                return false;
            }
        }
        return true;
    }

}
