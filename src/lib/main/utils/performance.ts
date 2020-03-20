/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

let performance: {now(): number};
if(typeof window === 'object' && window.performance !== undefined){
    performance = window.performance;
}
else {
    try {
        performance = require('perf_hooks').performance;
    }
    catch (e) {
        performance = Date;
    }
}
export default performance;