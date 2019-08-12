/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

export default class EventManager<T extends (...any : any[]) => any> {

    private listeners: T[] = [];
    private onceListeners: T[] = [];

    /**
     * Registers a listener for the event.
     * @param listener
     */
    on(listener : T) {
        this.listeners.push(listener);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Registers a once listener that will only trigger once.
     * @param listener
     */
    once(listener: T) : void {
        this.onceListeners.push(listener);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Remove any listener from the event.
     * @param listener
     */
    off(listener: T) {
        this._rmListener(this.listeners,listener);
        this._rmListener(this.onceListeners,listener);
    }

    private _rmListener(listeners : T[],listener : T) {
        const index = listeners.indexOf(listener);
        if (index > -1) listeners.splice(index, 1);
    }

    private _emit(listeners : T[],...params : Parameters<T>) {
        for(let i = 0; i < listeners.length; i++){
            listeners[i](...params);
        }
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Clear all listeners from the event.
     */
    clear() {
        this.listeners = [];
        this.onceListeners = [];
    }

    /**
     * Emit the events.
     * @param params
     */
    emit(...params : Parameters<T>) {
        this._emit(this.listeners,...params);
        this._emit(this.onceListeners,...params);
        this.onceListeners = [];
    }
}