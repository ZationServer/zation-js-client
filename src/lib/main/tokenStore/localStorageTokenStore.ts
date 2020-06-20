/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import TokenStore from "./tokenStore";

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

export function createLocalStorageTokenStore(key: string): TokenStore {
    return {
        saveToken(signedToken: string): Promise<void> | void {
            if(localStorageEnabled && global.localStorage){
                global.localStorage.setItem(tokenNamePrefix + key, signedToken);
            }
        },
        loadToken(): Promise<string | null> | string | null {
            if(localStorageEnabled && global.localStorage){
                return global.localStorage.getItem(tokenNamePrefix + key) || null;
            }
            return null;
        },
        removeToken(): Promise<void> | void {
            if(localStorageEnabled && global.localStorage){
                global.localStorage.removeItem(tokenNamePrefix + key);
            }
        }
    };
}