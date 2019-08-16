/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import DbsComponent from "./dbsComponent";

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
     * @param key
     * @param value
     * @param timestamp
     * @param ifContains
     * @private
     */
    abstract _insert(key : string, value : any, timestamp : number,ifContains ?: string) : void

    /**
     * Insert coordinator.
     * @param keyPath
     * @param value
     * @param timestamp
     * @param ifContains
     */
    insert(keyPath : string[], value : any, timestamp : number,ifContains ?: string): void {
        if(keyPath.length === 1){
            this._insert(keyPath[0],value,timestamp,ifContains);
        }
        else if(keyPath.length > 1){
            const nextComponent = this._getDbsComponent(keyPath[0]);
            if(nextComponent){
                keyPath.shift();
                (nextComponent as DbsComponent).insert(keyPath,value,timestamp,ifContains);
            }
        }
    }

    /**
     * The update process.
     * @param key
     * @param value
     * @param timestamp
     * @private
     */
    abstract _update(key : string, value : any, timestamp : number) : void;

    /**
     * Update coordinator.
     * @param keyPath
     * @param value
     * @param timestamp
     */
    update(keyPath : string[], value : any, timestamp : number): void {
        if(keyPath.length === 1){
            this._update(keyPath[0],value,timestamp);
        }
        else if(keyPath.length > 1){
            const nextComponent = this._getDbsComponent(keyPath[0]);
            if(nextComponent){
                keyPath.shift();
                (nextComponent as DbsComponent).update(keyPath,value,timestamp);
            }
        }
    }

    /**
     * The delete process.
     * @param key
     * @param timestamo
     * @private
     */
    abstract _delete(key : string, timestamo : number) : void;

    /**
     * Delete coordinator.
     * @param keyPath
     * @param timestamp
     */
    delete(keyPath : string[], timestamp : number): void {
        if(keyPath.length === 1){
            this._delete(keyPath[0],timestamp);
        }
        else if(keyPath.length > 1){
            const nextComponent = this._getDbsComponent(keyPath[0]);
            if(nextComponent){
                keyPath.shift();
                nextComponent.delete(keyPath,timestamp);
            }
        }
    }

}