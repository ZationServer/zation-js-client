/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {IfContainsOption, InfoOption, TimestampOption}  from "../dbDefinitions";
import ObjectUtils                                      from "../../utils/objectUtils";
import DbsHead                                          from "./components/dbsHead";
import CloneUtils                                       from "../../utils/cloneUtils";
import DbUtils                                          from "../dbUtils";
import {DbsComparator}                                  from "./dbsComparator";
import {DbsValueMerger}                                 from "./dbsMergerUtils";
import DbsComponent, {DbsComponentOptions, ModifyLevel} from "./components/dbsComponent";
import EventManager                                     from "../../utils/eventManager";
import {deepEqual}                                      from "../../utils/deepEqual";

type ClearOnCloseMiddleware = (code : number | string | undefined,data : any) => boolean;
type ClearOnKickOutMiddleware = (code : number | string | undefined,data : any) => boolean;
type ReloadMiddleware = (reloadData : DbStorage) => boolean;
type InsertMiddleware = (keyPath : string[], value : any,options : IfContainsOption & InfoOption & TimestampOption) => boolean;
type UpdateMiddleware = (keyPath : string[], value : any,options : InfoOption & TimestampOption) => boolean;
type DeleteMiddleware = (keyPath : string[], options : InfoOption & TimestampOption) => boolean;
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
export type OnInsert = (keyPath : string[], value : any,options : IfContainsOption & InfoOption & TimestampOption) => void | Promise<void>;
export type OnUpdate = (keyPath : string[], value : any,options : InfoOption & TimestampOption) => void | Promise<void>;
export type OnDelete = (keyPath : string[], options : InfoOption & TimestampOption) => void | Promise<void>;

export default class DbStorage {

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
    private compOptionsConstraint : Map<string,{k : string[],o : DbsComponentOptions}> = new Map();

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
        ObjectUtils.addObToOb(this.dbStorageOptions,options,false);

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
        for (let {k,o} of this.compOptionsConstraint.values()){
            const comp = this.dbsHead.getDbsComponent(k);
            if(comp){
                if(o.valueMerger){
                    comp.setValueMerger(o.valueMerger);
                    setMergerComp.push(comp);
                }
                if(o.comparator){
                    dataChanged = dataChanged || comp.setComparator(o.comparator);
                    setComparatorComp.push(comp);
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

    private setCompOption(func : (option : DbsComponentOptions) => void, keyPath ?: string | string[]){
        if(keyPath !== undefined){
            keyPath = DbUtils.handleKeyPath(keyPath);
            const key = keyPath.join();
            const constraint = this.compOptionsConstraint.get(key);
            if(constraint){
                func(constraint.o);
            }
            else {
                const options = {};
                func(options);
                this.compOptionsConstraint.set(key,{k : keyPath,o : options})
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
     * Without ifContains (ifContains exists):
     * Base (with keyPath [] or '') -> Nothing
     * KeyArray -> Inserts the value at the end with the key
     * (if the key does not exist). But if you are using a compare function,
     * it will insert the value in the correct position.
     * Object -> Inserts the value with the key (if the key does not exist).
     * Array -> Key will be parsed to int if it is a number then it will be inserted at the index.
     * Otherwise, it will be added at the end.
     * With ifContains (ifContains exists):
     * Base (with keyPath [] or '') -> Nothing
     * KeyArray -> Inserts the value before the ifContains element with the key
     * (if the key does not exist). But if you are using a compare function,
     * it will insert the value in the correct position.
     * Object -> Inserts the value with the key (if the key does not exist).
     * Array -> Key will be parsed to int if it is a number then it will be inserted at the index.
     * Otherwise, it will be added at the end.
     * @param keyPath
     * The keyPath can be a string array or a
     * string where you can separate the keys with a dot.
     * @param value
     * @param options
     */
    insert(keyPath : string[] | string, value : any,options : IfContainsOption & InfoOption & TimestampOption = {}) : DbStorage {
        keyPath = DbUtils.handleKeyPath(keyPath);
        options.timestamp = DbUtils.processTimestamp(options.timestamp);
        const {timestamp,ifContains} = options;
        if(this.insertMiddleware(keyPath,value,options) && this.dbsHead.insert(keyPath,value,timestamp,ifContains)){
            this.updateCompOptions();
            this.tmpCudInserted = true;
            this.insertEvent.emit(keyPath,value,options);
            this.dataTouchEvent.emit([DataEventReason.INSERTED],this);
            this.dataChangeEvent.emit([DataEventReason.INSERTED],this);
            if(!this.cudSeqEditActive){
                this.dataChangeCombineSeqEvent.emit([DataEventReason.INSERTED],this);
            }
        }
        return this;
    }

    /**
     * Do an update operation.
     * This method is used internally.
     * Notice if you do a cud operation locally on the client,
     * that this operation is not done on the server-side.
     * So if the Databox reloads the data or resets the changes are lost.
     * Update behavior:
     * Base (with keyPath [] or '') -> Updates the complete structure.
     * KeyArray -> Updates the specific value (if the key does exist).
     * Object -> Updates the specific value (if the key does exist).
     * Array -> Key will be parsed to int if it is a number it will
     * update the specific value (if the index exist).
     * @param keyPath
     * The keyPath can be a string array or a
     * string where you can separate the keys with a dot.
     * @param value
     * @param options
     */
    update(keyPath : string[] | string, value : any,options : InfoOption & TimestampOption = {}) : DbStorage {
        keyPath = DbUtils.handleKeyPath(keyPath);
        options.timestamp = DbUtils.processTimestamp(options.timestamp);
        const {timestamp} = options;
        if(this.updateMiddleware(keyPath,value,options)){
            const ml = this.dbsHead.update(keyPath,value,timestamp, (this.hasDataChangeListener || this.hasUpdateListener));
            if(ml > 0){
                this.updateCompOptions();
                this.dataTouchEvent.emit([DataEventReason.UPDATED],this);
            }
            if(ml === ModifyLevel.DATA_CHANGED){
                this.tmpCudUpdated = true;
                this.updateEvent.emit(keyPath,value,options);
                this.dataChangeEvent.emit([DataEventReason.UPDATED],this);
                if(!this.cudSeqEditActive){
                    this.dataChangeCombineSeqEvent.emit([DataEventReason.UPDATED],this);
                }
            }
        }
        return this;
    }

    /**
     * Do an delete operation
     * This method is used internally.
     * Notice if you do a cud operation locally on the client,
     * that this operation is not done on the server-side.
     * So if the Databox reloads the data or resets the changes are lost.
     * Delete behavior:
     * Base (with keyPath [] or '') -> Deletes the complete structure.
     * KeyArray -> Deletes the specific value (if the key does exist).
     * Object -> Deletes the specific value (if the key does exist).
     * Array -> Key will be parsed to int if it is a number it will delete the
     * specific value (if the index does exist). Otherwise, it will delete the last item.
     * @param keyPath
     * The keyPath can be a string array or a
     * string where you can separate the keys with a dot.
     * @param options
     */
    delete(keyPath : string[] | string,options : InfoOption & TimestampOption = {}) : DbStorage {
        keyPath = DbUtils.handleKeyPath(keyPath);
        options.timestamp = DbUtils.processTimestamp(options.timestamp);
        const {timestamp} = options;
        if(this.deleteMiddleware(keyPath,options) && this.dbsHead.delete(keyPath,timestamp)){
            this.updateCompOptions();
            this.tmpCudDeleted = true;
            this.deleteEvent.emit(keyPath,options);
            this.dataTouchEvent.emit([DataEventReason.DELETED],this);
            this.dataChangeEvent.emit([DataEventReason.DELETED],this);
            if(!this.cudSeqEditActive){
                this.dataChangeCombineSeqEvent.emit([DataEventReason.DELETED],this);
            }
        }
        return this;
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
}