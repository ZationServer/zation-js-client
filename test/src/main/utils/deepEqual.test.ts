import {deepEqual} from '../../../../src/lib/main/utils/deepEqual';
const assert            = require("chai").assert;

describe('MAIN.Utils.DeepEqual', () => {
    ([
        {value1: null, value2: null, expected: true},
        {value1: null, value2: undefined, expected: false},
        {value1: undefined, value2: null, expected: false},
        {value1: null, value2: {}, expected: false},
        {value1: {}, value2: null, expected: false},
        {value1: {a: [], f: {c: '12',d: 12}}, value2: {a: [], f: {c: '12',d: 12}}, expected: true},
        {value1: {a: [], f: {c: '12',d: 13}}, value2: {a: [], f: {c: '12',d: 12}}, expected: false},
        {value1: {a: [], f: {c: '14',d: 12}}, value2: {a: [], f: {c: '12',d: 12}}, expected: false},
        {value1: {a: ['jk'], f: {c: '12',d: 12}}, value2: {a: [], f: {c: '12',d: 12}}, expected: false},
        {value1: {a: '', f: {c: '12',d: 12}}, value2: {a: [], f: {c: '12',d: 12}}, expected: false},
        {value1: {a: [23,1231,{fo: 'a'}]}, value2: {a: [23,1231,{fo: 'a'}]}, expected: true},
        {value1: {a: [23,1231,{fo: 'b'}]}, value2: {a: [23,1231,{fo: 'a'}]}, expected: false},
    ] as {value1: any, value2: any, expected: boolean}[]).forEach(({value1,value2,expected}) => {
        it(`Should be ${!expected ? 'not ' : ''}deep equal`, () => {
            assert(expected === deepEqual(value1,value2));
        });
    });
});