/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {ZationClientOptions, ZationClientOptionsInternal} from "../../core/zationClientOptions";

const windowDefined = typeof window === 'object';

export class ZationClientConfig
{
    private _config: ZationClientOptionsInternal;

    constructor(config?: ZationClientOptions,main: boolean = false)
    {
        this.loadDefaults(config,main);
        this.loadSettingsFromClientPrepare();
        if(config) {
            this.addToConfig(config,true);
        }
        ZationClientConfig._preBuildConfig(this._config);
    }

    static _preBuildConfig(config: ZationClientOptionsInternal) {
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

    loadDefaults(customOptions?: ZationClientOptions,main: boolean = false)
    {
        const defaultSecure = ZationClientConfig.getDefaultSecure();
        const defaultPort = ZationClientConfig.getDefaultPort(customOptions,defaultSecure);
        this._config = {
            debug: false,
            system: 'Default',
            version: 1.0,
            hostname: windowDefined && window.location && window.location.hostname || 'localhost',
            path: '/zation',
            port: defaultPort,
            secure: defaultSecure,
            rejectUnauthorized: false,
            handshakeAttachment: {},
            useAllServerSettings: false,
            autoReconnect: true,
            autoReconnectOptions: {},
            responseTimeout: 10000,
            connectTimeout: 3000,
            databoxConnectTimeout: 3000,
            storeTokenKey: main ? 'main' : null
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
        }
    }


    get config(): ZationClientOptionsInternal {
        return this._config;
    }

    isDebug(): boolean
    {
        return this.config.debug;
    }

    setConfig(key: any,value: any): void {
        this._config[key] = value;
    }

    isConfig(key: any): boolean {
        return this._config[key] !== undefined;
    }
}