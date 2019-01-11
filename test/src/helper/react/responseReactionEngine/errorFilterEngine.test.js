const assert            = require("chai").assert;
const ErrorFilterEngine = require('./../../../../../dist/lib/helper/react/responseReactionEngine/errorFilterEngine').ErrorFilterEngine;
const TaskError         = require('./../../../../../dist/lib/helper/react/taskError/taskError').TaskError;

describe('Error Filter Engine',() => {

    const demoErrors = [
        new TaskError({n : 'toOld',g : 'ageError', t : 'input', d : 'The age is to old', zs : false, i : {age : 50,maxAge : 45}}),
        new TaskError({n : 'nameNotAllow',g : 'nameError', t : 'input', d : 'The name is not allowed', zs : true, i : {name : 'peter'}}),
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


});