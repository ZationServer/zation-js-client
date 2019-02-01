const assert            = require("chai").assert;
const ZationRequest     = require('./../../../../dist/lib/helper/request/zationRequest').ZationRequest;
const ProtocolType      = require('./../../../../dist/lib/helper/constants/protocolType').ProtocolType;
const RequestAble       = require('./../../../../dist/lib/api/requestAble').RequestAble;

describe('HELPER.ZationRequest',() => {

    describe('Constructor', () => {

        it('Default', () => {
            const data = {name : 'luca'};
            const zr = new ZationRequest(data,ProtocolType.WebSocket);
            assert.equal(zr.getProtocol(),ProtocolType.WebSocket);
            assert.equal(zr.getData(),data);
        });
    });

    describe('Methods', () => {

        describe('getCompiledData Normal', () => {

            [
                [{person : {age : 20, name : 'tom'}}],
                ['hello'],
                [2],
                [[2,1,3]],
                [undefined],
                [null]
            ].forEach(([data],index) =>
            {
                it('Test-'+index,async () => {
                    const zr = new ZationRequest(data,ProtocolType.WebSocket);
                    assert.equal(await zr.getCompiledData(),data);
                });
            });
        });

        describe('getCompiledData requestAble', () => {

            class ReuqestAbleData extends RequestAble {
              async toRequestData(protocolType) {
                  return 'compiledData';
              }
            }

            const requestAbleData = new ReuqestAbleData();

            [
                [{a : requestAbleData},{a : 'compiledData'}],
                [{a : {a : requestAbleData}},{a : {a : 'compiledData'}}],
                [[requestAbleData,{a : requestAbleData}],['compiledData',{a : 'compiledData'}]]
            ].forEach(([data,expected],index) =>
            {
                it('Test-'+index,async () => {
                    const zr = new ZationRequest(data,ProtocolType.WebSocket);
                    assert.deepEqual(await zr.getCompiledData(),expected);
                });
            });
        });
    });

});