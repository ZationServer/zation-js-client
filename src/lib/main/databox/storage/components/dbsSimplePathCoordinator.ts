/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import DbsComponent, {ModifyLevel} from "./dbsComponent";

export default abstract class DbsSimplePathCoordinator {

    /**
     * Returns the dbs component on this
     * key or undefined if it not exists.
     * @param key
     */
    abstract _getDbsComponent(key : string) : DbsComponent | undefined;

    /**
     * Returns the dbs component on that path.
     * @param keyPath
     */
    getDbsComponent(keyPath : string[]) : DbsComponent | undefined {
        if(keyPath.length === 1){
            return this._getDbsComponent(keyPath[0]);
        }
        else if(keyPath.length > 1){
            const nextComponent = this._getDbsComponent(keyPath[0]);
            if(nextComponent){
                keyPath.shift();
                return (nextComponent as DbsComponent).getDbsComponent(keyPath);
            }
        }
        return undefined;
    }

    /**
     * The insert process.
     * @return if the action was fully executed. (Data changed)
     * @param key
     * @param value
     * @param timestamp
     * @param ifContains
     * @private
     */
    abstract _insert(key : string, value : any, timestamp : number,ifContains ?: string) : boolean;

    /**
     * Insert coordinator.
     * @return if the action was fully executed. (Data changed)
     * @param keyPath
     * @param value
     * @param timestamp
     * @param ifContains
     */
    insert(keyPath : string[], value : any, timestamp : number,ifContains ?: string): boolean {
        if(keyPath.length === 1){
            return this._insert(keyPath[0],value,timestamp,ifContains);
        }
        else if(keyPath.length > 1){
            const nextComponent = this._getDbsComponent(keyPath[0]);
            if(nextComponent){
                keyPath.shift();
                return (nextComponent as DbsComponent).insert(keyPath,value,timestamp,ifContains);
            }
        }
        return false;
    }

    /**
     * The update process.
     * @return the modify level.
     * @param key
     * @param value
     * @param timestamp
     * @param checkDataChange
     * @private
     */
    abstract _update(key : string, value : any, timestamp : number,checkDataChange : boolean) : ModifyLevel;

    /**
     * Update coordinator.
     * @return the modify level.
     * @param keyPath
     * @param value
     * @param timestamp
     * @param checkDataChange
     */
    update(keyPath : string[], value : any, timestamp : number,checkDataChange : boolean): ModifyLevel {
        if(keyPath.length === 1){
            return this._update(keyPath[0],value,timestamp,checkDataChange);
        }
        else if(keyPath.length > 1){
            const nextComponent = this._getDbsComponent(keyPath[0]);
            if(nextComponent){
                keyPath.shift();
                return (nextComponent as DbsComponent).update(keyPath,value,timestamp,checkDataChange);
            }
        }
        return ModifyLevel.NOTHING;
    }

    /**
     * The delete process.
     * @return if the action was fully executed. (Data changed)
     * @param key
     * @param timestamo
     * @private
     */
    abstract _delete(key : string, timestamo : number) : boolean;

    /**
     * Delete coordinator.
     * @return if the action was fully executed. (Data changed)
     * @param keyPath
     * @param timestamp
     */
    delete(keyPath : string[], timestamp : number): boolean {
        if(keyPath.length === 1){
            return this._delete(keyPath[0],timestamp);
        }
        else if(keyPath.length > 1){
            const nextComponent = this._getDbsComponent(keyPath[0]);
            if(nextComponent){
                keyPath.shift();
                return nextComponent.delete(keyPath,timestamp);
            }
        }
        return false;
    }

}