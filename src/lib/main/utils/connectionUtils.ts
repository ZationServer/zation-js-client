/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {Socket}                                        from "../sc/socket";
import {Zation}                                        from "../../core/zation";
import {ConnectionRequiredError}                       from "../error/connectionRequiredError";
import {TimeoutError}                                  from "../error/timeoutError";
import DataBox                                         from "../dataBox/dataBox";

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
     * Check the DataBox connection.
     * @param dataBox
     * @param zation
     * @param waitForDbConnection
     * @param errorMsg
     */
    static async checkDbConnection(dataBox : DataBox,zation : Zation,waitForDbConnection : WaitForConnectionOption,errorMsg : string){

        if(!dataBox.isConnected()){
            waitForDbConnection = waitForDbConnection === undefined ?
                zation.getZc().config.waitForDbConnection : waitForDbConnection;

            if(typeof waitForDbConnection !== 'boolean') {
                await ConnectionUtils.waitForDbConnection(dataBox,zation,waitForDbConnection);
            }
            else {
                throw new ConnectionRequiredError(errorMsg);
            }
        }
    }

    /**
     * Wait for the DataBox connection.
     * @param dataBox
     * @param zaiton
     * @param timeout
     */
    private static async waitForDbConnection(dataBox : DataBox,zaiton : Zation,timeout : null | number)
    {
        return  new Promise<void>(async (resolve, reject) => {
            let dbConnectListener;
            let socketConnectListener;
            let timeoutHandler;

            const socket = zaiton.getSocket();

            if(timeout !== null){
                timeoutHandler = setTimeout(() => {
                    dataBox.offConnect(dbConnectListener);
                    socket.off('connect',socketConnectListener);
                    reject(new TimeoutError('To connect to the DataBox.',true));
                },timeout);
            }

            dbConnectListener = () => {
                clearInterval(timeoutHandler);
                socket.off('connect',socketConnectListener);
                resolve();
            };

            dataBox.onceConnect(dbConnectListener);

            if(!zaiton.isConnected()){
                if(!dataBox.isCreated()){
                    socketConnectListener = async () => {
                        try {
                            await dataBox.connect(false);
                        }
                        catch (e) {}
                        socket.off('connect',socketConnectListener);
                    };
                    socket.on('connect',socketConnectListener);
                }
                socket.connect();

            }
            else if(!dataBox.isCreated()){
                try {
                    await dataBox.connect(false);
                }
                catch (e) {}
            }
        });
    }
}