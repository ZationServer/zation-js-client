/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

/**
 * Promise util function.
 * It will call the function after all promises are fulfilled or rejected
 * and return a new promise.
 * @param promises
 * @param func
 */
export function afterPromises(promises : Promise<any>[],func : () => Promise<void> | void) : Promise<void> {
    return new Promise<void>((resolve) => {
        let end = 0;
        const check = async () => {
          end++;
          if(end === promises.length){
              await func();
              resolve();
          }
        };
        for(let i = 0; i < promises.length; i++){
            promises[i].then(check,check);
        }
    });
}