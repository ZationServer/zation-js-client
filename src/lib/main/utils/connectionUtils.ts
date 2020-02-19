/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {Socket}                                        from "../sc/socket";
import {Zation}                                        from "../../core/zation";
import {ConnectionRequiredError}                       from "../error/connectionRequiredError";
import {TimeoutError}                                  from "../error/timeoutError";
import Databox                                         from "../databox/databox";

export type WaitForConnectionDefaultOption = false | null | number;
export type WaitForConnectionOption        = undefined | null | number | false | AbortTrigger;

export default class ConnectionUtils {

    private constructor(){}

    /**
     * Check the socket connection.
     * @param zation
     * @param waitForConnection
     * @param errorMsg
     */
    static async checkConnection(zation: Zation,waitForConnection: WaitForConnectionOption,errorMsg: string): Promise<void> {

        if(!zation.isConnected()){

            waitForConnection = waitForConnection === undefined ?
                zation.getZc().config.waitForConnection: waitForConnection;

            if(typeof waitForConnection !== 'boolean') {
                await ConnectionUtils.waitForConnection(zation.getSocket(),waitForConnection);
            }
            else {
                throw new ConnectionRequiredError(errorMsg);
            }
        }
    }

    /**
     * Wait for the socket connection.
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
                    reject(new TimeoutError('To connect to the server.',true));
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
     * @param zation
     * @param waitForDbConnection
     * @param errorMsg
     */
    static async checkDbConnection(databox: Databox,zation: Zation,waitForDbConnection: WaitForConnectionOption,errorMsg: string){

        if(!databox.isConnected()){
            waitForDbConnection = waitForDbConnection === undefined ?
                zation.getZc().config.waitForDbConnection: waitForDbConnection;

            if(typeof waitForDbConnection !== 'boolean') {
                await ConnectionUtils.waitForDbConnection(databox,zation,waitForDbConnection);
            }
            else {
                throw new ConnectionRequiredError(errorMsg);
            }
        }
    }

    /**
     * Wait for the Databox connection.
     * @param databox
     * @param zaiton
     * @param option
     */
    private static async waitForDbConnection(databox: Databox,zaiton: Zation,option: null | number | AbortTrigger)
    {
        return  new Promise<void>(async (resolve, reject) => {
            let dbConnectListener;
            let socketConnectListener;
            let timeoutHandler;
            let connected = false;

            const socket = zaiton.getSocket();

            if(typeof option === 'number'){
                timeoutHandler = setTimeout(() => {
                    databox.offConnect(dbConnectListener);
                    socket.off('connect',socketConnectListener);
                    reject(new TimeoutError('To connect to the Databox.',true));
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

            if(!zaiton.isConnected()){
                if(!databox.isCreated()){
                    socketConnectListener = async () => {
                        try {
                            await databox.connect(false);
                        }
                        catch (e) {}
                        socket.off('connect',socketConnectListener);
                    };
                    socket.on('connect',socketConnectListener);
                }
                socket.connect();

            }
            else if(!databox.isCreated()){
                try {
                    await databox.connect(false);
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
     * Abort the waitForConnect.
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