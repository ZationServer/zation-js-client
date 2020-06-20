/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import TokenStore from "../tokenStore/tokenStore";

export default class ScAuthEngine {

    private readonly _tokenStore?: TokenStore;

    constructor(tokenStore?: TokenStore) {
        this._tokenStore = tokenStore;
    }

    private _internalStorage: string | null = null;

    saveToken(_,token: string,options: any, callback?: Function) {
        (async () => {
            this._internalStorage = token;
            if(this._tokenStore){
                try {await this._tokenStore.saveToken(token);}
                catch (e) {}
            }
            callback && callback(null, token);
        })();
    }

    loadToken(_, callback?: Function) {
        (async () => {
            let token: string | null = null;
            if(this._tokenStore){
                try {token = await this._tokenStore.loadToken();}
                catch (_) {}
            }
            if(!token) token = this._internalStorage;
            callback && callback(null, token);
        })();
    }

    removeToken(_, callback?: Function) {
        (async () => {
            let token;
            this.loadToken(name, (_, authToken) => token = authToken);
            this._internalStorage = null;
            if(this._tokenStore){
                try {await this._tokenStore.removeToken();}
                catch (e) {}
            }
            callback && callback(null, token);
        })();
    }
}