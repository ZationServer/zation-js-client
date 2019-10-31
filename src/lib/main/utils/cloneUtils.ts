/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

export default class CloneUtils
{
    /**
     * Clone a instance deep.
     * Optimize to clone db storage components.
     * @param v
     */
    static deepCloneInstance(v : any) : any {
        // if not array or object or is null return self
        if (typeof v !== 'object'||v === null) return v;
        let newO, i;
        if (Array.isArray(v)) {
            let l;
            newO = [];
            for (i = 0, l = v.length; i < l; i++) newO[i] = CloneUtils.deepCloneInstance(v[i]);
            return newO;
        }
        if (v instanceof Map) {
            return new Map(this.deepCloneInstance(Array.from(v)));
        }
        if (v instanceof Set) {
            return new Set(this.deepCloneInstance(Array.from(v)));
        }
        newO = {};
        Object.setPrototypeOf(newO,Object.getPrototypeOf(v));
        for (i in v) if (v.hasOwnProperty(i)){
            newO[i] = CloneUtils.deepCloneInstance(v[i]);
        }
        return newO;
    }

    /**
     * Deep clone any value.
     * Notice that it only clones enumerable properties of an object.
     * @param v
     */
    static deepClone<T extends any = any>(v : T) : T {
        // if not array or object or is null return self
        if (typeof v !== 'object'||v === null) return v;
        let newO, i;
        // handle case: array
        if (Array.isArray(v)) {
            let l;
            newO = [];
            for (i = 0, l = v.length; i < l; i++) newO[i] = CloneUtils.deepClone(v[i]);
            return newO;
        }
        // handle case: object
        newO = {};
        for (i in v) if (v.hasOwnProperty(i)) newO[i] = CloneUtils.deepClone(v[i]);
        return newO;
    }
}