/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

let perf: {
    /**
     * Returns accurate timestamp in milliseconds to measure performance.
     */
    now(): number
};
if(typeof window === 'object' && window.performance !== undefined){
    perf = window.performance;
}
else {
    try {
        perf = require('perf_hooks').performance;
    }
    catch (e) {
        perf = Date;
    }
}
export default perf;