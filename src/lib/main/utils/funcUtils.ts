/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

export function mergeFunctions(...funcs: ((...args: any[]) => any)[]): (...args: any[]) => Promise<void> {
    return async (...args) => {
        const promises: any[] = [];
        for(let i = 0; i < funcs.length; i++){
            promises.push(funcs[i](...args));
        }
        await Promise.all(promises);
    }
}