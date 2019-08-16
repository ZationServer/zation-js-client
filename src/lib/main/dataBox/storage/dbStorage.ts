/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {IfContainsOption, InfoOption, TimestampOption} from "../dbDefinitions";
import ObjectUtils                                     from "../../utils/objectUtils";
import DbsHead                                         from "./components/dbsHead";
import CloneUtils                                      from "../../utils/cloneUtils";
import DbUtils                                         from "../dbUtils";
import {DbsComparator}                                 from "./dbsComparator";
import {DbsValueMerger}                                from "./dbsMergerUtils";
import {DbsComponentOptions}                           from "./components/dbsComponent";
import DbsComponent                                    from "./components/dbsComponent";
import EventManager                                    from "../../utils/eventManager";

type ClearOnCloseMiddleware = (code : number | string | undefined,data : any) => boolean;
type ClearOnKickOutMiddleware = (code : number | string | undefined,data : any) => boolean;
type ReloadMiddleware = (reloadData : DbStorage) => boolean;
type InsertMiddleware = (keyPath : string[], value : any,options : IfContainsOption & InfoOption & TimestampOption) => boolean;
type UpdateMiddleware = (keyPath : string[], value : any,options : InfoOption & TimestampOption) => boolean;
type DeleteMiddleware = (keyPath : string[], options : InfoOption & TimestampOption) => boolean;
type AddFetchDataMiddleware = (counter : number,fetchedData : DbsHead) => boolean;

export interface DbStorageOptions {
    /**
     * Indicates if this storage should be cleared when a connected dataBox closes.
     * You also can provide a function that decides if the storage should do the clear.
     * @default true
     */
    clearOnClose ?: ClearOnCloseMiddleware | boolean,
    /**
     * Indicates if this storage should be cleared when the socket
     * is kicked out from a connected dataBox.
     * You also can provide a function that decides if the storage should do the clear.
     * @default true
     */
    clearOnKickOut ?: ClearOnKickOutMiddleware | boolean,
    /**
     * Indicates if this storage should load complete reloaded data.
     * Can happen in the case that the socket missed some cud operations.
     * You also can provide a function that decides if the storage should do the reload.
     * @default true
     */
    doReload ?: ReloadMiddleware | boolean,
    /**
     * Indicates if this storage should do insert operations.
     * You also can provide a function that decides if the storage should do the insertion.
     * @default true
     */
    doInsert ?: InsertMiddleware | boolean,
    /**
     * Indicates if this storage should do update operations.
     * You also can provide a function that decides if the storage should do the update.
     * @default true
     */
    doUpdate ?: UpdateMiddleware | boolean,
    /**
     * Indicates if this storage should do delete operations.
     * You also can provide a function that decides if the storage should do the deletion.
     * @default true
     */
    doDelete ?: DeleteMiddleware | boolean,
    /**
     * Indicates if this storage should add fetch data to the storage.
     * You also can provide a function that decides if the storage should do it.
     * @default true
     */
    doAddFetchData ?: AddFetchDataMiddleware | boolean
}

export type OnDataChange = (storage : DbStorage) => void | Promise<void>

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

    private clearOnCloseMiddleware : ClearOnCloseMiddleware;
    private clearOnKickOutMiddleware : ClearOnKickOutMiddleware;
    private reloadMiddleware : ReloadMiddleware;
    private insertMiddleware : InsertMiddleware;
    private updateMiddleware : UpdateMiddleware;
    private deleteMiddleware : DeleteMiddleware;
    private addFetchDataMiddleware : AddFetchDataMiddleware;

    private readonly dataChangeEvent : EventManager<OnDataChange> = new EventManager<OnDataChange>();

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

    private processMiddlewareOption<T extends (...args : any[]) => boolean>(value : boolean | T) :
        (...args : any[]) => boolean
    {
        if(typeof value === 'boolean'){
            return () => value;
        }
        else {
            return value;
        }
    }

    /**
     * Gets called when the head changes.
     */
    private onHeadChange() {
        this.updateCompOptions();
        this.dataChangeEvent.emit(this);
    }

    private updateCompOptions() {
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
                    comp.setComparator(o.comparator);
                    setComparatorComp.push(comp);
                }
            }
        }

        const mainComparator = this.mainCompOptions.comparator;
        const mainValueMerger = this.mainCompOptions.valueMerger;
        if(mainComparator || mainValueMerger){
            this.dbsHead.forEachComp((c) => {
                if(mainComparator && !setComparatorComp.includes(c)){
                    c.setComparator(mainComparator);
                }
                if(mainValueMerger && !setMergerComp.includes(c)){
                    c.setValueMerger(mainValueMerger);
                }
            });
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
        this.updateCompOptions();
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
     * Returns if this storage should load complete reloaded data.
     */
    shouldReload(relodedData : DbStorage) : boolean {
        return this.reloadMiddleware(relodedData);
    }

    /**
     * Clears the storage.
     */
    clear() : DbStorage {
        this.dbsHead = new DbsHead();
        this.onHeadChange();
        return this;
    }

    /**
     * Adds new data to the storage.
     * The data will be merged with the old data.
     * @param dbsHead
     */
    addData(dbsHead : DbsHead) : DbStorage {
        this.dbsHead = this.dbsHead.meregeWithNew(dbsHead);
        this.onHeadChange();
        return this;
    }

    /**
     * Copies the data from another storage.
     * @param dbStorage
     */
    copyFrom(dbStorage : DbStorage) : DbStorage {
        this.dbsHead = CloneUtils.deepCloneInstance(dbStorage.getDbsHead());
        this.onHeadChange();
        return this;
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
     * So if the DataBox reloads the data or resets the changes are lost.
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
        if(this.insertMiddleware(keyPath,value,options)){
            this.dbsHead.insert(keyPath,value,timestamp,ifContains);
            this.onHeadChange();
        }
        return this;
    }

    /**
     * Do an update operation.
     * This method is used internally.
     * Notice if you do a cud operation locally on the client,
     * that this operation is not done on the server-side.
     * So if the DataBox reloads the data or resets the changes are lost.
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
            this.dbsHead.update(keyPath,value,timestamp);
            this.onHeadChange();
        }
        return this;
    }

    /**
     * Do an delete operation
     * This method is used internally.
     * Notice if you do a cud operation locally on the client,
     * that this operation is not done on the server-side.
     * So if the DataBox reloads the data or resets the changes are lost.
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
        if(this.deleteMiddleware(keyPath,options)){
            this.dbsHead.delete(keyPath,timestamp);
            this.onHeadChange();
        }
        return this;
    }

    //events

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a listener that gets triggered
     * whenever the data changes.
     * This includes reloads, new cud Operations,
     * new sorting, clear, copy from or fetched data.
     * @param listener
     */
    onDataChange(listener : OnDataChange) : DbStorage {
        this.dataChangeEvent.on(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Adds a once listener that gets triggered
     * when the data changes.
     * This includes reloads, new cud Operations,
     * new sorting, clear, copy from or fetched data.
     * @param listener
     */
    onceDataChange(listener : OnDataChange) : DbStorage {
        this.dataChangeEvent.once(listener);
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Removes a listener of the dataChange event.
     * Can be a once or normal listener.
     * @param listener
     */
    offDataChange(listener : OnDataChange) : DbStorage {
        this.dataChangeEvent.off(listener);
        return this;
    }

}