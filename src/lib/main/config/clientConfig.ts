/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {ClientOptions, ClientOptionsInternal}             from "../../core/clientOptions";
import {createLocalStorageTokenStore}                     from "../tokenStore/localStorageTokenStore";

const windowDefined = typeof window === 'object';

export class ClientConfig
{
    private _config: ClientOptionsInternal;

    constructor(config?: ClientOptions, main: boolean = false)
    {
        this.loadDefaults(config,main);
        this.loadSettingsFromClientPrepare();
        if(config) {
            this.addToConfig(config,true);
        }
        ClientConfig._preBuildConfig(this._config);
    }

    static _preBuildConfig(config: ClientOptionsInternal) {
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

    loadDefaults(customOptions?: ClientOptions, main: boolean = false)
    {
        const defaultSecure = ClientConfig.getDefaultSecure();
        const defaultPort = ClientConfig.getDefaultPort(customOptions,defaultSecure);
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
            tokenStore: main ? createLocalStorageTokenStore('main') : undefined
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


    get config(): ClientOptionsInternal {
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