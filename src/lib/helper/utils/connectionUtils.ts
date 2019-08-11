/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {ConnectionRequiredError, TimeoutError, Zation} from "../../..";
import {WaitForConnectionOption}                       from "../../request/helper/sendAble";
import {Socket}                                        from "../sc/socket";

export default class ConnectionUtils {

    private constructor(){}

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

    static async waitForConnection(socket : Socket,timeout : null | number)
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

}