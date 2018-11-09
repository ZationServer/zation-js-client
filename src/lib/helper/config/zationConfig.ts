/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {ZationOptions, ZationOptionsInternal} from "../../api/zationOptions";

class ZationConfig
{
    private _config : ZationOptionsInternal;

    constructor(config ?: ZationOptions)
    {
        this.loadDefaults();
        this.loadSettingsFromClientPrepare();
        if(config) {
            this.addToConfig(config,true);
        }
    }

    addToConfig(obj : object,override : boolean = false)
    {
        for(let k in obj) {
            if (obj.hasOwnProperty(k) && override || (!override && !this._config.hasOwnProperty(k))) {
                this._config[k] = obj[k];
            }
        }
    }

    loadDefaults()
    {
        this._config = {
          debug : false,
          system : 'Default',
          version : 1.0,
          hostname : 'localhost',
          path : '/zation',
          port : 3000,
          secure : false,
          rejectUnauthorized : false,
          postKey : 'zation',
          autoAllChSub : true,
          autoUserChSub : true,
          autoDefaultUserGroupChSub : true,
          autoAuthUserGroupChSub : true
        };
    }

    loadSettingsFromClientPrepare()
    {
        // @ts-ignore
        if(typeof ZATION_SERVER_SETTINGS === 'object')
        {
            // noinspection JSUnresolvedVariable
            // @ts-ignore
            let zss = ZATION_SERVER_SETTINGS;

            if(!!zss['HOSTNAME']) {
                this._config.hostname = zss['HOSTNAME'];
            }
            if(!!zss['PORT']) {
                this._config.port = zss['PORT'];
            }
            if(!!zss['PATH']) {
                this._config.path = zss['PATH'];
            }
            if(!!zss['SECURE']) {
                this._config.secure = zss['SECURE'];
            }
            if(!!zss['POST_KEY']) {
                this._config.postKey = zss['POST_KEY'];
            }
        }
    }


    get config(): ZationOptionsInternal {
        return this._config;
    }

    isDebug() : boolean
    {
        return !!this.config.debug;
    }

    setConfig(key : any,value : any) : void
    {
        this._config[key] = value;
    }

    isConfig(key : any) : boolean
    {
        return this._config[key] !== undefined;
    }

}

export = ZationConfig;

