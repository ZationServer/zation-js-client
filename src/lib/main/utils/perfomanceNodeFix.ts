/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

if(typeof window !== 'object' || window.performance === undefined){
    try {
        global['performance'] = require('perf_hooks').performance;
    }
    catch (e) {}
}