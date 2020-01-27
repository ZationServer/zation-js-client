/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import DbsHead          from "../../../../src/lib/main/databox/storage/components/dbsHead";
import {$any, $contains, $key, $matches, $notContains, $notMatches, $value, buildKeyArray} from "../../../../src";
import {assert}         from 'chai';
import {createSimpleModifyToken} from "../../../../src/lib/main/databox/storage/components/modifyToken";

describe('MAIN.Databox.Storage',() => {

    describe('Parse tests', () => {

        it('KeyArray - normal', () => {
            const head = new DbsHead(buildKeyArray([{id : 1},{id : 2},{id : 3}],'id'));

            const data = head.getData();
            const dataCopy = head.getDataCopy();
            assert.deepEqual(data,dataCopy,'Copy should be deep equal');

            assert.deepEqual(data,[{id : 1},{id : 2},{id : 3}]);
        });

        it('KeyArray - normal (duplicated keys)', () => {
            const head = new DbsHead(buildKeyArray([{id : 1,v : 12},{id : 3,v : 14},{id : 3,v : 13}],'id'));

            const data = head.getData();
            const dataCopy = head.getDataCopy();
            assert.deepEqual(data,dataCopy,'Copy should be deep equal');

            assert.deepEqual(data,[{id : 1,v : 12},{id : 3,v : 13}]);
        });

        it('KeyArray - with value', () => {
            const head = new DbsHead(buildKeyArray([{id : 1,v : 'a'},{id : 2,v : 'b'},{id : 3,v : 'c'}],'id','v'));

            const data = head.getData();
            const dataCopy = head.getDataCopy();
            assert.deepEqual(data,dataCopy,'Copy should be deep equal');

            assert.deepEqual(data,['a','b','c']);
        });

        it('Object', () => {
            const head = new DbsHead({name : 'luca',age : 20});

            const data = head.getData();
            const dataCopy = head.getDataCopy();
            assert.deepEqual(data,dataCopy,'Copy should be deep equal');

            assert.deepEqual(data,{name : 'luca',age : 20});
        });


        it('Object with null and undefined properties', () => {
            const head = new DbsHead({name : 'luca',age : 20,car : null,foo : undefined});

            const data = head.getData();
            const dataCopy = head.getDataCopy();
            assert.deepEqual(data,dataCopy,'Copy should be deep equal');

            assert.deepEqual(data,{name : 'luca',age : 20,car : null,foo : undefined});
        });

        it('Array', () => {
            const head = new DbsHead(['a','b','c']);

            const data = head.getData();
            const dataCopy = head.getDataCopy();
            assert.deepEqual(data,dataCopy,'Copy should be deep equal');

            assert.deepEqual(data,['a','b','c']);
        });

    });

    describe('Cud tests', () => {

        describe('Insert',() => {

            it('Head', () => {
                const head = new DbsHead(undefined);

                head.insert([],{name : 'max'},{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.getData(),head.getDataCopy(),'Copy should be deep equal');
                assert.deepEqual(head.getData(),{name : 'max'});

                head.insert([],{name : 'luca'},{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.getData(),head.getDataCopy(),'Copy should be deep equal');
                assert.deepEqual(head.getData(),{name : 'max'});
            });

            it('KeyArray - normal', () => {
                const head = new DbsHead(buildKeyArray([{id : 1},{id : 2},{id : 3}],'id'));

                head.insert(['4'],{id : 4},{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.getData(),head.getDataCopy(),'Copy should be deep equal');

                assert.deepEqual(head.getData(),[{id : 1},{id : 2},{id : 3},{id : 4}]);
            });

            it('KeyArray - normal (With if condition)', () => {
                const head = new DbsHead(buildKeyArray([{id : 1},{id : 2},{id : 4},{id : 5}],'id'));

                head.insert(['3'],{id : 3},{timestamp : Date.now(),if : [$contains($key('4'))]},createSimpleModifyToken());

                assert.deepEqual(head.getData(),head.getDataCopy(),'Copy should be deep equal');

                assert.deepEqual(head.getData(),[{id : 1},{id : 2},{id : 4},{id : 5},{id : 3}]);
            });

            it('KeyArray - with value', () => {
                const head = new DbsHead(buildKeyArray([{id : 1,v : 'a'},{id : 2,v : 'b'},{id : 3,v : 'c'}],'id','v'));

                head.insert(['4'],'d',{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.getData(),head.getDataCopy(),'Copy should be deep equal');

                assert.deepEqual(head.getData(),['a','b','c','d']);
            });

            it('Object', () => {
                const head = new DbsHead({name : 'luca',age : 20});

                head.insert(['online'],true,{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.getData(),head.getDataCopy(),'Copy should be deep equal');

                assert.deepEqual(head.getData(),{name : 'luca',age : 20,online : true});
            });

            it('Array (Push)', () => {
                const head = new DbsHead(['a','b','c']);

                head.insert([''],'d',{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.getData(),head.getDataCopy(),'Copy should be deep equal');

                assert.deepEqual(head.getData(),['a','b','c','d']);
            });

            it('Array (Index)', () => {
                const head = new DbsHead(['a','b','c']);

                head.insert(['4'],'d',{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.getData(),head.getDataCopy(),'Copy should be deep equal');

                assert.deepEqual(head.getData(),['a','b','c',undefined,'d']);
            });
        });

        describe('Update',() => {

            it('Head', () => {
                const head = new DbsHead({name : 'luca'});

                head.update([],{name : 'tara'},{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.getData(),head.getDataCopy(),'Copy should be deep equal');

                assert.deepEqual(head.getData(),{name : 'tara'});
            });

            it('KeyArray - normal', () => {
                const head = new DbsHead(buildKeyArray([{id : 1},{id : 3},{id : 4}],'id'));

                head.update(['1'],{id : 1,v : 'hello'},{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.getData(),head.getDataCopy(),'Copy should be deep equal');

                assert.deepEqual(head.getData(),[{id : 1,v : 'hello'},{id : 3},{id : 4}]);
            });

            it('KeyArray - with value', () => {
                const head = new DbsHead(buildKeyArray([{id : 1,v : 'a'},{id : 3,v : 'c'},{id : 4,v : 'd'}],'id','v'));

                head.update(['1'],'z',{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.getData(),head.getDataCopy(),'Copy should be deep equal');

                assert.deepEqual(head.getData(),['z','c','d']);
            });

            it('Object', () => {
                const head = new DbsHead({name : 'luca',age : 20});

                head.update(['name'],'tom',{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.getData(),head.getDataCopy(),'Copy should be deep equal');

                assert.deepEqual(head.getData(),{name : 'tom',age : 20});
            });

            it('Object (Missing key)', () => {
                const head = new DbsHead({name : 'luca',age : 20});

                head.update(['firstName'],'tom',{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.getData(),head.getDataCopy(),'Copy should be deep equal');

                assert.deepEqual(head.getData(),{name : 'luca',age : 20});
            });

            it('Array', () => {
                const head = new DbsHead(['a','b','c']);

                head.update(['1'],'c',{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.getData(),head.getDataCopy(),'Copy should be deep equal');

                assert.deepEqual(head.getData(),['a','c','c']);
            });
        });

        describe('Delete',() => {

            it('Head', () => {
                const head = new DbsHead({name : 'luca'});

                head.delete([],{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.getData(),head.getDataCopy(),'Copy should be deep equal');

                assert.deepEqual(head.getData(),undefined);
            });

            it('KeyArray - normal', () => {
                const head = new DbsHead(buildKeyArray([{id : 1},{id : 2},{id : 3},{id : 4}],'id'));

                head.delete(['2'],{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.getData(),head.getDataCopy(),'Copy should be deep equal');

                assert.deepEqual(head.getData(),[{id : 1},{id : 3},{id : 4}]);
            });

            it('KeyArray - with value', () => {
                const head = new DbsHead(buildKeyArray([{id : 1,v : 'a'},{id : 2,v : 'b'},{id : 3,v : 'c'},{id : 4,v : 'd'}],'id','v'));

                head.delete(['2'],{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.getData(),head.getDataCopy(),'Copy should be deep equal');

                assert.deepEqual(head.getData(),['a','c','d']);
            });

            it('KeyArray - normal (delete all)', () => {
                const head = new DbsHead(buildKeyArray([{id : 1},{id : 2},{id : 3}],'id'));

                head.delete(['2'],{timestamp : Date.now()},createSimpleModifyToken());
                head.delete(['1'],{timestamp : Date.now()},createSimpleModifyToken());
                head.delete(['3'],{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.getData(),head.getDataCopy(),'Copy should be deep equal');

                assert.deepEqual(head.getData(),[]);
            });

            it('Object', () => {
                const head = new DbsHead({name : 'luca',age : 20,online : true});

                head.delete(['online'],{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.getData(),head.getDataCopy(),'Copy should be deep equal');

                assert.deepEqual(head.getData(),{name : 'luca',age : 20});
            });

            it('Array (LastItem)', () => {
                const head = new DbsHead(['a','b','c']);

                head.delete([''],{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.getData(),head.getDataCopy(),'Copy should be deep equal');

                assert.deepEqual(head.getData(),['a','b']);
            });

            it('Array (Index)', () => {
                const head = new DbsHead(['a','b','c']);

                head.delete(['1'],{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.getData(),head.getDataCopy(),'Copy should be deep equal');

                assert.deepEqual(head.getData(),['a','c']);
            });

        });

    });

    describe('Comparator tests', () => {

        it('KeyArray - Sort-1', () => {
            const head = new DbsHead(buildKeyArray([{id : 2},{id : 1},{id : 3}],'id'));

            head.forEachComp((c) => {
                c.setComparator((a,b) => a.id-b.id);
            });

            const data = head.getData();
            const dataCopy = head.getDataCopy();

            assert.deepEqual(data,dataCopy,'Copy should be deep equal');

            assert.deepEqual(data,[{id : 1},{id : 2},{id : 3}]);

            head.forEachComp((c) => {
                c.setComparator((a,b) => b.id-a.id);
            });

            assert.deepEqual(head.getData(),[{id : 3},{id : 2},{id : 1}]);
        });

        it('KeyArray - Sort-2 (With insert)', () => {
            const head = new DbsHead(buildKeyArray([{id : 2},{id : 1},{id : 3}],'id'));

            head.forEachComp((c) => {
                c.setComparator((a,b) => a.id-b.id);
            });

            head.insert(['4'],{id : 4},{timestamp : Date.now()},createSimpleModifyToken());
            head.insert(['5'],{id : 2},{timestamp : Date.now()},createSimpleModifyToken());

            assert.deepEqual(head.getData(),head.getDataCopy(),'Copy should be deep equal');
            assert.deepEqual(head.getData(),[{id : 1},{id : 2},{id : 2},{id : 3},{id : 4}]);
        });

        it('KeyArray - Sort-3 (With insert)', () => {
            const head = new DbsHead(buildKeyArray([{id : 2},{id : 4},{id : 3}],'id'));

            head.forEachComp((c) => {
                c.setComparator((a,b) => b.id-a.id);
            });

            head.insert(['1'],{id : 1},{timestamp : Date.now()},createSimpleModifyToken());
            head.insert(['5'],{id : 5},{timestamp : Date.now()},createSimpleModifyToken());

            assert.deepEqual(head.getData(),head.getDataCopy(),'Copy should be deep equal');
            assert.deepEqual(head.getData(),[{id : 5},{id :4},{id : 3},{id : 2},{id : 1}]);
        });

    });

    describe('Timestamp tests', () => {
        it('Object',() => {
            const head = new DbsHead({name : 'luca',age : 20});

            const timestamp = Date.now();

            head.update(['name'],'tom',{timestamp : timestamp +1},createSimpleModifyToken());

            head.update(['name'],'fabio',{timestamp : timestamp -1},createSimpleModifyToken());

            assert.deepEqual(head.getData(),head.getDataCopy(),'Copy should be deep equal');

            assert.deepEqual(head.getData(),{name : 'tom',age : 20});

        });
    });

    describe('If Conditions tests', () => {
        it('Object (Matches)',() => {
            const head = new DbsHead({name : 'luca',age : 20});

            head.update(['name'],'tom',{timestamp : Date.now(),
                if : [$matches({age : 20})]},createSimpleModifyToken());

            assert.deepEqual(head.getData(),head.getDataCopy(),'Copy should be deep equal');
            assert.deepEqual(head.getData(),{name : 'tom',age : 20});

            head.update(['name'],'luca',{timestamp : Date.now(),
                if : [$matches({age : {$gt : 18}}),
                    $notMatches({name : 'tom'})]},createSimpleModifyToken());

            assert.deepEqual(head.getData(),head.getDataCopy(),'Copy should be deep equal');
            assert.deepEqual(head.getData(),{name : 'tom',age : 20});
        });

        it('Object (Contains)',() => {
            const head = new DbsHead({name : 'luca',age : 20});

            head.update(['name'],'tom',{timestamp : Date.now(),
                if : [$contains($value({$gt : 18}))]},createSimpleModifyToken());

            assert.deepEqual(head.getData(),head.getDataCopy(),'Copy should be deep equal');
            assert.deepEqual(head.getData(),{name : 'tom',age : 20});

            head.update(['name'],'luca',{timestamp : Date.now(),
                if : [$contains($key('name')),$notContains($key('age'))]},createSimpleModifyToken());

            assert.deepEqual(head.getData(),head.getDataCopy(),'Copy should be deep equal');
            assert.deepEqual(head.getData(),{name : 'tom',age : 20});
        });

        it('Object (Contains (any))',() => {
            const head = new DbsHead({brand: 'XU',price : 200});

            head.update(['price'],300,{timestamp : Date.now(),
                if : [$contains($any)]},createSimpleModifyToken());

            assert.deepEqual(head.getData(),head.getDataCopy(),'Copy should be deep equal');
            assert.deepEqual(head.getData(),{brand: 'XU',price : 300});

            head.update(['price'],0,{timestamp : Date.now(),
                if : [$notContains($any)]},createSimpleModifyToken());

            assert.deepEqual(head.getData(),head.getDataCopy(),'Copy should be deep equal');
            assert.deepEqual(head.getData(),{brand: 'XU',price : 300});
        });

        it('Object (Combined)',() => {
            const head = new DbsHead({name : 'luca',age : 20});

            head.update(['name'],'tom',{timestamp : Date.now(),
                if : [$matches({age : 20}),$contains($value('luca'))]},createSimpleModifyToken());

            assert.deepEqual(head.getData(),head.getDataCopy(),'Copy should be deep equal');
            assert.deepEqual(head.getData(),{name : 'tom',age : 20});
        });

        it('Head (Matches)',() => {
            const head = new DbsHead({name: 'luca'});
            head.update([],{name: 'tom'},{timestamp : Date.now(),
                if : [$matches({name: 'luca'})]},createSimpleModifyToken());

            assert.deepEqual(head.getData(),head.getDataCopy(),'Copy should be deep equal');
            assert.deepEqual(head.getData(),{name: 'tom'});
        });

        it('Head (Contains)',() => {
            const head = new DbsHead({name: 'luca'});
            head.update([],{name: 'tom'},{timestamp : Date.now(),
                if : [$contains($value({name: 'luca'}))]},createSimpleModifyToken());

            assert.deepEqual(head.getData(),head.getDataCopy(),'Copy should be deep equal');
            assert.deepEqual(head.getData(),{name: 'tom'});
        });

        it('Head (Contains (any))',() => {
            const head = new DbsHead({name: 'luca'});
            head.update([],{name: 'tom'},{timestamp : Date.now(),
                if : [$contains($any)]},createSimpleModifyToken());

            assert.deepEqual(head.getData(),head.getDataCopy(),'Copy should be deep equal');
            assert.deepEqual(head.getData(),{name: 'tom'});
        });
    });

    describe('Value merger tests', () => {

        it('Object value merge', () => {

            const head1 = new DbsHead({name : 'luca',age : 20});
            const head2 = new DbsHead({name : 'luca',age : 20});

            head1.forEachComp((c) => c.setValueMerger((oldValue,newValue) => {
                const oldType = typeof oldValue;
                const newType = typeof newValue;

                if((oldType === 'number' || oldType === 'string') &&
                    (newType === 'number' || newType === 'string')){
                    return oldValue + newValue;
                }
                else {
                    return newValue;
                }
            }));

            const merged = head1.mergeWithNew(head2).mergedValue;

            assert.deepEqual(merged.getData(),merged.getDataCopy(),'Copy should be deep equal');
            assert.deepEqual(merged.getData(),{name : 'lucaluca',age : 40});
        });
    });

    describe('Merger tests', () => {

        it('Key array merge test', () => {
            const head1 = new DbsHead(buildKeyArray([{id : 1},{id : 2},{id : 3}],'id'));
            const head2 = new DbsHead(buildKeyArray([{id : 3},{id : 4},{id : 1}],'id'));

            const merged = head1.mergeWithNew(head2).mergedValue;

            assert.deepEqual(merged.getData(),merged.getDataCopy(),'Copy should be deep equal');
            assert.deepEqual(merged.getData(),[{id : 1},{id : 2},{id : 3},{id : 4}]);
        });

        it('Key array deep merge test 2', () => {
            const head1 = new DbsHead({msgs : buildKeyArray([{id : 1},{id : 2},{id : 3}],'id')});
            const head2 = new DbsHead({msgs : buildKeyArray([{id : 3},{id : 4},{id : 1}],'id')});

            const merged = head1.mergeWithNew(head2).mergedValue;

            assert.deepEqual(merged.getData(),merged.getDataCopy(),'Copy should be deep equal');
            assert.deepEqual(merged.getData(),{msgs : [{id : 1},{id : 2},{id : 3},{id : 4}]});
        });

    });

    describe('Deep structure tests', () => {

        it('Deep struture - 1', () => {
            const head = new DbsHead({
                name : 'luca',
                cars : buildKeyArray([{
                    id : 10,
                    vendor : 'Lamborghini',
                    motor : {
                        horsepower : 800
                    }
                }],'id')
            });

            head.update(['cars','10','motor','horsepower'],1200,{timestamp : Date.now()},createSimpleModifyToken());

            assert.deepEqual(head.getData(),head.getDataCopy(),'Copy should be deep equal');
            assert.deepEqual(head.getData(),{
                name : 'luca',
                cars : [{
                    id : 10,
                    vendor : 'Lamborghini',
                    motor : {
                        horsepower : 1200
                    }
                }]
            });
        });

    });

});