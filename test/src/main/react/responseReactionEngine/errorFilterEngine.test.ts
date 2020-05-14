/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {ErrorFilterEngine, BackError} from "../../../../../src";
const assert            = require("chai").assert;

describe('MAIN.ErrorFilterEngine',() => {

    const demoErrors = [
        new BackError({n : 'toOld',g : 'ageError', t : 'input', d : 'The age is to old', z : 1, i : {age : 50,maxAge : 45}}),
        new BackError({n : 'nameNotAllow',g : 'nameError', t : 'input2', d : 'The name is not allowed', z : 1, i : {name : 'peter'}}),
    ];

    describe('Name filer', () => {

        describe('String', () => {

            it('With matching string', () => {
                const errors = ErrorFilterEngine.filterErrors(demoErrors,[{name : 'toOld'}]);
                assert(errors.length === 1);
            });

            it('With not matching string', () => {
                const errors = ErrorFilterEngine.filterErrors(demoErrors,[{name : 'toCool'}]);
                assert(errors.length === 0);
            });
        });

        describe('Array', () => {

            it('With two matching strings', () => {
                const errors = ErrorFilterEngine.filterErrors(demoErrors,[{name : ['toOld','nameNotAllow']}]);
                assert(errors.length === 2);
            });

            it('With two not matching strings', () => {
                const errors = ErrorFilterEngine.filterErrors(demoErrors,[{name : ['toCool','toFast']}]);
                assert(errors.length === 0);
            });

            it('With one matching string', () => {
                const errors = ErrorFilterEngine.filterErrors(demoErrors,[{name : ['toCool','toOld']}]);
                assert(errors.length === 1);
            });
        });
    });

    describe('Group filer', () => {

        describe('String', () => {

            it('With matching string', () => {
                const errors = ErrorFilterEngine.filterErrors(demoErrors,[{group : 'ageError'}]);
                assert(errors.length === 1);
            });

            it('With not matching string', () => {
                const errors = ErrorFilterEngine.filterErrors(demoErrors,[{group : 'fooError'}]);
                assert(errors.length === 0);
            });
        });

        describe('Array', () => {

            it('With two matching strings', () => {
                const errors = ErrorFilterEngine.filterErrors(demoErrors,[{group : ['ageError','nameError']}]);
                assert(errors.length === 2);
            });

            it('With two not matching strings', () => {
                const errors = ErrorFilterEngine.filterErrors(demoErrors,[{group : ['toCool','toFast']}]);
                assert(errors.length === 0);
            });

            it('With one matching string', () => {
                const errors = ErrorFilterEngine.filterErrors(demoErrors,[{name : ['ageError','toOld']}]);
                assert(errors.length === 1);
            });
        });
    });

    describe('Type filer', () => {

        describe('String', () => {

            it('With matching string', () => {
                const errors = ErrorFilterEngine.filterErrors(demoErrors,[{type : 'input'}]);
                assert(errors.length === 1);
            });

            it('With not matching string', () => {
                const errors = ErrorFilterEngine.filterErrors(demoErrors,[{type : 'fooError'}]);
                assert(errors.length === 0);
            });
        });

        describe('Array', () => {

            it('With two matching strings', () => {
                const errors = ErrorFilterEngine.filterErrors(demoErrors,[{type : ['input','input2']}]);
                assert(errors.length === 2);
            });

            it('With two not matching strings', () => {
                const errors = ErrorFilterEngine.filterErrors(demoErrors,[{type : ['toCool','toFast']}]);
                assert(errors.length === 0);
            });

            it('With one matching string', () => {
                const errors = ErrorFilterEngine.filterErrors(demoErrors,[{type : ['input','toOld']}]);
                assert(errors.length === 1);
            });
        });
    });

    describe('Info filer', () => {

        describe('Object', () => {

            it('With matching object', () => {
                const errors = ErrorFilterEngine.filterErrors(demoErrors,[{info : {age : 50,maxAge : 45}}]);
                assert(errors.length === 1);
            });

            it('With not matching object', () => {
                const errors = ErrorFilterEngine.filterErrors(demoErrors,[{info : {age : 55,maxAge : 15}}]);
                assert(errors.length === 0);
            });
        });

        describe('Array', () => {

            it('With two matching objects', () => {
                const errors = ErrorFilterEngine.filterErrors(demoErrors,[{info : [{age : 50,maxAge : 45},{name : 'peter'}]}]);
                assert(errors.length === 2);
            });

            it('With two not matching objects', () => {
                const errors = ErrorFilterEngine.filterErrors(demoErrors,[{info : [{name : 'tom'},{name : 'hans'}]}]);
                assert(errors.length === 0);
            });

            it('With one matching object', () => {
                const errors = ErrorFilterEngine.filterErrors(demoErrors,[{info : [{name : 'peter'},{name : 'luca'}]}]);
                assert(errors.length === 1);
            });
        });
    });

    describe('Info Key', () => {

        describe('String', () => {

            it('With matching string', () => {
                const errors = ErrorFilterEngine.filterErrors(demoErrors,[{infoKey : 'age'}]);
                assert(errors.length === 1);
            });

            it('With not matching string', () => {
                const errors = ErrorFilterEngine.filterErrors(demoErrors,[{infoKey : 'test'}]);
                assert(errors.length === 0);
            });
        });

        describe('Array', () => {

            it('With two matching strings', () => {
                const errors = ErrorFilterEngine.filterErrors(demoErrors,[{infoKey : ['age','name']}]);
                assert(errors.length === 2);
            });

            it('With two not matching strings', () => {
                const errors = ErrorFilterEngine.filterErrors(demoErrors,[{infoKey : ['test1','test2']}]);
                assert(errors.length === 0);
            });

            it('With one matching string', () => {
                const errors = ErrorFilterEngine.filterErrors(demoErrors,[{infoKey : ['age','test2']}]);
                assert(errors.length === 1);
            });
        });
    });

    describe('Info Value', () => {

        describe('Value', () => {

            it('With matching value', () => {
                const errors = ErrorFilterEngine.filterErrors(demoErrors,[{infoValue : 45}]);
                assert(errors.length === 1);
            });

            it('With not matching string', () => {
                const errors = ErrorFilterEngine.filterErrors(demoErrors,[{infoValue : 'test'}]);
                assert(errors.length === 0);
            });
        });

        describe('Array', () => {

            it('With two matching values', () => {
                const errors = ErrorFilterEngine.filterErrors(demoErrors,[{infoValue : [50,'peter']}]);
                assert(errors.length === 2);
            });

            it('With two not matching strings', () => {
                const errors = ErrorFilterEngine.filterErrors(demoErrors,[{infoValue : ['test1','test2']}]);
                assert(errors.length === 0);
            });

            it('With one matching value', () => {
                const errors = ErrorFilterEngine.filterErrors(demoErrors,[{infoValue : [50,'test2']}]);
                assert(errors.length === 1);
            });
        });
    });

    describe('FromZationSystem', () => {

        it('With matching', () => {
            const errors = ErrorFilterEngine.filterErrors(demoErrors,[{fromZationSystem : true}]);
            assert(errors.length === 2);
        });

        it('With not matching', () => {
            const errors = ErrorFilterEngine.filterErrors(demoErrors,[{fromZationSystem : false}]);
            assert(errors.length === 0);
        });
    });

});