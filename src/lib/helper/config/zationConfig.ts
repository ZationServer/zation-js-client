/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import Const = require("../constants/constWrapper");
import {ZationOptions} from "../../api/zationOptions";

class ZationConfig
{
    private config : ZationOptions = {};

    constructor(config : object)
    {
        this.loadDefaults();
        this.loadSettingsFromClientPrepare();
        this.addToConfig(config,true);
    }

    addToConfig(obj : object,override : boolean = false)
    {
        for(let k in obj) {
            if (obj.hasOwnProperty(k) && override || (!override && !this.config.hasOwnProperty(k))) {
                this.config[k] = obj[k];
            }
        }
    }

    loadDefaults()
    {
        this.config = {
          debug : false,
          system : 'W',
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
                this.config[Const.Config.HOSTNAME] = zss['HOSTNAME'];
            }
            if(!!zss['PORT']) {
                this.config[Const.Config.PORT] = zss['PORT'];
            }
            if(!!zss['PATH']) {
                this.config[Const.Config.PATH] = zss['PATH'];
            }
            if(!!zss['SECURE']) {
                this.config[Const.Config.SECURE] = zss['SECURE'];
            }
            if(!!zss['POST_KEY']) {
                this.config[Const.Config.POST_KEY] = zss['POST_KEY'];
            }
        }
    }

    getConfig(key : any) : any
    {
        return this.config[key];
    }

    isDebug() : boolean
    {
        return this.getConfig(Const.Config.DEBUG);
    }

    setConfig(key : any,value : any) : void
    {
        this.config[key] = value;
    }

    isConfig(key : any) : boolean
    {
        return this.config[key] !== undefined;
    }

}

export = ZationConfig;

