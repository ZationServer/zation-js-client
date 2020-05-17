/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {dynamicRequire} from "./dynamicRequire";

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
        perf = dynamicRequire(module,'perf_hooks').performance;
    }
    catch (_) {
        perf = Date;
    }
}
export default perf;