/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

function isLocalStorageEnabled() {
    let err;
    try {
        // Some browsers will throw an error here if localStorage is disabled.
        global.localStorage;
        // Safari, in Private Browsing Mode, looks like it supports localStorage but all calls to setItem
        // throw QuotaExceededError. We're going to detect this and avoid hard to debug edge cases.
        global.localStorage.setItem('__scLocalStorageTest', '1');
        global.localStorage.removeItem('__scLocalStorageTest');
    } catch (e) {err = e;}
    return !err;
}
const localStorageEnabled = isLocalStorageEnabled();
const tokenNamePrefix = 'ZationClientToken.';

export default class ScAuthEngine {

    private _internalStorage?: string;

    saveToken(name: string | undefined | null,token: string,options: any, callback?: Function) {
        if (name != null && localStorageEnabled && global.localStorage) {
            global.localStorage.setItem(tokenNamePrefix + name, token);
        } else {
            this._internalStorage = token;
        }
        callback && callback(null, token);
    }

    loadToken(name: string | undefined | null, callback?: Function) {
        let token;
        if (name != null && localStorageEnabled && global.localStorage) {
            token = global.localStorage.getItem(tokenNamePrefix + name);
        } else {
            token = this._internalStorage || null;
        }
        callback && callback(null, token);
    }

    removeToken(name: string | undefined | null, callback?: Function) {
        let token;
        this.loadToken(name, (_, authToken) => token = authToken);

        if (name != null && localStorageEnabled && global.localStorage) {
            global.localStorage.removeItem(tokenNamePrefix + name);
        } else {
            this._internalStorage = undefined;
        }
        callback && callback(null, token);
    }
}