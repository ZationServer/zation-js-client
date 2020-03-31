/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {ZationOptions, ZationOptionsInternal} from "../../core/zationOptions";

const windowDefined = typeof window === 'object';

export class ZationConfig
{
    private _config: ZationOptionsInternal;

    constructor(config?: ZationOptions)
    {
        this.loadDefaults(config);
        this.loadSettingsFromClientPrepare();
        if(config) {
            this.addToConfig(config,true);
        }
        ZationConfig._preBuildConfig(this._config);
    }

    static _preBuildConfig(config: ZationOptionsInternal) {
        //path slash
        if(!config.path.startsWith('/')) {
            config.path = ('/'+config.path);
        }
    }

    addToConfig(obj: object,override: boolean = false)
    {
        for(const k in obj) {
            if (obj.hasOwnProperty(k) && override || (!override && !this._config.hasOwnProperty(k))) {
                this._config[k] = obj[k];
            }
        }
    }

    private static getDefaultPort(customOptions,defaultSecure) {
        const isSecure = customOptions && typeof customOptions.secure === 'boolean' ?
            customOptions.secure: defaultSecure;

        return (windowDefined && window.location && window.location.port) ?
            parseInt(window.location.port): isSecure ? 443: 80;
    }

    private static getDefaultSecure() {
        return windowDefined && window.location && window.location.protocol ?
            (window.location.protocol === 'https:'): false;
    }

    loadDefaults(customOptions?: ZationOptions)
    {
        const defaultSecure = ZationConfig.getDefaultSecure();
        const defaultPort = ZationConfig.getDefaultPort(customOptions,defaultSecure);
        this._config = {
            debug: false,
            system: 'Default',
            version: 1.0,
            hostname: windowDefined && window.location && window.location.hostname || 'localhost',
            path: '/zation',
            port: defaultPort,
            secure: defaultSecure,
            rejectUnauthorized: false,
            postKey: 'zation',
            multiplex: true,
            autoAllChSub: true,
            autoUserChSub: true,
            autoDefaultUserGroupChSub: true,
            autoAuthUserGroupChSub: true,
            handshakeVariables: {},
            useAllServerSettings: false,
            autoReconnect: true,
            autoReconnectOptions: {},
            requestTimeout: 10000,
            waitForConnection: false,
            waitForDbConnection: false
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

            if(this._config.useAllServerSettings && !!zss['HOSTNAME']) {
                this._config.hostname = zss['HOSTNAME'];
            }
            if(this._config.useAllServerSettings && !!zss['PORT']) {
                this._config.port = zss['PORT'];
            }
            if(this._config.useAllServerSettings && !!zss['SECURE']) {
                this._config.secure = zss['SECURE'];
            }
            if(!!zss['PATH']) {
                this._config.path = zss['PATH'];
            }
            if(!!zss['POST_KEY']) {
                this._config.postKey = zss['POST_KEY'];
            }
        }
    }


    get config(): ZationOptionsInternal {
        return this._config;
    }

    isDebug(): boolean
    {
        return this.config.debug;
    }

    setConfig(key: any,value: any): void
    {
        this._config[key] = value;
    }

    isConfig(key: any): boolean
    {
        return this._config[key] !== undefined;
    }

}


