/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import DbsHead          from "../../../../src/lib/main/databox/storage/components/dbsHead";
import {$any, $contains, $key, $matches, $not, $value, buildKeyArray} from "../../../../src";
import {assert}         from 'chai';
import {createSimpleModifyToken} from "../../../../src/lib/main/databox/storage/modifyToken";

describe('MAIN.Databox.Storage',() => {

    describe('Parse tests', () => {

        it('KeyArray - normal', () => {
            const head = new DbsHead(buildKeyArray([{id : 1},{id : 2},{id : 3}],'id'));

            const data = head.data;
            const dataCopy = head.getDataClone();
            assert.deepEqual(data,dataCopy,'Copy should be deep equal');

            assert.deepEqual(data,[{id : 1},{id : 2},{id : 3}]);
        });

        it('KeyArray - normal (duplicated keys)', () => {
            const head = new DbsHead(buildKeyArray([{id : 1,v : 12},{id : 3,v : 14},{id : 3,v : 13}],'id'));

            const data = head.data;
            const dataCopy = head.getDataClone();
            assert.deepEqual(data,dataCopy,'Copy should be deep equal');

            assert.deepEqual(data,[{id : 1,v : 12},{id : 3,v : 13}]);
        });

        it('KeyArray - with value', () => {
            const head = new DbsHead(buildKeyArray([{id : 1,v : 'a'},{id : 2,v : 'b'},{id : 3,v : 'c'}],'id','v'));

            const data = head.data;
            const dataCopy = head.getDataClone();
            assert.deepEqual(data,dataCopy,'Copy should be deep equal');

            assert.deepEqual(data,['a','b','c']);
        });

        it('KeyArray - with key-value pair arrays', () => {
            const head = new DbsHead(buildKeyArray([[1,'a'],[2,'b'],['3','c']]));

            const data = head.data;
            const dataCopy = head.getDataClone();
            assert.deepEqual(data,dataCopy,'Copy should be deep equal');

            assert.deepEqual(data,['a','b','c']);
        });

        it('Object', () => {
            const head = new DbsHead({name : 'luca',age : 20});

            const data = head.data;
            const dataCopy = head.getDataClone();
            assert.deepEqual(data,dataCopy,'Copy should be deep equal');

            assert.deepEqual(data,{name : 'luca',age : 20});
        });


        it('Object with null and undefined properties', () => {
            const head = new DbsHead({name : 'luca',age : 20,car : null,foo : undefined});

            const data = head.data;
            const dataCopy = head.getDataClone();
            assert.deepEqual(data,dataCopy,'Copy should be deep equal');

            assert.deepEqual(data,{name : 'luca',age : 20,car : null,foo : undefined});
        });

        it('Array', () => {
            const head = new DbsHead(['a','b','c']);

            const data = head.data;
            const dataCopy = head.getDataClone();
            assert.deepEqual(data,dataCopy,'Copy should be deep equal');

            assert.deepEqual(data,['a','b','c']);
        });

    });

    describe('Cud tests', () => {

        describe('Insert',() => {

            it('Head', () => {
                const head = new DbsHead(undefined);

                head.insert([],{name : 'max'},{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.data,head.getDataClone(),'Copy should be deep equal');
                assert.deepEqual(head.data,{name : 'max'});

                head.insert([],{name : 'luca'},{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.data,head.getDataClone(),'Copy should be deep equal');
                assert.deepEqual(head.data,{name : 'max'});
            });

            it('KeyArray - normal', () => {
                const head = new DbsHead(buildKeyArray([{id : 1},{id : 2},{id : 3}],'id'));

                head.insert(['4'],{id : 4},{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.data,head.getDataClone(),'Copy should be deep equal');

                assert.deepEqual(head.data,[{id : 1},{id : 2},{id : 3},{id : 4}]);
            });

            it('KeyArray - deep normal', () => {
                const head = new DbsHead(buildKeyArray([{id : 1}],'id'));

                head.insert(['1','name'],'Test',{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.data,head.getDataClone(),'Copy should be deep equal');

                assert.deepEqual(head.data,[{id : 1, name: 'Test'}]);
            });

            it('KeyArray - normal (With if condition)', () => {
                const head = new DbsHead(buildKeyArray([{id : 1},{id : 2},{id : 4},{id : 5}],'id'));

                head.insert(['3'],{id : 3},{timestamp : Date.now(),if : [$contains($key('4'))]},createSimpleModifyToken());

                assert.deepEqual(head.data,head.getDataClone(),'Copy should be deep equal');

                assert.deepEqual(head.data,[{id : 1},{id : 2},{id : 4},{id : 5},{id : 3}]);
            });

            it('KeyArray - with value', () => {
                const head = new DbsHead(buildKeyArray([{id : 1,v : 'a'},{id : 2,v : 'b'},{id : 3,v : 'c'}],'id','v'));

                head.insert(['4'],'d',{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.data,head.getDataClone(),'Copy should be deep equal');

                assert.deepEqual(head.data,['a','b','c','d']);
            });

            it('Object', () => {
                const head = new DbsHead({name : 'luca',age : 20});

                head.insert(['online'],true,{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.data,head.getDataClone(),'Copy should be deep equal');

                assert.deepEqual(head.data,{name : 'luca',age : 20,online : true});
            });

            it('Array (Push)', () => {
                const head = new DbsHead(['a','b','c']);

                head.insert([''],'d',{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.data,head.getDataClone(),'Copy should be deep equal');

                assert.deepEqual(head.data,['a','b','c','d']);
            });

            it('Array (Index)', () => {
                const head = new DbsHead(['a','b','c']);

                head.insert(['4'],'d',{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.data,head.getDataClone(),'Copy should be deep equal');

                assert.deepEqual(head.data,['a','b','c',undefined,'d']);
            });
        });

        describe('Update',() => {

            it('Head', () => {
                const head = new DbsHead({name : 'luca'});

                head.update([],{name : 'tara'},{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.data,head.getDataClone(),'Copy should be deep equal');

                assert.deepEqual(head.data,{name : 'tara'});
            });

            it('KeyArray - normal', () => {
                const head = new DbsHead(buildKeyArray([{id : 1},{id : 3},{id : 4}],'id'));

                head.update(['1'],{id : 1,v : 'hello'},{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.data,head.getDataClone(),'Copy should be deep equal');

                assert.deepEqual(head.data,[{id : 1,v : 'hello'},{id : 3},{id : 4}]);
            });

            it('KeyArray - with value', () => {
                const head = new DbsHead(buildKeyArray([{id : 1,v : 'a'},{id : 3,v : 'c'},{id : 4,v : 'd'}],'id','v'));

                head.update(['1'],'z',{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.data,head.getDataClone(),'Copy should be deep equal');

                assert.deepEqual(head.data,['z','c','d']);
            });

            it('Object', () => {
                const head = new DbsHead({name : 'luca',age : 20});

                head.update(['name'],'tom',{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.data,head.getDataClone(),'Copy should be deep equal');

                assert.deepEqual(head.data,{name : 'tom',age : 20});
            });

            it('Object deep', () => {
                const head = new DbsHead({name : 'luca',age : 20,car: {model: 'VW'}});

                head.update(['car','model'],'Porsche',{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.data,head.getDataClone(),'Copy should be deep equal');

                assert.deepEqual(head.data,{name : 'luca',age : 20,car: {model: 'Porsche'}});
            });

            it('Object (Missing key)', () => {
                const head = new DbsHead({name : 'luca',age : 20});

                head.update(['firstName'],'tom',{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.data,head.getDataClone(),'Copy should be deep equal');

                assert.deepEqual(head.data,{name : 'luca',age : 20});
            });

            it('Array', () => {
                const head = new DbsHead(['a','b','c']);

                head.update(['1'],'c',{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.data,head.getDataClone(),'Copy should be deep equal');

                assert.deepEqual(head.data,['a','c','c']);
            });
        });

        describe('Complex Update',() => {

            it('Deep with key filter query', () => {
                const head = new DbsHead(buildKeyArray([{id : 1,v : {v: ''}},{id : 3,v : {v: ''}},{id : 4,v : {v: ''}}],'id'));

                head.update([$key({$gt: 2}),'v','v'],'t',{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.data,head.getDataClone(),'Copy should be deep equal');

                assert.deepEqual(head.data,[{id : 1,v : {v: ''}},{id : 3,v : {v: 't'}},{id : 4,v : {v: 't'}}]);
            });

            it('Deep with value filter query', () => {
                const head = new DbsHead(buildKeyArray([{id : 1,v : {v: ''}},{id : 3,v : {v: ''}},{id : 4,v : {v: ''}}],'id'));

                head.update([$value({id: {$gt: 2}}),'v','v'],'t',{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.data,head.getDataClone(),'Copy should be deep equal');

                assert.deepEqual(head.data,[{id : 1,v : {v: ''}},{id : 3,v : {v: 't'}},{id : 4,v : {v: 't'}}]);
            });

            it('Deep with all filter query', () => {
                const head = new DbsHead(buildKeyArray([{id : 1,v : {v: ''}},{id : 3,v : {v: ''}},{id : 4,v : {v: ''}}],'id'));

                head.update([$value({}),'v','v'],'t',{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.data,head.getDataClone(),'Copy should be deep equal');

                assert.deepEqual(head.data,[{id : 1,v : {v: 't'}},{id : 3,v : {v: 't'}},{id : 4,v : {v: 't'}}]);
            });

        });

        describe('Delete',() => {

            it('Head', () => {
                const head = new DbsHead({name : 'luca'});

                head.delete([],{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.data,head.getDataClone(),'Copy should be deep equal');

                assert.deepEqual(head.data,undefined);
            });

            it('KeyArray - normal', () => {
                const head = new DbsHead(buildKeyArray([{id : 1},{id : 2},{id : 3},{id : 4}],'id'));

                head.delete(['2'],{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.data,head.getDataClone(),'Copy should be deep equal');

                assert.deepEqual(head.data,[{id : 1},{id : 3},{id : 4}]);
            });

            it('KeyArray - with value', () => {
                const head = new DbsHead(buildKeyArray([{id : 1,v : 'a'},{id : 2,v : 'b'},{id : 3,v : 'c'},{id : 4,v : 'd'}],'id','v'));

                head.delete(['2'],{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.data,head.getDataClone(),'Copy should be deep equal');

                assert.deepEqual(head.data,['a','c','d']);
            });

            it('KeyArray - normal (delete all)', () => {
                const head = new DbsHead(buildKeyArray([{id : 1},{id : 2},{id : 3}],'id'));

                head.delete(['2'],{timestamp : Date.now()},createSimpleModifyToken());
                head.delete(['1'],{timestamp : Date.now()},createSimpleModifyToken());
                head.delete(['3'],{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.data,head.getDataClone(),'Copy should be deep equal');

                assert.deepEqual(head.data,[]);
            });

            it('Object', () => {
                const head = new DbsHead({name : 'luca',age : 20,online : true});

                head.delete(['online'],{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.data,head.getDataClone(),'Copy should be deep equal');

                assert.deepEqual(head.data,{name : 'luca',age : 20});
            });

            it('Array (LastItem)', () => {
                const head = new DbsHead(['a','b','c']);

                head.delete([''],{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.data,head.getDataClone(),'Copy should be deep equal');

                assert.deepEqual(head.data,['a','b']);
            });

            it('Array (Index)', () => {
                const head = new DbsHead(['a','b','c']);

                head.delete(['1'],{timestamp : Date.now()},createSimpleModifyToken());

                assert.deepEqual(head.data,head.getDataClone(),'Copy should be deep equal');

                assert.deepEqual(head.data,['a','c']);
            });

        });

    });

    describe('Comparator tests', () => {

        it('KeyArray - Sort-1', () => {
            const head = new DbsHead(buildKeyArray([{id : 2},{id : 1},{id : 3}],'id'));

            head.forEachComp((c) => {
                c.setComparator((a,b) => a.id-b.id);
            });

            const data = head.data;
            const dataCopy = head.getDataClone();

            assert.deepEqual(data,dataCopy,'Copy should be deep equal');

            assert.deepEqual(data,[{id : 1},{id : 2},{id : 3}]);

            head.forEachComp((c) => {
                c.setComparator((a,b) => b.id-a.id);
            });

            assert.deepEqual(head.data,[{id : 3},{id : 2},{id : 1}]);
        });

        it('KeyArray - Sort-2 (With insert)', () => {
            const head = new DbsHead(buildKeyArray([{id : 2},{id : 1},{id : 3}],'id'));

            head.forEachComp((c) => {
                c.setComparator((a,b) => a.id-b.id);
            });

            head.insert(['4'],{id : 4},{timestamp : Date.now()},createSimpleModifyToken());
            head.insert(['5'],{id : 2},{timestamp : Date.now()},createSimpleModifyToken());

            assert.deepEqual(head.data,head.getDataClone(),'Copy should be deep equal');
            assert.deepEqual(head.data,[{id : 1},{id : 2},{id : 2},{id : 3},{id : 4}]);
        });

        it('KeyArray - Sort-3 (With insert)', () => {
            const head = new DbsHead(buildKeyArray([{id : 2},{id : 4},{id : 3}],'id'));

            head.forEachComp((c) => {
                c.setComparator((a,b) => b.id-a.id);
            });

            head.insert(['1'],{id : 1},{timestamp : Date.now()},createSimpleModifyToken());
            head.insert(['5'],{id : 5},{timestamp : Date.now()},createSimpleModifyToken());

            assert.deepEqual(head.data,head.getDataClone(),'Copy should be deep equal');
            assert.deepEqual(head.data,[{id : 5},{id :4},{id : 3},{id : 2},{id : 1}]);
        });

    });

    describe('Timestamp tests', () => {
        it('Object',() => {
            const head = new DbsHead({name : 'luca',age : 20});

            const timestamp = Date.now();

            head.update(['name'],'tom',{timestamp : timestamp +1},createSimpleModifyToken());

            head.update(['name'],'fabio',{timestamp : timestamp -1},createSimpleModifyToken());

            assert.deepEqual(head.data,head.getDataClone(),'Copy should be deep equal');

            assert.deepEqual(head.data,{name : 'tom',age : 20});

        });
    });

    describe('If Conditions tests', () => {
        it('Object (Matches)',() => {
            const head = new DbsHead({name : 'luca',age : 20});

            head.update(['name'],'tom',{timestamp : Date.now(),
                if : [$matches({age : 20})]},createSimpleModifyToken());

            assert.deepEqual(head.data,head.getDataClone(),'Copy should be deep equal');
            assert.deepEqual(head.data,{name : 'tom',age : 20});

            head.update(['name'],'luca',{timestamp : Date.now(),
                if : [$matches({age : {$gt : 18}}),
                    $not($matches({name : 'tom'}))]},createSimpleModifyToken());

            assert.deepEqual(head.data,head.getDataClone(),'Copy should be deep equal');
            assert.deepEqual(head.data,{name : 'tom',age : 20});
        });

        it('Object (Contains)',() => {
            const head = new DbsHead({name : 'luca',age : 20});

            head.update(['name'],'tom',{timestamp : Date.now(),
                if : [$contains($value({$gt : 18}))]},createSimpleModifyToken());

            assert.deepEqual(head.data,head.getDataClone(),'Copy should be deep equal');
            assert.deepEqual(head.data,{name : 'tom',age : 20});

            head.update(['name'],'luca',{timestamp : Date.now(),
                if : [$contains($key('name')),$not($contains($key('age')))]},createSimpleModifyToken());

            assert.deepEqual(head.data,head.getDataClone(),'Copy should be deep equal');
            assert.deepEqual(head.data,{name : 'tom',age : 20});
        });

        it('Object (Contains (any))',() => {
            const head = new DbsHead({brand: 'XU',price : 200});

            head.update(['price'],300,{timestamp : Date.now(),
                if : [$contains($any)]},createSimpleModifyToken());

            assert.deepEqual(head.data,head.getDataClone(),'Copy should be deep equal');
            assert.deepEqual(head.data,{brand: 'XU',price : 300});

            head.update(['price'],0,{timestamp : Date.now(),
                if : [$not($contains($any))]},createSimpleModifyToken());

            assert.deepEqual(head.data,head.getDataClone(),'Copy should be deep equal');
            assert.deepEqual(head.data,{brand: 'XU',price : 300});
        });

        it('Object (Combined)',() => {
            const head = new DbsHead({name : 'luca',age : 20});

            head.update(['name'],'tom',{timestamp : Date.now(),
                if : [$matches({age : 20}),$contains($value('luca'))]},createSimpleModifyToken());

            assert.deepEqual(head.data,head.getDataClone(),'Copy should be deep equal');
            assert.deepEqual(head.data,{name : 'tom',age : 20});
        });

        it('Head (Matches)',() => {
            const head = new DbsHead({name: 'luca'});
            head.update([],{name: 'tom'},{timestamp : Date.now(),
                if : [$matches({name: 'luca'})]},createSimpleModifyToken());

            assert.deepEqual(head.data,head.getDataClone(),'Copy should be deep equal');
            assert.deepEqual(head.data,{name: 'tom'});
        });

        it('Head (Contains)',() => {
            const head = new DbsHead({name: 'luca'});
            head.update([],{name: 'tom'},{timestamp : Date.now(),
                if : [$contains($value({name: 'luca'}))]},createSimpleModifyToken());

            assert.deepEqual(head.data,head.getDataClone(),'Copy should be deep equal');
            assert.deepEqual(head.data,{name: 'tom'});
        });

        it('Head (Contains (any))',() => {
            const head = new DbsHead({name: 'luca'});
            head.update([],{name: 'tom'},{timestamp : Date.now(),
                if : [$contains($any)]},createSimpleModifyToken());

            assert.deepEqual(head.data,head.getDataClone(),'Copy should be deep equal');
            assert.deepEqual(head.data,{name: 'tom'});
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

            assert.deepEqual(merged.data,merged.getDataClone(),'Copy should be deep equal');
            assert.deepEqual(merged.data,{name : 'lucaluca',age : 40});
        });
    });

    describe('Merger tests', () => {

        it('Key array merge test', () => {
            const head1 = new DbsHead(buildKeyArray([{id : 1},{id : 2},{id : 3}],'id'));
            const head2 = new DbsHead(buildKeyArray([{id : 3},{id : 4},{id : 1}],'id'));

            const merged = head1.mergeWithNew(head2).mergedValue;

            assert.deepEqual(merged.data,merged.getDataClone(),'Copy should be deep equal');
            assert.deepEqual(merged.data,[{id : 1},{id : 2},{id : 3},{id : 4}]);
        });

        it('Key array deep merge test 2', () => {
            const head1 = new DbsHead({msgs : buildKeyArray([{id : 1},{id : 2},{id : 3}],'id')});
            const head2 = new DbsHead({msgs : buildKeyArray([{id : 3},{id : 4},{id : 1}],'id')});

            const merged = head1.mergeWithNew(head2).mergedValue;

            assert.deepEqual(merged.data,merged.getDataClone(),'Copy should be deep equal');
            assert.deepEqual(merged.data,{msgs : [{id : 1},{id : 2},{id : 3},{id : 4}]});
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

            assert.deepEqual(head.data,head.getDataClone(),'Copy should be deep equal');
            assert.deepEqual(head.data,{
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