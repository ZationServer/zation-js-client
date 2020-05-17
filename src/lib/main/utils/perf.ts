/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

const nodePerfHooksModule = 'perf_hooks';
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
        perf = require(nodePerfHooksModule).performance;
    }
    catch (e) {
        perf = Date;
    }
}
export default perf;