/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

/**
 * Checks if a value is deep equal to another value.
 * @param v1
 * @param v2
 */
export function deepEqual(v1 : any,v2 : any) : boolean {
    if (v1 === v2) return true;
    if(typeof v1 === "object"){
        if(typeof v2 === "object"){
            if(Array.isArray(v1) && Array.isArray(v2)){
                for(let i = 0; i < v1.length; i++) if(!deepEqual(v1[i],v2[i])) return false;
                return true;
            }
            else {
                for (let k in v1) if(v1.hasOwnProperty(k) && !deepEqual(v1[k],v2[k])) return false;
                for (let k in v2) if(v2.hasOwnProperty(k) && !v1.hasOwnProperty(k)) return false;
                return true;
            }
        }
        else {
            return false;
        }
    }
    return false;
}