/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

export interface FetchHistoryItem {
    counter : number;
    input : any;
    data ?: any;
    failed ?: boolean;
}

export default class DbFetchHistoryManager {

    private history : FetchHistoryItem[] = [];
    private returnedHistory : FetchHistoryItem[] = [];

    constructor() {}

    /**
     * Resets the complete history manager.
     */
    reset() : void {
        this.history = [];
        this.returnedHistory = [];
    }

    /**
     * Push successful information to history.
     * @param counter
     * @param input
     * @param data
     */
    pushHistorySuccess(counter : number, input : any, data : any) {
        this.history.push({counter,input,data});
    }

    /**
     * Push failed information to history.
     * @param counter
     * @param input
     */
    pushHistoryFail(counter : number,input : any) {
        this.history.push({counter,input,failed : true});
    }

    /**
     * Returns the latest history and removes it from the current history.
     * You should call commit to tell the history manager that all went good
     * or rollback to revert the latest history in the last state.
     */
    getHistory() : FetchHistoryItem[] {
        const historyTmp = this.history;
        this.history = [];

        historyTmp.sort((a,b) => a.counter - b.counter);
        this.returnedHistory = this.returnedHistory.concat(historyTmp);

        return this.optimizeHistory(historyTmp);
    }

    // noinspection JSMethodCanBeStatic
    /**
     * Optimize the history by removing the failed history items at the end.
     * @param history
     */
    private optimizeHistory(history : FetchHistoryItem[]) : FetchHistoryItem[] {
        let iteratedOverSucceededItem = false;
        const optimizeHistory : FetchHistoryItem[] = [];
        for(let i = history.length - 1; i > -1; --i) {
            if(history[i].failed){
                if(!iteratedOverSucceededItem) continue;
            }
            else iteratedOverSucceededItem = true;
            optimizeHistory.unshift(history[i]);
        }
        return optimizeHistory;
    }

    /**
     * Tells the history manager that the reload is done.
     */
    done() : void {
        this.history = this.returnedHistory.concat(this.history);
    }
}