/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {
    DbCudProcessedSelector,
    DbCudSelector, DeleteArgs,
    IfOption,
    InfoOption, InsertArgs, PotentialInsertOption,
    PotentialUpdateOption,
    TimestampOption, UpdateArgs
} from "../dbDefinitions";
import ObjectUtils                                      from "../../utils/objectUtils";
import DbsHead                                          from "./components/dbsHead";
import CloneUtils                                       from "../../utils/cloneUtils";
import DbUtils                                          from "../dbUtils";
import {DbsComparator}                                  from "./dbsComparator";
import {DbsValueMerger}                                 from "./dbsMergerUtils";
import DbsComponent, {DbsComponentOptions, ModifyLevel} from "./components/dbsComponent";
import EventManager                                     from "../../utils/eventManager";
import {deepEqual}                                      from "../../utils/deepEqual";
import DbCudOperationSequence                           from "../dbCudOperationSequence";
import {DbEditAble}                                     from "../dbEditAble";
import {createDeleteModifyToken,
    createUpdateInsertModifyToken,
    getModifyTokenReaons} from "./components/modifyToken";

type ClearOnCloseMiddleware = (code : number | string | undefined,data : any) => boolean;
type ClearOnKickOutMiddleware = (code : number | string | undefined,data : any) => boolean;
type ReloadMiddleware = (reloadData : DbStorage) => boolean;
type InsertMiddleware = (selector : DbCudProcessedSelector, value : any,options : IfOption & InfoOption & TimestampOption) => boolean;
type UpdateMiddleware = (selector : DbCudProcessedSelector, value : any,options : InfoOption & TimestampOption) => boolean;
type DeleteMiddleware = (selector : DbCudProcessedSelector, options : InfoOption & TimestampOption) => boolean;
type AddFetchDataMiddleware = (counter : number,fetchedData : DbsHead) => boolean;

export interface DbStorageOptions {
    /**
     * Indicates if this storage should be cleared when a connected databox closes.
     * You also can provide a function that decides if the storage should do the clear.
     * @default true
     */
    clearOnClose ?: ClearOnCloseMiddleware | ClearOnCloseMiddleware[] | boolean,
    /**
     * Indicates if this storage should be cleared when the socket
     * is kicked out from a connected databox.
     * You also can provide a function that decides if the storage should do the clear.
     * @default true
     */
    clearOnKickOut ?: ClearOnKickOutMiddleware | ClearOnKickOutMiddleware[] | boolean,
    /**
     * Indicates if this storage should load complete reloaded data.
     * Can happen in the case that the socket missed some cud operations.
     * You also can provide a function that decides if the storage should do the reload.
     * @default true
     */
    doReload ?: ReloadMiddleware | ReloadMiddleware[] | boolean,
    /**
     * Indicates if this storage should do insert operations.
     * You also can provide a function that decides if the storage should do the insertion.
     * @default true
     */
    doInsert ?: InsertMiddleware | InsertMiddleware[] | boolean,
    /**
     * Indicates if this storage should do update operations.
     * You also can provide a function that decides if the storage should do the update.
     * @default true
     */
    doUpdate ?: UpdateMiddleware | UpdateMiddleware[] | boolean,
    /**
     * Indicates if this storage should do delete operations.
     * You also can provide a function that decides if the storage should do the deletion.
     * @default true
     */
    doDelete ?: DeleteMiddleware | DeleteMiddleware[] | boolean,
    /**
     * Indicates if this storage should add fetch data to the storage.
     * You also can provide a function that decides if the storage should do it.
     * @default true
     */
    doAddFetchData ?: AddFetchDataMiddleware | AddFetchDataMiddleware[] | boolean
}

export const enum DataEventReason {
    INSERTED,
    UPDATED,
    DELETED,
    SORTED,
    RELOADED,
    ADDED,
    CLEARED,
    COPIED
}

export type OnDataChange = (reasons : DataEventReason[],storage : DbStorage) => void | Promise<void>;
export type OnDataTouch = (reasons : DataEventReason[],storage : DbStorage) => void | Promise<void>;
export type OnInsert = (selector : DbCudProcessedSelector, value : any,options : IfOption & InfoOption & TimestampOption) => void | Promise<void>;
export type OnUpdate = (selector : DbCudProcessedSelector, value : any,options : InfoOption & TimestampOption) => void | Promise<void>;
export type OnDelete = (selector : DbCudProcessedSelector, options : InfoOption & TimestampOption) => void | Promise<void>;

export default class DbStorage implements DbEditAble {

    private dbStorageOptions : Required<DbStorageOptions> = {
        clearOnClose : true,
        clearOnKickOut : true,
        doReload : true,
        doInsert : true,
        doUpdate : true,
        doDelete : true,
        doAddFetchData : true
    };

    private dbsHead : DbsHead = new DbsHead();
    private mainCompOptions: DbsComponentOptions = {};
    private compOptionsConstraint : Map<string,{s : DbCudProcessedSelector,o : DbsComponentOptions}> = new Map();

    private cudSeqEditActive : boolean = false;
    private tmpCudInserted : boolean = false;
    private tmpCudUpdated : boolean = false;
    private tmpCudDeleted : boolean = false;

    private hasDataChangeListener : boolean = false;

    private clearOnCloseMiddleware : ClearOnCloseMiddleware;
    private clearOnKickOutMiddleware : ClearOnKickOutMiddleware;
    private reloadMiddleware : ReloadMiddleware;
    private insertMiddleware : InsertMiddleware;
    private updateMiddleware : UpdateMiddleware;
    private deleteMiddleware : DeleteMiddleware;
    private addFetchDataMiddleware : AddFetchDataMiddleware;

    private readonly dataChangeEvent : EventManager<OnDataChange> = new EventManager<OnDataChange>();
    private readonly dataChangeCombineSeqEvent : EventManager<OnDataChange> = new EventManager<OnDataChange>();
    private readonly dataTouchEvent : EventManager<OnDataTouch> = new EventManager<OnDataTouch>();

    private readonly insertEvent : EventManager<OnInsert> = new EventManager<OnInsert>();
    private readonly updateEvent : EventManager<OnUpdate> = new EventManager<OnUpdate>();
    private hasUpdateListener : boolean = false;
    private readonly deleteEvent : EventManager<OnDelete> = new EventManager<OnDelete>();

    constructor(options : DbStorageOptions = {},dbStorage ?: DbStorage) {
        ObjectUtils.addObToOb(this.dbStorageOptions,options,true);

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

    private processMiddlewareOption<T extends (...args : any[]) => boolean>(value : boolean | T | T[]) :
        (...args : any[]) => boolean
    {
        if(typeof value === 'boolean'){
            return () => value;
        }
        else if(Array.isArray(value)){
            return (...args : any[]) => {
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

    private updateCompOptions(triggerDataEvents : boolean = false) {
        let dataChanged = false;
        const setMergerComp : DbsComponent[] = [];
        const setComparatorComp : DbsComponent[] = [];
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
            this.dataTouchEvent.emit([DataEventReason.SORTED],this);
            this.dataChangeEvent.emit([DataEventReason.SORTED],this);
            this.dataChangeCombineSeqEvent.emit([DataEventReason.SORTED],this);
        }
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Sets a value merger.
     * The valueMerger is used when the component needs to merge two values.
     * These values can be anything except an object or array.
     * You can provide a specific keyPath to the component.
     * The keyPath can be a string array or a string where you can
     * separate the keys with a dot.
     * If you don't provide a keyPath, the merger will be set for all components.
     * The storage will automatically update the component options, in case of new data.
     * @example
     * setValueMerger((oldValue,newValue) => {
     *     if(typeof oldValue === 'string' && typeof newValue === 'string'){
     *         return oldValue + newValue;
     *     }
     *     return newValue;
     * });
     * @param valueMerger
     * @param keyPath
     */
    setValueMerger(valueMerger : DbsValueMerger, keyPath ?: string | string[]) : DbStorage {
        this.setCompOption((option) => option.valueMerger = valueMerger,keyPath);
        this.updateCompOptions();
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Sets a Comparator.
     * The comparator can only be set on KeyArrays.
     * It will be used to sort the array and insert new data in the correct position.
     * But if you provide a comparator the insert, update and
     * merge processes need much more performance.
     * You can provide a specific keyPath to the component.
     * The keyPath can be a string array or a string where you can
     * separate the keys with a dot.
     * If you don't provide a keyPath, the merger will be set for all components.
     * The storage will automatically update the component options, in case of new data.
     * @example
     * setComparator((a,b) => a.time - b.time,[]);
     * @param comparator
     * @param keyPath
     */
    setComparator(comparator : DbsComparator, keyPath ?: string | string[]) : DbStorage {
        this.setCompOption((option) => option.comparator = comparator,keyPath);
        this.updateCompOptions(true);
        return this;
    }

    private setCompOption(func : (option : DbsComponentOptions) => void, selector ?: DbCudSelector){
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
                this.compOptionsConstraint.set(key,{s : DbUtils.processSelector(selector),o : options})
            }
        }
        else {
            func(this.mainCompOptions);
        }
    }

    /**
     * Returns the current DbsHead.
     */
    getDbsHead() : DbsHead {
        return this.dbsHead;
    }

    /**
     * Returns if the storage should be cleared on close.
     */
    shouldClearOnClose(code : number | string | undefined,data : any) : boolean {
        return this.clearOnCloseMiddleware(code,data);
    }

    /**
     * Returns if the storage should be cleared on kick out.
     */
    shouldClearOnKickOut(code : number | string | undefined,data : any) : boolean {
        return this.clearOnKickOutMiddleware(code,data);
    }

    /**
     * Returns if newly fetched data should be added to the storage.
     */
    shouldAddFetchData(counter : number,fetchedData : DbsHead) : boolean {
        return this.addFetchDataMiddleware(counter,fetchedData);
    }

    /**
     * Reloads the data.
     */
    reload(relodedData : DbStorage) : DbStorage {
        if(this.reloadMiddleware(relodedData)){
            this._copyFrom(relodedData,true);
        }
        return this;
    }

    /**
     * Clears the storage.
     */
    clear() : DbStorage {
        const tmpOldHead = this.dbsHead;
        this.dbsHead = new DbsHead();
        this.updateCompOptions();
        this.dataTouchEvent.emit([DataEventReason.CLEARED],this);
        if(this.hasDataChangeListener && !deepEqual(tmpOldHead.getData(),this.dbsHead.getData())){
            this.dataChangeEvent.emit([DataEventReason.CLEARED],this);
            this.dataChangeCombineSeqEvent.emit([DataEventReason.CLEARED],this);
        }
        return this;
    }

    /**
     * Adds new data to the storage.
     * The data will be merged with the old data.
     * @param dbsHead
     */
    addData(dbsHead : DbsHead) : DbStorage {
        const {mergedValue,dataChanged} = this.dbsHead.meregeWithNew(dbsHead);
        this.dbsHead = mergedValue;
        if(dataChanged){
            this.updateCompOptions();
            this.dataTouchEvent.emit([DataEventReason.ADDED],this);
            this.dataChangeEvent.emit([DataEventReason.ADDED],this);
            this.dataChangeCombineSeqEvent.emit([DataEventReason.ADDED],this);
        }
        return this;
    }

    /**
     * Copies the data from another storage.
     * @param dbStorage
     */
    copyFrom(dbStorage : DbStorage) : DbStorage {
        this._copyFrom(dbStorage,false);
        return this;
    }

    private _copyFrom(dbStorage : DbStorage,isReload : boolean) : void {
        const tmpOldHead = this.dbsHead;
        this.dbsHead = CloneUtils.deepCloneInstance(dbStorage.getDbsHead());
        this.updateCompOptions();

        const reason : DataEventReason = isReload ?
            DataEventReason.RELOADED : DataEventReason.COPIED;

        this.dataTouchEvent.emit([reason],this);
        if(this.hasDataChangeListener && !deepEqual(tmpOldHead.getData(),this.dbsHead.getData())){
            this.dataChangeEvent.emit([reason],this);
            this.dataChangeCombineSeqEvent.emit([reason],this);
        }
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns the current data of this storage.
     * @param directAccess
     * The direct access is dangerous if you modify something on the data,
     * it can break the whole storage.
     * The only advantage is that it is faster because the
     * storage doesn't need to create a copy from the entire structure.
     * You can use it if you need extreme performance.
     * But you need to be careful that you only read from the data.
     */
    getData<T = any>(directAccess : boolean = false) : T {
        if(directAccess){
            return this.dbsHead.getData();
        }
        else {
            return this.dbsHead.getDataCopy();
        }
    }

    /**
     * Do an insert operation.
     * This method is used internally.
     * Notice if you do a cud operation locally on the client,
     * that this operation is not done on the server-side.
     * So if the Databox reloads the data or resets the changes are lost.
     * Insert behavior:
     * Notice that in every case, the insert only happens when the key
     * does not exist on the client.
     * Otherwise, the client will ignore or convert it to an
     * update when potentialUpdate is active.
     * Another condition is that the timeout is newer than the existing timeout.
     * Without ifContains:
     * Head (with selector [] or '') -> Inserts the value.
     * KeyArray -> Inserts the value at the end with the key.
     * But if you are using a compare function, it will insert the value in the correct position.
     * Object -> Insert the value with the key.
     * Array -> Key will be parsed to int if it is a number, then it will be inserted at the index.
     * Otherwise, it will be inserted at the end.
     * With ifContains (At least one matching element otherwise the client will ignore):
     * Head (with selector [] or '') -> Inserts the value.
     * KeyArray -> Inserts the value before the first matching ifContains element with the key.
     * But if you are using a compare function, it will insert the value in the correct position.
     * Object -> Insert the value with the key.
     * Array -> Key will be parsed to int if it is a number, then it will be inserted at the index.
     * Otherwise, it will be added at the end.
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
     */
    insert(selector : DbCudSelector, value : any,options : IfOption & PotentialUpdateOption & InfoOption & TimestampOption = {}) : DbStorage {
        options.timestamp = DbUtils.processTimestamp(options.timestamp);
        this._insert(DbUtils.processSelector(selector),value,options as (InsertArgs & InfoOption));
        return this;
    }

    /**
     * Internal used insert method.
     * Please use the normal method without a pre underscore.
     * @param selector
     * @param value
     * @param options
     * @private
     */
    _insert(selector : DbCudProcessedSelector, value : any,options : InsertArgs & InfoOption) : void {
        if(this.insertMiddleware(selector,value,options)) {
            const mt = createUpdateInsertModifyToken(this.hasDataChangeListener || this.hasUpdateListener);

            this.dbsHead.insert(selector,value,options,mt);

            let reasons;
            if(mt.level > 0){
                this.updateCompOptions();
                reasons = getModifyTokenReaons(mt,DataEventReason.INSERTED,DataEventReason.UPDATED);
                this.dataTouchEvent.emit([...reasons],this);
            }
            if(mt.level === ModifyLevel.DATA_CHANGED){
                this.tmpCudInserted = true;
                this.insertEvent.emit(selector,value,options);
                this._triggerChangeEvents(reasons);
            }
        }
    }

    /**
     * Do an update operation.
     * This method is used internally.
     * Notice if you do a cud operation locally on the client,
     * that this operation is not done on the server-side.
     * So if the Databox reloads the data or resets the changes are lost.
     * Update behavior:
     * Base (with selector [] or '') -> Updates the complete structure.
     * KeyArray -> Updates the specific value (if the key does exist).
     * Object -> Updates the specific value (if the key does exist).
     * Array -> Key will be parsed to int if it is a number it will
     * update the specific value (if the index exist).
     * @param selector
     * The selector can be a direct key-path,
     * can contain filter queries (by using the forint library)
     * or it can select all items with '*'.
     * If you use a string as a param type,
     * you need to notice that it will be split into a path by dots.
     * All numeric values will be converted to a string because the key can only be a string.
     * @param value
     * @param options
     */
    update(selector : DbCudSelector, value : any,options : IfOption & PotentialInsertOption & InfoOption & TimestampOption = {}) : DbStorage {
        options.timestamp = DbUtils.processTimestamp(options.timestamp);
        this._update(DbUtils.processSelector(selector),value,options as (UpdateArgs & InfoOption));
        return this;
    }

    /**
     * Internal used update method.
     * Please use the normal method without a pre underscore.
     * @param selector
     * @param value
     * @param options
     * @private
     */
    _update(selector : DbCudProcessedSelector, value : any,options : UpdateArgs & InfoOption) : void {
        if(this.updateMiddleware(selector,value,options)){
            const mt = createUpdateInsertModifyToken(this.hasDataChangeListener || this.hasUpdateListener);

            this.dbsHead.update(selector,value,options,mt);

            let reasons;
            if(mt.level > 0){
                this.updateCompOptions();
                reasons = getModifyTokenReaons(mt,DataEventReason.UPDATED,DataEventReason.INSERTED);
                this.dataTouchEvent.emit([...reasons],this);
            }
            // noinspection DuplicatedCode
            if(mt.level === ModifyLevel.DATA_CHANGED){
                this.tmpCudUpdated = true;
                this.updateEvent.emit(selector,value,options);
                this._triggerChangeEvents(reasons);
            }
        }
    }

    /**
     * Do an delete operation
     * This method is used internally.
     * Notice if you do a cud operation locally on the client,
     * that this operation is not done on the server-side.
     * So if the Databox reloads the data or resets the changes are lost.
     * Delete behavior:
     * Base (with selector [] or '') -> Deletes the complete structure.
     * KeyArray -> Deletes the specific value (if the key does exist).
     * Object -> Deletes the specific value (if the key does exist).
     * Array -> Key will be parsed to int if it is a number it will delete the
     * specific value (if the index does exist). Otherwise, it will delete the last item.
     * @param selector
     * The selector can be a direct key-path,
     * can contain filter queries (by using the forint library)
     * or it can select all items with '*'.
     * If you use a string as a param type,
     * you need to notice that it will be split into a path by dots.
     * All numeric values will be converted to a string because the key can only be a string.
     * @param options
     */
    delete(selector : DbCudSelector,options : IfOption & InfoOption & TimestampOption = {}) : DbStorage {
        options.timestamp = DbUtils.processTimestamp(options.timestamp);
        this._delete(DbUtils.processSelector(selector),options as (DeleteArgs & InfoOption));
        return this;
    }

    /**
     * Internal used delete method.
     * Please use the normal method without a pre underscore.
     * @param selector
     * @param options
     * @private
     */
    _delete(selector : DbCudProcessedSelector,options : DeleteArgs & InfoOption) : void {
        if(this.deleteMiddleware(selector,options)){
            const mt = createDeleteModifyToken();
            this.dbsHead.delete(selector,options,mt);

            if(mt.level > 0) {
                this.updateCompOptions();
                this.tmpCudDeleted = true;
                this.deleteEvent.emit(selector,options);
                this.dataTouchEvent.emit([DataEventReason.DELETED],this);
                this._triggerChangeEvents([DataEventReason.DELETED]);
            }
        }
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Sequence edit.
     * Notice if you do a cud operation locally on the client,
     * that this operation is not done on the server-side.
     * So if the Databox reloads the data or resets the changes are lost.
     * @param timestamp
     * With the timestamp option, you can change the sequence of data.
     * The storage, for example, will only update data that is older as incoming data.
     * Use this option only if you know what you are doing.
     */
    seqEdit(timestamp ?: number) : DbCudOperationSequence {
        timestamp = DbUtils.processTimestamp(timestamp);
        return new DbCudOperationSequence( (operations) => {
            this.startCudSeq();
            DbUtils.processOpertions(this,operations,timestamp);
            this.endCudSeq();
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
        const reasons : DataEventReason[] = [];
        if(this.tmpCudInserted){reasons.push(DataEventReason.INSERTED);}
        if(this.tmpCudUpdated){reasons.push(DataEventReason.UPDATED);}
        if(this.tmpCudDeleted){reasons.push(DataEventReason.DELETED);}

        if(reasons.length > 0){
            this.dataChangeCombineSeqEvent.emit(reasons,this);
        }
        this.cudSeqEditActive = false;
    }

    private updateHasDataChangeListener() : void {
        this.hasDataChangeListener = this.dataChangeEvent.hasListener() ||
            this.dataChangeCombineSeqEvent.hasListener()
    }

    private updateHasUpdateListener() : void {
        this.hasUpdateListener = this.updateEvent.hasListener();
    }

    private _triggerChangeEvents(reasons : DataEventReason[]) {
        this.dataChangeEvent.emit([...reasons],this);
        if(!this.cudSeqEditActive){
            this.dataChangeCombineSeqEvent.emit([...reasons],this);
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
    onDataChange(listener : OnDataChange,combineCudSeqOperations : boolean = true) : DbStorage {
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
    onceDataChange(listener : OnDataChange,combineCudSeqOperations : boolean = true) : DbStorage {
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
    offDataChange(listener : OnDataChange) : DbStorage {
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
    onDataTouch(listener : OnDataTouch) : DbStorage {
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
    onceDataTouch(listener : OnDataTouch) : DbStorage {
        this.dataTouchEvent.once(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Removes a listener of the dataTouch event.
     * Can be a once or normal listener.
     * @param listener
     */
    offDataTouch(listener : OnDataTouch) : DbStorage {
        this.dataTouchEvent.off(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a listener that gets triggered whenever new data is inserted (not added).
     * @param listener
     */
    onInsert(listener : OnInsert) : DbStorage {
        this.insertEvent.on(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a once listener that gets triggered when new data is inserted (not added).
     * @param listener
     */
    onceInsert(listener : OnInsert) : DbStorage {
        this.insertEvent.once(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Removes a listener of the insert event.
     * Can be a once or normal listener.
     * @param listener
     */
    offInsert(listener : OnInsert) : DbStorage {
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
    onUpdate(listener : OnUpdate) : DbStorage {
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
    onceUpdate(listener : OnUpdate) : DbStorage {
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
    offUpdate(listener : OnUpdate) : DbStorage {
        this.updateEvent.off(listener);
        this.updateHasUpdateListener();
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a listener that gets triggered whenever data is deleted.
     * @param listener
     */
    onDelete(listener : OnDelete) : DbStorage {
        this.deleteEvent.on(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a once listener that gets triggered when data is deleted.
     * @param listener
     */
    onceDelete(listener : OnDelete) : DbStorage {
        this.deleteEvent.once(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Removes a listener of the delete event.
     * Can be a once or normal listener.
     * @param listener
     */
    offDelete(listener : OnDelete) : DbStorage {
        this.deleteEvent.off(listener);
        return this;
    }

    /**
     * Cast a value to an instance of this class.
     * That can be useful if you are programming in javascript,
     * but the IDE can interpret the typescript information of this library.
     * @param value
     */
    static cast(value : any) : DbStorage {
        return value as DbStorage;
    }
}