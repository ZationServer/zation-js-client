/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {
    CudType,
    DbProcessedSelector,
    DbSelector,
    DeleteArgs,
    IfOption,
    InfoOption,
    InsertArgs, LocalCudOperation,
    PotentialInsertOption,
    PotentialUpdateOption,
    TimestampOption,
    UpdateArgs
} from "../dbDefinitions";
import ObjectUtils                                      from "../../utils/objectUtils";
import DbsHead                                          from "./components/dbsHead";
import DbUtils                                          from "../dbUtils";
import {DbsComparator}                                  from "./dbsComparator";
import {DbsValueMerger}                                 from "./dbsMerge";
import DbsComponent, {DbsComponentOptions}              from "./components/dbsComponent";
import EventManager                                     from "../../utils/eventManager";
import {deepEqual}                                      from "forint";
import DbLocalCudOperationSequence                      from "../dbLocalCudOperationSequence";
import {createDeleteModifyToken,
    createUpdateInsertModifyToken,
    ModifyLevel,
    getModifyTokenReaons}                               from "./modifyToken";
import LocalCudOperationsMemory                         from "../localCudOperationsMemory";
import {DeepReadonly, Json}                             from '../../utils/typeUtils';

type ClearOnCloseMiddleware = (code: number | string | undefined,data: any) => boolean;
type ClearOnKickOutMiddleware = (code: number | string | undefined,data: any) => boolean;
type ReloadMiddleware = (reloadData: DbStorage) => boolean;
type InsertMiddleware = (selector: DbProcessedSelector, value: any, options: IfOption & InfoOption & TimestampOption) => boolean;
type UpdateMiddleware = (selector: DbProcessedSelector, value: any, options: InfoOption & TimestampOption) => boolean;
type DeleteMiddleware = (selector: DbProcessedSelector, options: InfoOption & TimestampOption) => boolean;
type AddFetchDataMiddleware = (counter: number,fetchedData: DbsHead) => boolean;

export interface DbStorageOptions {
    /**
     * Indicates if this storage should be cleared when a connected databox closes.
     * You also can provide a function that decides if the storage should do the clear.
     * @default true
     */
    clearOnClose?: ClearOnCloseMiddleware | ClearOnCloseMiddleware[] | boolean,
    /**
     * Indicates if this storage should be cleared when the socket
     * is kicked out from a connected databox.
     * You also can provide a function that decides if the storage should do the clear.
     * @default true
     */
    clearOnKickOut?: ClearOnKickOutMiddleware | ClearOnKickOutMiddleware[] | boolean,
    /**
     * Indicates if this storage should load complete reloaded data.
     * Can happen in the case that the socket missed some cud operations.
     * You also can provide a function that decides if the storage should do the reload.
     * @default true
     */
    doReload?: ReloadMiddleware | ReloadMiddleware[] | boolean,
    /**
     * Indicates if this storage should do insert operations.
     * You also can provide a function that decides if the storage should do the insertion.
     * @default true
     */
    doInsert?: InsertMiddleware | InsertMiddleware[] | boolean,
    /**
     * Indicates if this storage should do update operations.
     * You also can provide a function that decides if the storage should do the update.
     * @default true
     */
    doUpdate?: UpdateMiddleware | UpdateMiddleware[] | boolean,
    /**
     * Indicates if this storage should do delete operations.
     * You also can provide a function that decides if the storage should do the deletion.
     * @default true
     */
    doDelete?: DeleteMiddleware | DeleteMiddleware[] | boolean,
    /**
     * Indicates if this storage should add fetch data to the storage.
     * You also can provide a function that decides if the storage should do it.
     * @default true
     */
    doAddFetchData?: AddFetchDataMiddleware | AddFetchDataMiddleware[] | boolean
    /**
     * The initial data will be applied when creating/clearing the storage.
     * Notice that if applyRemoteInitialData is true, it can be
     * overwritten by the initialData of a Databox connect response.
     * @default undefined
     */
    initialData?: any;
    /**
     * Defines if the storage should apply the initial data from
     * the Databox connect response (if it exists).
     * @default true
     */
    applyRemoteInitialData?: boolean;
}

export const enum DataEventReason {
    Insert,
    Update,
    Delete,
    Sort,
    Reload,
    Add,
    Clear,
    Copy
}

export type OnDataChange<D = Json> = (data: DeepReadonly<D> | undefined,reasons: DataEventReason[],storage: DbStorage) => void | Promise<void>;
export type OnDataTouch<D = Json> = (data: DeepReadonly<D> | undefined,reasons: DataEventReason[],storage: DbStorage) => void | Promise<void>;
export type OnInsert = (selector: DbProcessedSelector, value: any, options: IfOption & InfoOption & TimestampOption) => void | Promise<void>;
export type OnUpdate = (selector: DbProcessedSelector, value: any, options: InfoOption & TimestampOption) => void | Promise<void>;
export type OnDelete = (selector: DbProcessedSelector, options: InfoOption & TimestampOption) => void | Promise<void>;

export default class DbStorage<D extends Json = any> {

    private dbStorageOptions: Required<DbStorageOptions> = {
        clearOnClose: true,
        clearOnKickOut: true,
        doReload: true,
        doInsert: true,
        doUpdate: true,
        doDelete: true,
        doAddFetchData: true,
        initialData: undefined,
        applyRemoteInitialData: true
    };

    private dbsHead: DbsHead;
    private mainCompOptions: DbsComponentOptions = {};
    private compOptionsConstraint: Map<string,{s: DbProcessedSelector,o: DbsComponentOptions}> = new Map();

    private cudSeqEditActive: boolean = false;
    private tmpCudInserted: boolean = false;
    private tmpCudUpdated: boolean = false;
    private tmpCudDeleted: boolean = false;

    private hasDataChangeListener: boolean = false;

    private clearOnCloseMiddleware: ClearOnCloseMiddleware;
    private clearOnKickOutMiddleware: ClearOnKickOutMiddleware;
    private reloadMiddleware: ReloadMiddleware;
    private insertMiddleware: InsertMiddleware;
    private updateMiddleware: UpdateMiddleware;
    private deleteMiddleware: DeleteMiddleware;
    private addFetchDataMiddleware: AddFetchDataMiddleware;

    private readonly localCudOperationsMemory = new LocalCudOperationsMemory();

    private readonly dataChangeEvent: EventManager<OnDataChange<D>> = new EventManager<OnDataChange<D>>();
    private readonly dataChangeCombineSeqEvent: EventManager<OnDataChange<D>> = new EventManager<OnDataChange<D>>();
    private readonly dataTouchEvent: EventManager<OnDataTouch<D>> = new EventManager<OnDataTouch<D>>();

    private readonly insertEvent: EventManager<OnInsert> = new EventManager<OnInsert>();
    private readonly updateEvent: EventManager<OnUpdate> = new EventManager<OnUpdate>();
    private hasUpdateListener: boolean = false;
    private readonly deleteEvent: EventManager<OnDelete> = new EventManager<OnDelete>();

    constructor(options: DbStorageOptions = {},dbStorage?: DbStorage) {
        ObjectUtils.addObToOb(this.dbStorageOptions,options,true);
        this.dbsHead = new DbsHead(this.dbStorageOptions.initialData,0);

        this.loadMiddleware();

        if(dbStorage){
            this.copyFrom(dbStorage);
        }
    }

    private loadMiddleware() {
        this.clearOnCloseMiddleware = this.processMiddlewareOption(this.dbStorageOptions.clearOnClose);
        this.clearOnKickOutMiddleware = this.processMiddlewareOption(this.dbStorageOptions.clearOnKickOut);
        this.reloadMiddleware = this.processMiddlewareOption(this.dbStorageOptions.doReload);
        this.insertMiddleware = this.processMiddlewareOption(this.dbStorageOptions.doInsert);
        this.updateMiddleware = this.processMiddlewareOption(this.dbStorageOptions.doUpdate);
        this.deleteMiddleware = this.processMiddlewareOption(this.dbStorageOptions.doDelete);
        this.addFetchDataMiddleware = this.processMiddlewareOption(this.dbStorageOptions.doAddFetchData);
    }

    private processMiddlewareOption<T extends (...args: any[]) => boolean>(value: boolean | T | T[]) :
        (...args: any[]) => boolean
    {
        if(typeof value === 'boolean'){
            return () => value;
        }
        else if(Array.isArray(value)){
            return (...args: any[]) => {
                for(let i = 0; i < value.length; i++){
                    if(!value[i](...args)){
                        return false;
                    }
                }
                return true;
            }
        }
        else {
            return value;
        }
    }

    private updateCompOptions(triggerDataEvents: boolean = false) {
        let dataChanged = false;
        const setMergerComp: DbsComponent[] = [];
        const setComparatorComp: DbsComponent[] = [];
        for (let {s,o} of this.compOptionsConstraint.values()){
            const comps = this.dbsHead.getDbsComponents(s);
            const compsLength = comps.length;
            let compTmp;
            for(let i = 0; i < compsLength; i++){
                compTmp = comps[i];
                if(o.valueMerger){
                    compTmp.setValueMerger(o.valueMerger);
                    setMergerComp.push(compTmp);
                }
                if(o.comparator){
                    dataChanged = compTmp.setComparator(o.comparator) || dataChanged;
                    setComparatorComp.push(compTmp);
                }
            }
        }

        const mainComparator = this.mainCompOptions.comparator;
        const mainValueMerger = this.mainCompOptions.valueMerger;
        if(mainComparator || mainValueMerger){
            this.dbsHead.forEachComp((c) => {
                if(mainComparator && !setComparatorComp.includes(c)){
                    dataChanged = dataChanged || c.setComparator(mainComparator);
                }
                if(mainValueMerger && !setMergerComp.includes(c)){
                    c.setValueMerger(mainValueMerger);
                }
            });
        }

        if(triggerDataEvents && dataChanged){
            this.dataTouchEvent.emit(this.data,[DataEventReason.Sort],this);
            this.dataChangeEvent.emit(this.data,[DataEventReason.Sort],this);
            this.dataChangeCombineSeqEvent.emit(this.data,[DataEventReason.Sort],this);
        }
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Sets the initial data and
     * applies it directly if the DbsHead data is undefined.
     * @param initialData
     */
    setInitialData(initialData: any) {
        this.dbStorageOptions.initialData = initialData;
        if(this.dbsHead.getComponentValue() === undefined)
            this.dbsHead.initData(initialData,0);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Sets a value merger.
     * The valueMerger is used when the component needs to merge two values.
     * These values can be anything except an object or array.
     * You can provide a specific selector to the component.
     * If you don't provide a selector, the merger will be set for all components.
     * The storage will automatically update the component options, in case of new data.
     * @example
     * setValueMerger((oldValue,newValue) => {
     *     if(typeof oldValue === 'string' && typeof newValue === 'string'){
     *         return oldValue + newValue;
     *     }
     *     return newValue;
     * });
     * @param valueMerger
     * @param selector
     */
    setValueMerger(valueMerger: DbsValueMerger, selector?: DbSelector): DbStorage {
        this.setCompOption((option) => option.valueMerger = valueMerger,selector);
        this.updateCompOptions();
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Sets a Comparator.
     * The comparator can only be set on KeyArrays.
     * It will be used to sort the array and insert new data in the correct position.
     * You can provide a specific selector to the component.
     * If you don't provide a selector, the merger will be set for all components.
     * The storage will automatically update the component options, in case of new data.
     * @example
     * setComparator((a,b) => a.time - b.time,[]);
     * @param comparator
     * @param selector
     */
    setComparator(comparator: DbsComparator, selector?: DbSelector): DbStorage {
        this.setCompOption((option) => option.comparator = comparator,selector);
        this.updateCompOptions(true);
        return this;
    }

    private setCompOption(func: (option: DbsComponentOptions) => void, selector?: DbSelector){
        if(selector !== undefined){
            selector = DbUtils.processSelector(selector);
            const key = selector.join();
            const constraint = this.compOptionsConstraint.get(key);
            if(constraint){
                func(constraint.o);
            }
            else {
                const options = {};
                func(options);
                this.compOptionsConstraint.set(key,{s: DbUtils.processSelector(selector),o: options})
            }
        }
        else {
            func(this.mainCompOptions);
        }
    }

    /**
     * Returns the current DbsHead.
     */
    getDbsHead(): DbsHead {
        return this.dbsHead;
    }

    /**
     * Returns if the storage should apply remote initial data.
     */
    shouldApplyRemoteInitialData(): boolean {
        return this.dbStorageOptions.applyRemoteInitialData;
    }

    /**
     * Returns if the storage should be cleared on close.
     */
    shouldClearOnClose(code: number | string | undefined,data: any): boolean {
        return this.clearOnCloseMiddleware(code,data);
    }

    /**
     * Returns if the storage should be cleared on kick out.
     */
    shouldClearOnKickOut(code: number | string | undefined,data: any): boolean {
        return this.clearOnKickOutMiddleware(code,data);
    }

    /**
     * Returns if newly fetched data should be added to the storage.
     */
    shouldAddFetchData(counter: number,fetchedData: DbsHead): boolean {
        return this.addFetchDataMiddleware(counter,fetchedData);
    }

    /**
     * Reloads the data.
     */
    reload(reloadedData: DbStorage): DbStorage {
        if(this.reloadMiddleware(reloadedData)){
            this._copyFrom(reloadedData,true);
        }
        return this;
    }

    /**
     * Clears the storage.
     * @param clearLocalCudOperations
     * Indicates if the local cud operations in memory should be cleared.
     */
    clear(clearLocalCudOperations: boolean = true): DbStorage {
        const tmpOldHead = this.dbsHead;
        this.dbsHead = new DbsHead(this.dbStorageOptions.initialData,0);
        this.updateCompOptions();
        this.dataTouchEvent.emit(this.data,[DataEventReason.Clear],this);
        if(this.hasDataChangeListener && !deepEqual(tmpOldHead.data,this.dbsHead.data)){
            this.dataChangeEvent.emit(this.data,[DataEventReason.Clear],this);
            this.dataChangeCombineSeqEvent.emit(this.data,[DataEventReason.Clear],this);
        }
        return this;
    }

    /**
     * Adds new data to the storage.
     * The data will be merged with the old data.
     * @param data
     */
    addData(data: DbsHead): DbStorage {
        this._addDataHead(data.clone());
        return this;
    }

    /**
     * @internal
     * This method is used internally.
     * Adds the dbsHead without cloning it.
     * @private
     * @param dbsHead
     */
    _addDataHead(dbsHead: DbsHead): void {
        const {mergedValue,dataChanged} = this.dbsHead.mergeWithNew(dbsHead);
        this.dbsHead = mergedValue;
        if(dataChanged){
            this.updateCompOptions();
            this.dataTouchEvent.emit(this.data,[DataEventReason.Add],this);
            this.dataChangeEvent.emit(this.data,[DataEventReason.Add],this);
            this.dataChangeCombineSeqEvent.emit(this.data,[DataEventReason.Add],this);
        }
    }

    /**
     * Copies the data from another storage.
     * @param dbStorage
     */
    copyFrom(dbStorage: DbStorage): DbStorage {
        this._copyFrom(dbStorage,false);
        return this;
    }

    private _copyFrom(dbStorage: DbStorage,isReload: boolean): void {
        const tmpOldHead = this.dbsHead;
        this.dbsHead = dbStorage.getDbsHead().clone();
        this.updateCompOptions();

        const localCudOperations = this.localCudOperationsMemory.getAll();
        for(let i = 0; i < localCudOperations.length; i++){
            this._executeLocalCudOperation(localCudOperations[i],true);
        }

        const reason: DataEventReason = isReload ?
            DataEventReason.Reload: DataEventReason.Copy;

        this.dataTouchEvent.emit(this.data,[reason],this);
        if(this.hasDataChangeListener && !deepEqual(tmpOldHead.data,this.dbsHead.data)){
            this.dataChangeEvent.emit(this.data,[reason],this);
            this.dataChangeCombineSeqEvent.emit(this.data,[reason],this);
        }
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns the last added local cud operations.
     */
    public getLastLocalCudOperations(): LocalCudOperation[] {
        return this.localCudOperationsMemory.getLast();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Removes local cud operations from memory.
     * That means that the operations will no longer
     * re-executed after a reload or copy of data.
     * @param operations
     */
    public removeLocalCudOperations(operations: LocalCudOperation[]): DbStorage {
        this.localCudOperationsMemory.remove(operations);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Clears the local cud operations memory.
     * That means that the operations will no longer
     * re-executed after a reload or copy of data.
     */
    public clearLocalCudOperations(): DbStorage {
        this.localCudOperationsMemory.clear();
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns the current data of this storage.
     * Notice that the return value is deep read-only.
     * It is forbidden to modify directly on the storage data because
     * it can break the whole storage.
     * If you need to modify the data you can use the getDataClone method.
     */
    get data(): DeepReadonly<D | undefined> {
        return this.dbsHead.data as DeepReadonly<D>;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns a clone of the current data of this storage.
     */
    getDataClone(): D | undefined {
        return this.dbsHead.getDataClone();
    }

    /**
     * @internal
     * Do an insert operation.
     * Notice that this cud operation is executed only locally
     * and only affects this specific storage instance.
     * If the parameter keepInMemory is true and the storage reloads
     * or copy data, all local cud operations will be re-executed.
     * Otherwise, the changes are also lost in the case of a reload or copy.
     * If you want to do more changes, you should look at the seqEdit method.
     * Insert behavior:
     * Notice that in every case, the insert only happens when the key
     * does not exist on the client.
     * Otherwise, the client will ignore or convert it to an
     * update when potentiallyUpdate is active.
     * Other conditions are that the timeout is newer than the existing
     * timeout and all if conditions are true.
     * Head (with selector [] or '') -> Inserts the value.
     * KeyArray -> Inserts the value at the end with the key.
     * But if you are using a compare function, it will insert the value in the correct position.
     * Object -> Insert the value with the key.
     * Array -> Key will be parsed to int if it is a number, then it will be inserted at the index.
     * Otherwise, it will be inserted at the end.
     * @param selector
     * The selector describes which key-value pairs should be
     * deleted updated or where a value should be inserted.
     * It can be a string array key path, but it also can contain
     * filter queries (they work with the forint library).
     * You can filter by value ($value or property value) by key ($key or property key) or
     * select all keys with {} (For better readability use the constant $all).
     * In the case of insertions, most times, the selector should end with
     * a new key instead of a query.
     * Notice that all numeric values in the selector will be converted to a
     * string because all keys need to be from type string.
     * If you provide a string instead of an array, the string will be
     * split by dots to create a string array.
     * @param value
     * @param options
     * @param keepInMemory
     * Indicates if the cud operation should be kept in memory.
     * In the case of a reload or copy, the storage is then able to
     * re-execute all cud operations to prevent that the changes are lost.
     * It's also possible to remove the cud operations later manually from memory.
     * This can be done with the methods: getLastLocalCudOperations and removeLocalCudOperations.
     */
    insert(selector: DbSelector, value: any, options: IfOption & PotentialUpdateOption & InfoOption & TimestampOption = {}, keepInMemory: boolean = true): DbStorage {
        const timestampTmp = options.timestamp;
        options.timestamp = DbUtils.processTimestamp(options.timestamp);
        options.if = DbUtils.processIfOption(options.if);
        const processedSelector = DbUtils.processSelector(selector);

        this._insert(processedSelector,value,options as (InsertArgs & InfoOption));

        if(keepInMemory){
            this.localCudOperationsMemory.add({
                type: CudType.insert,
                selector: processedSelector,
                value: value,
                code: options.code,
                data: options.data,
                if: options.if,
                potential: options.potentialUpdate,
                timestamp: timestampTmp
            });
        }

        return this;
    }

    /**
     * @internal
     * Internal used insert method.
     * Please use the normal method without a pre underscore.
     * @param selector
     * @param value
     * @param options
     * @param silent
     * @private
     */
    _insert(selector: DbProcessedSelector, value: any, options: InsertArgs & InfoOption,silent: boolean = false): void {
        if(this.insertMiddleware(selector,value,options)) {
            const mt = createUpdateInsertModifyToken(
                !silent && (this.hasDataChangeListener || this.hasUpdateListener));

            this.dbsHead.insert(selector,value,options,mt);

            if(!silent){
                let reasons;
                if(mt.level > 0){
                    this.updateCompOptions();
                    reasons = getModifyTokenReaons(mt,DataEventReason.Insert,DataEventReason.Update);
                    this.dataTouchEvent.emit(this.data,[...reasons],this);
                }
                if(mt.level === ModifyLevel.DATA_CHANGED){
                    this.tmpCudInserted = true;
                    this.insertEvent.emit(selector,value,options);
                    this._triggerChangeEvents(reasons);
                }
            }
        }
    }

    /**
     * Do an update operation.
     * Notice that this cud operation is executed only locally
     * and only affects this specific storage instance.
     * If the parameter keepInMemory is true and the storage reloads
     * or copy data, all local cud operations will be re-executed.
     * Otherwise, the changes are also lost in the case of a reload or copy.
     * If you want to do more changes, you should look at the seqEdit method.
     * Update behavior:
     * Notice that in every case, the update only happens when the key
     * on the client does exist.
     * Otherwise, the client will ignore or convert it to an
     * insert when potentiallyInsert is active.
     * Other conditions are that the timeout is newer than the existing
     * timeout and all if conditions are true.
     * Head (with selector [] or '') -> Updates the complete structure.
     * KeyArray -> Updates the specific value.
     * Object -> Updates the specific value.
     * Array -> Key will be parsed to int if it is a number
     * it will update the specific value.
     * @param selector
     * The selector describes which key-value pairs should be
     * deleted updated or where a value should be inserted.
     * It can be a string array key path, but it also can contain
     * filter queries (they work with the forint library).
     * You can filter by value ($value or property value) by key ($key or property key) or
     * select all keys with {} (For better readability use the constant $all).
     * In the case of insertions, most times, the selector should end with
     * a new key instead of a query.
     * Notice that all numeric values in the selector will be converted to a
     * string because all keys need to be from type string.
     * If you provide a string instead of an array, the string will be
     * split by dots to create a string array.
     * @param value
     * @param options
     * @param keepInMemory
     * Indicates if the cud operation should be kept in memory.
     * In the case of a reload or copy, the storage is then able to
     * re-execute all cud operations to prevent that the changes are lost.
     * It's also possible to remove the cud operations later manually from memory.
     * This can be done with the methods: getLastLocalCudOperations and removeLocalCudOperations.
     */
    update(selector: DbSelector, value: any, options: IfOption & PotentialInsertOption & InfoOption & TimestampOption = {}, keepInMemory: boolean = true): DbStorage {
        const timestampTmp = options.timestamp;
        options.timestamp = DbUtils.processTimestamp(options.timestamp);
        options.if = DbUtils.processIfOption(options.if);
        const processedSelector = DbUtils.processSelector(selector);

        this._update(processedSelector,value,options as (UpdateArgs & InfoOption));

        if(keepInMemory){
            this.localCudOperationsMemory.add({
                type: CudType.update,
                selector: processedSelector,
                value: value,
                code: options.code,
                data: options.data,
                if: options.if,
                potential: options.potentialInsert,
                timestamp: timestampTmp
            });
        }

        return this;
    }

    /**
     * @internal
     * Internal used update method.
     * Please use the normal method without a pre underscore.
     * @param selector
     * @param value
     * @param options
     * @param silent
     * @private
     */
    _update(selector: DbProcessedSelector, value: any, options: UpdateArgs & InfoOption, silent: boolean = false): void {
        if(this.updateMiddleware(selector,value,options)){
            const mt = createUpdateInsertModifyToken(!silent &&
                (this.hasDataChangeListener || this.hasUpdateListener));

            this.dbsHead.update(selector,value,options,mt);

            if(!silent) {
                let reasons;
                if(mt.level > 0){
                    this.updateCompOptions();
                    reasons = getModifyTokenReaons(mt,DataEventReason.Update,DataEventReason.Insert);
                    this.dataTouchEvent.emit(this.data,[...reasons],this);
                }
                // noinspection DuplicatedCode
                if(mt.level === ModifyLevel.DATA_CHANGED){
                    this.tmpCudUpdated = true;
                    this.updateEvent.emit(selector,value,options);
                    this._triggerChangeEvents(reasons);
                }
            }
        }
    }

    /**
     * Do an delete operation
     * Notice that this cud operation is executed only locally
     * and only affects this specific storage instance.
     * If the parameter keepInMemory is true and the storage reloads
     * or copy data, all local cud operations will be re-executed.
     * Otherwise, the changes are also lost in the case of a reload or copy.
     * If you want to do more changes, you should look at the seqEdit method.
     * Delete behavior:
     * Notice that in every case, the delete only happens when the key
     * on the client does exist.
     * Otherwise, the client will ignore it.
     * Other conditions are that the timeout is newer than the existing
     * timeout and all if conditions are true.
     * Head (with selector [] or '') -> Deletes the complete structure.
     * KeyArray -> Deletes the specific value.
     * Object -> Deletes the specific value.
     * Array -> Key will be parsed to int if it is a number it
     * will delete the specific value.
     * Otherwise, it will delete the last item.
     * @param selector
     * The selector describes which key-value pairs should be
     * deleted updated or where a value should be inserted.
     * It can be a string array key path, but it also can contain
     * filter queries (they work with the forint library).
     * You can filter by value ($value or property value) by key ($key or property key) or
     * select all keys with {} (For better readability use the constant $all).
     * In the case of insertions, most times, the selector should end with
     * a new key instead of a query.
     * Notice that all numeric values in the selector will be converted to a
     * string because all keys need to be from type string.
     * If you provide a string instead of an array, the string will be
     * split by dots to create a string array.
     * @param options
     * @param keepInMemory
     * Indicates if the cud operation should be kept in memory.
     * In the case of a reload or copy, the storage is then able to
     * re-execute all cud operations to prevent that the changes are lost.
     * It's also possible to remove the cud operations later manually from memory.
     * This can be done with the methods: getLastLocalCudOperations and removeLocalCudOperations.
     */
    delete(selector: DbSelector, options: IfOption & InfoOption & TimestampOption = {}, keepInMemory: boolean = true): DbStorage {
        const timestampTmp = options.timestamp;
        options.timestamp = DbUtils.processTimestamp(options.timestamp);
        options.if = DbUtils.processIfOption(options.if);
        const processedSelector = DbUtils.processSelector(selector);

        this._delete(processedSelector,options as (DeleteArgs & InfoOption));

        if(keepInMemory){
            this.localCudOperationsMemory.add({
                type: CudType.delete,
                selector: processedSelector,
                code: options.code,
                data: options.data,
                if: options.if,
                timestamp: timestampTmp
            });
        }

        return this;
    }

    /**
     * @internal
     * Internal used delete method.
     * Please use the normal method without a pre underscore.
     * @param selector
     * @param options
     * @param silent
     * @private
     */
    _delete(selector: DbProcessedSelector, options: DeleteArgs & InfoOption,silent: boolean = false): void {
        if(this.deleteMiddleware(selector,options)){
            const mt = createDeleteModifyToken();
            this.dbsHead.delete(selector,options,mt);

            if(!silent && mt.level > 0) {
                this.updateCompOptions();
                this.tmpCudDeleted = true;
                this.deleteEvent.emit(selector,options);
                this.dataTouchEvent.emit(this.data,[DataEventReason.Delete],this);
                this._triggerChangeEvents([DataEventReason.Delete]);
            }
        }
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Sequence edit.
     * Notice that this cud operations are executed only locally
     * and only affects this specific storage instance.
     * If the parameter keepInMemory is true and the storage reloads
     * or copy data, all local cud operations will be re-executed.
     * Otherwise, the changes are also lost in the case of a reload or copy.
     * @param timestamp
     * With the timestamp option, you can change the sequence of data.
     * The storage, for example, will only update data that is older as incoming data.
     * Use this option only if you know what you are doing.
     * @param keepInMemory
     * Indicates if the cud operation should be kept in memory.
     * In the case of a reload or copy, the storage is then able to
     * re-execute all cud operations to prevent that the changes are lost.
     * It's also possible to remove the cud operations later manually from memory.
     * This can be done with the methods: getLastLocalCudOperations and removeLocalCudOperations.
     */
    seqEdit(timestamp?: number, keepInMemory: boolean = true): DbLocalCudOperationSequence {
        return new DbLocalCudOperationSequence( timestamp,(operations) => {
            const operationLength = operations.length;
            this.startCudSeq();
            for(let i = 0; i < operationLength; i++){
                this._executeLocalCudOperation(operations[i],false);
            }
            this.endCudSeq();
            if(keepInMemory) {
                this.localCudOperationsMemory.addMultiple(operations);
            }
        });
    }

    /**
     * This method is used internally.
     * Starts a cud seq edit.
     * The method is essential for the data change event with combine seq edit.
     */
    startCudSeq() {
        this.tmpCudInserted = false;
        this.tmpCudUpdated = false;
        this.tmpCudDeleted = false;
        this.cudSeqEditActive = true;
    }

    /**
     * This method is used internally.
     * Starts a cud seq edit.
     * The method is essential for the data change event with combine seq edit.
     */
    endCudSeq() {
        const reasons: DataEventReason[] = [];
        if(this.tmpCudInserted){reasons.push(DataEventReason.Insert);}
        if(this.tmpCudUpdated){reasons.push(DataEventReason.Update);}
        if(this.tmpCudDeleted){reasons.push(DataEventReason.Delete);}

        if(reasons.length > 0){
            this.dataChangeCombineSeqEvent.emit(this.data,reasons,this);
        }
        this.cudSeqEditActive = false;
    }

    private updateHasDataChangeListener(): void {
        this.hasDataChangeListener = this.dataChangeEvent.hasListener() ||
            this.dataChangeCombineSeqEvent.hasListener()
    }

    private updateHasUpdateListener(): void {
        this.hasUpdateListener = this.updateEvent.hasListener();
    }

    private _triggerChangeEvents(reasons: DataEventReason[]) {
        this.dataChangeEvent.emit(this.data,[...reasons],this);
        if(!this.cudSeqEditActive){
            this.dataChangeCombineSeqEvent.emit(this.data,[...reasons],this);
        }
    }

    /**
     * @internal
     * This method is used internally.
     * @param operation
     * @param silent
     * @private
     */
    public _executeLocalCudOperation(operation: LocalCudOperation,silent: boolean): void {
        switch (operation.type) {
            case CudType.insert:
                this._insert(operation.selector,operation.value,{
                    if: operation.if,
                    timestamp: DbUtils.processTimestamp(operation.timestamp),
                    potentialUpdate: operation.potential,
                    data: operation.data,
                    code: operation.code
                },true);
                break;
            case CudType.update:
                this._update(operation.selector,operation.value,{
                    if: operation.if,
                    timestamp: DbUtils.processTimestamp(operation.timestamp),
                    potentialInsert: operation.potential,
                    data: operation.data,
                    code: operation.code
                },true);
                break;
            case CudType.delete:
                this._delete(operation.selector,{
                    if: operation.if,
                    timestamp: DbUtils.processTimestamp(operation.timestamp),
                    data: operation.data,
                    code: operation.code
                },true);
                break;
        }
    }

    //events

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a listener that gets triggered whenever the data changes.
     * It includes any change of data (e.g., reloads, cud Operations, sorting,
     * clear, copies from other storages, or add newly fetched data).
     * Other than the data touch event, this event will only trigger
     * if the data content is changed.
     * In some cases, it uses a deep equal algorithm, but most of the
     * time (e.g., deletions, insertions, merge), a change can be
     * detected without a complex algorithm.
     * The deep equal algorithm change detection will only be used
     * if you had registered at least one listener in this event.
     * This event is perfect for updating the user interface.
     * @param listener
     * @param combineCudSeqOperations
     * With the parameter: combineCudSeqOperations,
     * you can activate that in case of a seqEdit the event triggers
     * after all operations finished.
     * For example, you do four updates then this event triggers after all four updates.
     * If you have deactivated, then it will trigger for each updater separately.
     */
    onDataChange(listener: OnDataChange<D>,combineCudSeqOperations: boolean = true): DbStorage {
        if(combineCudSeqOperations){
            this.dataChangeCombineSeqEvent.on(listener);
        }
        else {
            this.dataChangeEvent.on(listener);
        }
        this.updateHasDataChangeListener();
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a once listener that gets triggered when the data changes.
     * It includes any change of data (e.g., reloads, cud Operations, sorting,
     * clear, copies from other storages, or add newly fetched data).
     * Other than the data touch event, this event will only trigger
     * if the data content is changed.
     * In some cases, it uses a deep equal algorithm, but most of the
     * time (e.g., deletions, insertions, merge), a change can be
     * detected without a complex algorithm.
     * The deep equal algorithm change detection will only be used
     * if you had registered at least one listener in this event.
     * This event is perfect for updating the user interface.
     * @param listener
     * @param combineCudSeqOperations
     * With the parameter: combineCudSeqOperations,
     * you can activate that in case of a seqEdit the event triggers
     * after all operations finished.
     * For example, you do four updates then this event triggers after all four updates.
     * If you have deactivated, then it will trigger for each updater separately.
     */
    onceDataChange(listener: OnDataChange<D>,combineCudSeqOperations: boolean = true): DbStorage {
        if(combineCudSeqOperations){
            this.dataChangeCombineSeqEvent.once(listener);
        }
        else {
            this.dataChangeEvent.once(listener);
        }
        this.updateHasDataChangeListener();
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Removes a listener of the dataChange event.
     * Can be a once or normal listener.
     * @param listener
     */
    offDataChange(listener: OnDataChange<any>): DbStorage {
        this.dataChangeCombineSeqEvent.off(listener);
        this.dataChangeEvent.off(listener);
        this.updateHasDataChangeListener();
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a listener that gets triggered whenever the data is touched.
     * It includes any touch of data (e.g., reloads, cud Operations, sorting,
     * clear, copies from other storages, or add newly fetched data).
     * Other than the data change event, this event will also trigger if the
     * data content is not changed.
     * For example, if you update the age with the value 20 to 20,
     * then the data touch event will be triggered but not the data change event.
     * @param listener
     */
    onDataTouch(listener: OnDataTouch<D>): DbStorage {
        this.dataTouchEvent.on(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a once listener that gets triggered when the data is touched.
     * It includes any touch of data (e.g., reloads, cud Operations, sorting,
     * clear, copies from other storages, or add newly fetched data).
     * Other than the data change event, this event will also trigger if the
     * data content is not changed.
     * For example, if you update the age with the value 20 to 20,
     * then the data touch event will be triggered but not the data change event.
     * @param listener
     */
    onceDataTouch(listener: OnDataTouch<D>): DbStorage {
        this.dataTouchEvent.once(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Removes a listener of the dataTouch event.
     * Can be a once or normal listener.
     * @param listener
     */
    offDataTouch(listener: OnDataTouch<any>): DbStorage {
        this.dataTouchEvent.off(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a listener that gets triggered whenever new data is inserted (not added).
     * @param listener
     */
    onInsert(listener: OnInsert): DbStorage {
        this.insertEvent.on(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a once listener that gets triggered when new data is inserted (not added).
     * @param listener
     */
    onceInsert(listener: OnInsert): DbStorage {
        this.insertEvent.once(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Removes a listener of the insert event.
     * Can be a once or normal listener.
     * @param listener
     */
    offInsert(listener: OnInsert): DbStorage {
        this.insertEvent.off(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a listener that gets triggered whenever data is updated.
     * This event will only trigger if the data content is changed.
     * For example, if you update the age with the value 20 to 20, this event will not occur.
     * Notice also that if you add at least one listener in this event,
     * the deep equal algorithm change detection is activated whenever an update happens.
     * @param listener
     */
    onUpdate(listener: OnUpdate): DbStorage {
        this.updateEvent.on(listener);
        this.updateHasUpdateListener();
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a once listener that gets triggered when data is updated.
     * This event will only trigger if the data content is changed.
     * For example, if you update the age with the value 20 to 20, this event will not occur.
     * Notice also that if you add at least one listener in this event,
     * the deep equal algorithm change detection is activated whenever an update happens.
     * @param listener
     */
    onceUpdate(listener: OnUpdate): DbStorage {
        this.updateEvent.once(listener);
        this.updateHasUpdateListener();
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Removes a listener of the update event.
     * Can be a once or normal listener.
     * @param listener
     */
    offUpdate(listener: OnUpdate): DbStorage {
        this.updateEvent.off(listener);
        this.updateHasUpdateListener();
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a listener that gets triggered whenever data is deleted.
     * @param listener
     */
    onDelete(listener: OnDelete): DbStorage {
        this.deleteEvent.on(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a once listener that gets triggered when data is deleted.
     * @param listener
     */
    onceDelete(listener: OnDelete): DbStorage {
        this.deleteEvent.once(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Removes a listener of the delete event.
     * Can be a once or normal listener.
     * @param listener
     */
    offDelete(listener: OnDelete): DbStorage {
        this.deleteEvent.off(listener);
        return this;
    }

    /**
     * Cast a value to an instance of this class.
     * That can be useful if you are programming in javascript,
     * but the IDE can interpret the typescript information of this library.
     * @param value
     */
    static cast(value: any): DbStorage {
        return value as DbStorage;
    }
}