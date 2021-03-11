/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {filterBackErrors, BackError} from '../../../../src';

const assert = require('chai').assert;

describe('MAIN.BackError.FilterBackErrors', () => {

    const demoErrors = [
        new BackError({n: 'toOld', g: 'ageError', t: 'input', d: 'The age is to old', c: 1, i: {age: 50, maxAge: 45}}),
        new BackError({n: 'nameNotAllow', g: 'nameError', t: 'input2', d: 'The name is not allowed', c: 1, i: {name: 'peter'}}),
    ];

    describe('Name filter', () => {

        describe('String', () => {

            it('With matching string', () => {
                const errors = filterBackErrors(demoErrors, {name: 'toOld'});
                assert(errors.length === 1);
            });

            it('With not matching string', () => {
                const errors = filterBackErrors(demoErrors, {name: 'toCool'});
                assert(errors.length === 0);
            });
        });

        describe('In', () => {

            it('With two matching strings', () => {
                const errors = filterBackErrors(demoErrors, {name: {$in: ['toOld', 'nameNotAllow']}});
                assert(errors.length === 2);
            });

            it('With two not matching strings', () => {
                const errors = filterBackErrors(demoErrors, {name: {$in: ['toCool', 'toFast']}});
                assert(errors.length === 0);
            });

            it('With one matching string', () => {
                const errors = filterBackErrors(demoErrors, {name: {$in: ['toCool', 'toOld']}});
                assert(errors.length === 1);
            });
        });
    });

    describe('Group filter', () => {

        describe('String', () => {

            it('With matching string', () => {
                const errors = filterBackErrors(demoErrors, {group: 'ageError'});
                assert(errors.length === 1);
            });

            it('With not matching string', () => {
                const errors = filterBackErrors(demoErrors, {group: 'fooError'});
                assert(errors.length === 0);
            });
        });

        describe('In', () => {

            it('With two matching strings', () => {
                const errors = filterBackErrors(demoErrors, {group: {$in: ['ageError', 'nameError']}});
                assert(errors.length === 2);
            });

            it('With two not matching strings', () => {
                const errors = filterBackErrors(demoErrors, {group: {$in: ['toCool', 'toFast']}});
                assert(errors.length === 0);
            });

            it('With one matching string', () => {
                const errors = filterBackErrors(demoErrors, {name: {$in: ['ageError', 'toOld']}});
                assert(errors.length === 1);
            });
        });
    });

    describe('Type filter', () => {

        describe('String', () => {

            it('With matching string', () => {
                const errors = filterBackErrors(demoErrors, {type: 'input'});
                assert(errors.length === 1);
            });

            it('With not matching string', () => {
                const errors = filterBackErrors(demoErrors, {type: 'fooError'});
                assert(errors.length === 0);
            });
        });

        describe('In', () => {

            it('With two matching strings', () => {
                const errors = filterBackErrors(demoErrors, {type: {$in: ['input', 'input2']}});
                assert(errors.length === 2);
            });

            it('With two not matching strings', () => {
                const errors = filterBackErrors(demoErrors, {type: {$in: ['toCool', 'toFast']}});
                assert(errors.length === 0);
            });

            it('With one matching string', () => {
                const errors = filterBackErrors(demoErrors, {type: {$in: ['input', 'toOld']}});
                assert(errors.length === 1);
            });
        });
    });

    describe('Info filter', () => {

        describe('Object', () => {

            it('With matching object', () => {
                const errors = filterBackErrors(demoErrors, {info: {age: 50, maxAge: 45}});
                assert(errors.length === 1);
            });

            it('With not matching object', () => {
                const errors = filterBackErrors(demoErrors, {info: {age: 55, maxAge: 15}});
                assert(errors.length === 0);
            });
        });

        describe('Or', () => {

            it('With two matching objects', () => {
                const errors = filterBackErrors(demoErrors, {info: {$or: [{age: 50, maxAge: 45}, {name: 'peter'}]}});
                assert(errors.length === 2);
            });

            it('With two not matching objects', () => {
                const errors = filterBackErrors(demoErrors, {info: {$or: [{name: 'tom'}, {name: 'hans'}]}});
                assert(errors.length === 0);
            });

            it('With one matching object', () => {
                const errors = filterBackErrors(demoErrors, {info: {$or: [{name: 'peter'}, {name: 'luca'}]}});
                assert(errors.length === 1);
            });
        });
    });

    describe('Custom filter', () => {

        it('With matching', () => {
            const errors = filterBackErrors(demoErrors, {custom: true});
            assert(errors.length === 2);
        });

        it('With not matching', () => {
            const errors = filterBackErrors(demoErrors, {custom: false});
            assert(errors.length === 0);
        });
    });

});