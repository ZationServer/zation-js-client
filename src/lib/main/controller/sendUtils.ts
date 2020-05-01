/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */


// noinspection ES6PreferShortImport
import {Zation}                 from "../../core/zation";
import {Response}               from "./response/response";
// noinspection ES6PreferShortImport
import {TimeoutError}           from "../error/timeoutError";
import ConnectionUtils, {WaitForConnectionOption} from "../utils/connectionUtils";

export function wsSend(
    zation: Zation,data: object,
    timeout: null | number | undefined,
    waitForConnection: WaitForConnectionOption = undefined
): Promise<Response>
{
    return new Promise(async (resolve, reject)=>
    {
        try {
            await ConnectionUtils.checkConnection
            (zation,waitForConnection,'For sending a request.');
        }
        catch (err) {reject(err);}


        if(timeout !== null){
            timeout = timeout === undefined ? zation.getZc().config.requestTimeout: timeout;
        }

        zation.getSocket().emit('>',data,(err,res) => {
            if(err) {
                if(err.name === 'TimeoutError'){
                    reject(new TimeoutError(err.message));
                }
                else {
                    reject(err);
                }
            }
            else {
                resolve((new Response(res,zation)));
            }
        },timeout);
    });
}