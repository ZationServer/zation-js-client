/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

/**
 * Clone a instance deep.
 * Optimize to clone db storage components.
 * @param v
 * @param tmpCloneMap
 */
export function refSafeDeepCloneInstance(v: any,tmpCloneMap: Map<any,any> = new Map<any, any>()): any {
    if (typeof v !== 'object' || v === null) return v;
    if(tmpCloneMap.has(v)) return tmpCloneMap.get(v);
    let newO, i;
    if (Array.isArray(v)) {
        let l;
        newO = [];
        tmpCloneMap.set(v,newO);
        for (i = 0, l = v.length; i < l; i++) newO[i] = refSafeDeepCloneInstance(v[i],tmpCloneMap);
        return newO;
    }
    if (v instanceof Map) {
        newO = new Map(refSafeDeepCloneInstance(Array.from(v),tmpCloneMap));
        tmpCloneMap.set(v,newO);
        return newO;
    }
    if (v instanceof Set) {
        newO = new Set(refSafeDeepCloneInstance(Array.from(v),tmpCloneMap));
        tmpCloneMap.set(v,newO);
        return newO;
    }
    newO = {};
    tmpCloneMap.set(v,newO);
    Object.setPrototypeOf(newO,Object.getPrototypeOf(v));
    for (i of Reflect.ownKeys(v)) if (v.hasOwnProperty(i)){
        newO[i] = refSafeDeepCloneInstance(v[i],tmpCloneMap);
    }
    return newO;
}

/**
 * Deep clone any value.
 * Notice that it only clones enumerable properties of an object.
 * @param v
 */
export function deepClone<T extends any = any>(v: T): T {
    // if not array or object or is null return self
    if (typeof v !== 'object'||v === null) return v;
    let newO, i;
    // handle case: array
    if (Array.isArray(v)) {
        let l;
        newO = [];
        for (i = 0, l = v.length; i < l; i++) newO[i] = deepClone(v[i]);
        return newO;
    }
    // handle case: object
    newO = {};
    for (i in v) if ((v as object).hasOwnProperty(i)) newO[i] = deepClone(v[i]);
    return newO;
}