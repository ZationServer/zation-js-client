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

export type WaitForConnectionDefaultOption = false | null | null;
export type WaitForConnectionOption        = undefined | null | number | false;

export default class ConnectionUtils {

    private constructor(){}

    /**
     * Check the socket connection.
     * @param zation
     * @param waitForConnection
     * @param errorMsg
     */
    static async checkConnection(zation : Zation,waitForConnection : WaitForConnectionOption,errorMsg : string){

        if(!zation.isConnected()){

            waitForConnection = waitForConnection === undefined ?
                zation.getZc().config.waitForConnection : waitForConnection;

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
     * @param timeout
     */
    private static async waitForConnection(socket : Socket,timeout : null | number)
    {
        return  new Promise<void>((resolve, reject) => {
            let connectListener;
            let timeoutHandler;

            if(timeout !== null){
                timeoutHandler = setTimeout(() => {
                    socket.off('connect',connectListener);
                    reject(new TimeoutError('To connect to the server.',true));
                },timeout);
            }

            connectListener = () => {
                socket.off('connect',connectListener);
                clearInterval(timeoutHandler);
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
    static async checkDbConnection(databox : Databox,zation : Zation,waitForDbConnection : WaitForConnectionOption,errorMsg : string){

        if(!databox.isConnected()){
            waitForDbConnection = waitForDbConnection === undefined ?
                zation.getZc().config.waitForDbConnection : waitForDbConnection;

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
     * @param timeout
     */
    private static async waitForDbConnection(databox : Databox,zaiton : Zation,timeout : null | number)
    {
        return  new Promise<void>(async (resolve, reject) => {
            let dbConnectListener;
            let socketConnectListener;
            let timeoutHandler;

            const socket = zaiton.getSocket();

            if(timeout !== null){
                timeoutHandler = setTimeout(() => {
                    databox.offConnect(dbConnectListener);
                    socket.off('connect',socketConnectListener);
                    reject(new TimeoutError('To connect to the Databox.',true));
                },timeout);
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