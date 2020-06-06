/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

export interface FetchHistoryItem {
    counter: number;
    input: any;
    data: any;
}

export default class DbFetchHistoryManager {

    private history: FetchHistoryItem[] = [];
    private returnedHistory: FetchHistoryItem[] = [];

    constructor() {}

    /**
     * Resets the complete history manager.
     */
    reset(): void {
        this.history = [];
        this.returnedHistory = [];
    }

    /**
     * Push information to history.
     * @param counter
     * @param input
     * @param data
     */
    pushHistory(counter: number, input: any, data: any) {
        this.history.push({counter,input,data});
    }

    /**
     * Returns the latest history and removes it from the current history.
     * You should call done when you finished working with the history.
     */
    getHistory(): FetchHistoryItem[] {
        const historyTmp = this.history;
        this.history = [];

        historyTmp.sort((a,b) => a.counter - b.counter);
        this.returnedHistory = this.returnedHistory.concat(historyTmp);

        return historyTmp;
    }

    /**
     * Tells the history manager that the work is done.
     */
    done(): void {
        this.history = this.returnedHistory.concat(this.history);
        this.returnedHistory = [];
    }
}