/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

export default class ObjectUtils {

    /**
     * Only adds obj to obj on the first Layer.
     * @param mainOb
     * @param addOb
     * @param overwrite
     */
    static addObToOb(mainOb : object,addOb : object,overwrite : boolean = false) : void
    {
        for(let key in addOb) {
            if(addOb.hasOwnProperty(key)) {
                if(overwrite || !mainOb.hasOwnProperty(key)) {
                    mainOb[key] = addOb[key];
                }
            }
        }
    }
}