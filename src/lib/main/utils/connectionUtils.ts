/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {ZationClient}              from "../../core/zationClient";
import {ConnectionRequiredError}   from "../error/connectionRequiredError";
import {TimeoutError, TimeoutType} from "../error/timeoutError";
import Databox                     from "../databox/databox";
import {Socket}                    from "../sc/socket";

export type ConnectTimeoutDefaultOption = false | null | number;
export type ConnectTimeoutOption = undefined | null | number | false | AbortTrigger;

export default class ConnectionUtils {
    /**
     * Check the socket connection.
     * @param client
     * @param connectTimeout
     */
    static async checkConnection(client: ZationClient, connectTimeout: ConnectTimeoutOption): Promise<void> {

        if(!client.isConnected()){
            connectTimeout = connectTimeout === undefined ? client.getZc().config.connectTimeout : connectTimeout;

            if(typeof connectTimeout !== 'boolean') {
                await ConnectionUtils.waitForConnection(client.socket,connectTimeout);
            }
            else {
                throw new ConnectionRequiredError();
            }
        }
    }

    /**
     * Wait for the connection.
     * @param socket
     * @param option
     */
    private static waitForConnection(socket: Socket,option: null | number | AbortTrigger): Promise<void>
    {
        return new Promise<void>((resolve, reject) => {
            let connectListener;
            let timeoutHandler;
            let connected = false;

            if(typeof option === 'number'){
                timeoutHandler = setTimeout(() => {
                    socket.off('connect',connectListener);
                    reject(new TimeoutError(TimeoutType.connectTiemeout));
                },option);
            }
            else if(option){
                option._setAbortProcess(() => {
                    if(!connected){
                        socket.off('connect',connectListener);
                        reject(new AbortSignal());
                        return true;
                    }
                   return false;
                });
            }

            connectListener = () => {
                socket.off('connect',connectListener);
                clearInterval(timeoutHandler);
                connected = true;
                resolve();
            };

            socket.on('connect',connectListener);

            socket.connect();
        });
    }

    /**
     * Check the Databox connection.
     * @param databox
     * @param client
     * @param connectTimeout
     */
    static async checkDbConnection(databox: Databox, client: ZationClient, connectTimeout: ConnectTimeoutOption){

        if(!databox.isConnected()){
            connectTimeout = connectTimeout === undefined ? client.getZc().config.databoxConnectTimeout: connectTimeout;

            if(typeof connectTimeout !== 'boolean') {
                await ConnectionUtils.waitForDbConnection(databox,client,connectTimeout);
            }
            else {
                throw new ConnectionRequiredError();
            }
        }
    }

    /**
     * Wait for the Databox connection.
     * @param databox
     * @param client
     * @param option
     */
    private static async waitForDbConnection(databox: Databox, client: ZationClient, option: null | number | AbortTrigger)
    {
        return  new Promise<void>(async (resolve, reject) => {
            let dbConnectListener;
            let socketConnectListener;
            let timeoutHandler;
            let connected = false;

            const socket = client.socket;

            if(typeof option === 'number'){
                timeoutHandler = setTimeout(() => {
                    databox.offConnect(dbConnectListener);
                    socket.off('connect',socketConnectListener);
                    reject(new TimeoutError(TimeoutType.connectTiemeout));
                },option);
            }
            else if(option){
                option._setAbortProcess(() => {
                    if(!connected){
                        databox.offConnect(dbConnectListener);
                        socket.off('connect',socketConnectListener);
                        reject(new AbortSignal());
                        return true;
                    }
                    return false;
                });
            }

            dbConnectListener = () => {
                clearInterval(timeoutHandler);
                socket.off('connect',socketConnectListener);
                resolve();
            };

            databox.onceConnect(dbConnectListener);

            if(!client.isConnected()){
                if(!databox.isInitialized()){
                    socketConnectListener = async () => {
                        try {
                            await databox._connect();
                        }
                        catch (e) {}
                        socket.off('connect',socketConnectListener);
                    };
                    socket.on('connect',socketConnectListener);
                }
                socket.connect();
            }
            else if(!databox.isInitialized()){
                try {
                    await databox._connect();
                }
                catch (e) {}
            }
        });
    }
}

const abortedName = 'ABORTED';

/**
 * Creates an abort trigger that can be used to cancel wait for connections.
 */
export class AbortTrigger {

    private _aborted: boolean = false;
    private _abortProcess: () => boolean;

    constructor(){
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Abort the ConnectTimeout.
     * Returns a boolean if it was successful.
     * Notice that the target promise will reject an AbortSignal.
     */
    abort(): boolean {
        if(!this._aborted && this._abortProcess){
           return this._abortProcess();
        }
        return false;
    }

    /**
     * @internal
     * This method is used internally.
     * @param func
     * @private
     */
    _setAbortProcess(func: () => boolean){
        this._abortProcess = func;
    }

    /**
     * Checks if the error is an abort signal.
     * @param err
     */
    static isAbortSignal(err: any): boolean {
        return err && err.name === abortedName;
    }

    /**
     * Cast a value to an instance of this class.
     * That can be useful if you are programming in javascript,
     * but the IDE can interpret the typescript information of this library.
     * @param value
     */
    static cast(value: any): AbortTrigger {
        return value as AbortTrigger;
    }
}

export class AbortSignal extends Error {
    constructor(){
        super('Aborted');
        this.name = abortedName;
    }
}