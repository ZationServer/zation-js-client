/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import Const = require("../constants/constWrapper");

class ZationConfig
{
    private config : object = {};

    constructor(config : object)
    {
        this.loadDefaults();
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
        this.config[Const.Config.DEBUG] = false;
        this.config[Const.Config.SYSTEM] = 'W';
        this.config[Const.Config.VERSION] = 1.0;
        this.config[Const.Config.HOSTNAME] = 'localhost';
        this.config[Const.Config.PATH] = '/zation';
        this.config[Const.Config.PORT] = 3000;
        this.config[Const.Config.SECURE] = false;
        this.config[Const.Config.REJECT_UNAUTHORIZED] = false;
        this.config[Const.Config.POST_KEY] = 'zation';

        this.config[Const.Config.AUTO_ALL_CH_SUB] = true;
        this.config[Const.Config.AUTO_USER_CH_SUB] = true;
        this.config[Const.Config.AUTO_DEFAULT_USER_GROUP_CH_SUB] = true;
        this.config[Const.Config.AUTO_AUTH_USER_GROUP_CH_SUB] = true;
    }

    getConfig(key : any) : any
    {
        return this.config[key];
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

