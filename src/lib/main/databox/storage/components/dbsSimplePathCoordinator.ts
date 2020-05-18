/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import DbsComponent  from "./dbsComponent";
import forint        from "forint";
import {ModifyToken} from "./modifyToken";
import {
    DbProcessedSelector,
    DbProcessedSelectorItem,
    ForintSearchQuery,
    IfOptionProcessArgsValue,
    IfQuery,
    InsertProcessArgs,
    UpdateProcessArgs,
    DeleteProcessArgs, IfQueryType
} from "../../dbDefinitions";

export default abstract class DbsSimplePathCoordinator {

    /**
     * Returns the data.
     */
    abstract getData(): any;

    /**
     * Returns all keys.
     * @private
     */
    abstract _getAllKeys(): string[];

    /**
     * Returns the data value of the key.
     * @param key
     * @private
     */
    abstract _getValue(key: string): any;

    /**
     * Returns the dbs component on this
     * key or undefined if it not exists.
     * @param key
     */
    abstract _getDbsComponent(key: string): DbsComponent | undefined;

    queryForEachKey(forintQuery: ForintSearchQuery, func: (key: string) => void): void {
        const keysTmp = this._getAllKeys();
        const keysLegth = keysTmp.length;
        const keyQuery = forintQuery.k;
        const valueQuery = forintQuery.v;
        if(keyQuery || valueQuery){
            const keyQueryFunc = keyQuery ? forint(keyQuery): undefined;
            const valueQueryFunc = valueQuery ? forint(valueQuery): undefined;
            let tmpKey;
            for(let i = 0; i < keysLegth; i++){
                tmpKey = keysTmp[i];
                if((!keyQueryFunc || keyQueryFunc(tmpKey)) && (!valueQueryFunc || valueQueryFunc(this._getValue(tmpKey)))) {
                    func(tmpKey);
                }
            }
        }
        else {
            for(let i = 0; i < keysLegth; i++){func(keysTmp[i]);}
        }
    }

    checkIfConditions(ifOption: IfOptionProcessArgsValue): boolean {
        if(typeof ifOption === 'boolean') return ifOption;

        //key information
        let loadedKeysInformation = false;
        let keysTmp;
        let keysLength;
        let keyExists;

        const queriesLength = ifOption.length;
        let tmpRes;
        let tmpMatch;
        let tmpQuery: IfQuery;
        let tmpKeyQuery;
        let tmpKeyQueryFunc;
        let tmpValueQuery;
        let tmpValueQueryFunc;
        for(let i = 0; i < queriesLength; i++) {
            //query
            tmpQuery = ifOption[i];
            switch (tmpQuery.t) {
                case IfQueryType.full:
                    tmpRes = forint(tmpQuery.q)(this.getData()) ? !tmpQuery.n: !!tmpQuery.n;
                    break;
                case IfQueryType.search:

                    if(!loadedKeysInformation){
                        keysTmp = this._getAllKeys();
                        keysLength = keysTmp.length;
                        keyExists = keysLength > 0;
                        loadedKeysInformation = true;
                    }

                    tmpKeyQuery = tmpQuery.q.k;
                    tmpValueQuery = tmpQuery.q.v;
                    if (tmpKeyQuery || tmpValueQuery) {
                        tmpKeyQueryFunc = tmpKeyQuery ? forint(tmpKeyQuery): undefined;
                        tmpValueQueryFunc = tmpValueQuery ? forint(tmpValueQuery): undefined;
                        tmpMatch = false;
                        let tmpKey;
                        for (let i = 0; i < keysLength; i++) {
                            //elements
                            tmpKey = keysTmp[i];
                            if ((!tmpKeyQueryFunc || tmpKeyQueryFunc(tmpKey)) && (!tmpValueQueryFunc || tmpValueQueryFunc(this._getValue(tmpKey)))) {
                                //query match
                                tmpRes = !tmpQuery.n;
                                tmpMatch = true;
                                break;
                            }
                        }
                        if(!tmpMatch){
                            //not match
                            tmpRes = !!tmpQuery.n;
                        }
                    } else {
                        //any constant
                        tmpRes = tmpQuery.n ? !keyExists: keyExists;
                    }
                    break;
                default:
                    tmpRes = false;
                    break;
            }
            if (!tmpRes) return false;
        }
        return true;
    }

    /**
     * Returns all dbsComponents with a single selector item.
     * @param selectorItem
     */
    _getDbsComponents(selectorItem: DbProcessedSelectorItem): DbsComponent[] {
        if(typeof selectorItem === 'string'){
            const component = this._getDbsComponent(selectorItem);
            if(component) return [component];
        }
        else {
            const components: DbsComponent[] = [];
            let tmpComponent;
            let i = 0;
            this.queryForEachKey(selectorItem,(k) => {
                tmpComponent = this._getDbsComponent(k);
                if(tmpComponent) {
                    components[i] = tmpComponent;
                    i++;
                }
            });
            return components;
        }
        return [];
    }

    /**
     * Returns all dbsComponents with selector.
     * @param selector
     */
    getDbsComponents(selector: DbProcessedSelector): DbsComponent[] {
        if(selector.length === 1){
            return this._getDbsComponents(selector[0]);
        }
        else if(selector.length > 1){
            const nextComponents = this._getDbsComponents(selector[0]);
            selector.shift();
            const res: DbsComponent[] = [];
            const len = nextComponents.length;
            const cloneSelector = len > 1;
            for(let i = 0; i < len; i++) res.push(...(nextComponents[i] as DbsComponent)
                .getDbsComponents(cloneSelector ? [...selector] : selector));
            return res;
        }
        return [];
    }

    /**
     * The insert process.
     * @return if the action was fully executed. (Data changed)
     * @param key
     * @param value
     * @param args
     * @param mt
     * @private
     */
    abstract _insert(key: string, value: any, args: InsertProcessArgs, mt: ModifyToken): void;

    /**
     * Insert coordinator.
     * @return if the action was fully executed. (Data changed)
     * @param selector
     * @param value
     * @param args
     * @param mt
     */
    insert(selector: DbProcessedSelector, value: any, args: InsertProcessArgs, mt: ModifyToken): void
    {
        if(selector.length === 1){
            if(typeof selector[0] === 'string'){
                this._insert(selector[0] as string,value,args,mt);
            }
            else {
                //can be used as a update with PotentialUpdate
                this.queryForEachKey(selector[0] as ForintSearchQuery,(k) =>
                    this._insert(k,value,args,mt));
            }
        }
        else if(selector.length > 1){
            const nextComponents = this._getDbsComponents(selector[0]);
            selector.shift();
            const len = nextComponents.length;
            const cloneSelector = len > 1;
            //Clone args because if conditions result can only be prepared for one element.
            const cloneArgs = cloneSelector && args.if !== undefined;
            for(let i = 0; i < len; i++) {
                (nextComponents[i] as DbsComponent).insert(cloneSelector ? [...selector] : selector,
                    value,cloneArgs ? {...args}: args,mt);
            }
        }
    }

    /**
     * The update process.
     * @return the modify level.
     * @param key
     * @param value
     * @param args
     * @param mt
     * @private
     */
    abstract _update(key: string, value: any, args: UpdateProcessArgs, mt: ModifyToken): void;

    /**
     * Update coordinator.
     * @return the modify level.
     * @param selector
     * @param value
     * @param args
     * @param mt
     */
    update(selector: DbProcessedSelector, value: any, args: UpdateProcessArgs, mt: ModifyToken): void
    {
        if(selector.length === 1){
            if(typeof selector[0] === 'string'){
                this._update(selector[0] as string,value,args,mt);
            }
            else {
                this.queryForEachKey(selector[0] as ForintSearchQuery,(k) =>
                    this._update(k,value,args,mt));
            }
        }
        else if(selector.length > 1){
            const nextComponents = this._getDbsComponents(selector[0]);
            selector.shift();
            const len = nextComponents.length;
            const cloneSelector = len > 1;
            //Clone args because if conditions result can only be prepared for one element.
            const cloneArgs = cloneSelector && args.if !== undefined;
            for(let i = 0; i < len; i++) {
                (nextComponents[i] as DbsComponent).update(cloneSelector ? [...selector] : selector,
                    value,cloneArgs ? {...args}: args,mt);
            }
        }
    }

    /**
     * The delete process.
     * @return if the action was fully executed. (Data changed)
     * @param key
     * @param args
     * @param mt
     * @private
     */
    abstract _delete(key: string, args: DeleteProcessArgs, mt: ModifyToken): void;

    /**
     * Delete coordinator.
     * @return if the action was fully executed. (Data changed)
     * @param selector
     * @param args
     * @param mt
     */
    delete(selector: DbProcessedSelector, args: DeleteProcessArgs, mt: ModifyToken): void {
        if(selector.length === 1){
            if(typeof selector[0] === 'string'){
                this._delete(selector[0] as string,args,mt);
            }
            else {
                this.queryForEachKey(selector[0] as ForintSearchQuery,(k) =>
                    this._delete(k,args,mt));
            }
        }
        else if(selector.length > 1){
            const nextComponents = this._getDbsComponents(selector[0]);
            selector.shift();
            const len = nextComponents.length;
            const cloneSelector = len > 1;
            //Clone args because if conditions result can only be prepared for one element.
            const cloneArgs = cloneSelector && args.if !== undefined;
            for(let i = 0; i < len; i++){
                (nextComponents[i] as DbsComponent).delete(cloneSelector ? [...selector] : selector,
                    cloneArgs ? {...args}: args,mt);
            }
        }
    }

}