/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */


// noinspection ES6PreferShortImport
import {Zation}                                from "../../core/zation";
import {Response}                              from "./response/response";
// noinspection ES6PreferShortImport
import {TimeoutError, TimeoutType}             from "../error/timeoutError";
import ConnectionUtils, {ConnectTimeoutOption} from "../utils/connectionUtils";
import {
    CONTROLLER_EVENT,
    ControllerBaseReq,
    ControllerStandardReq,
    ControllerValidationCheckReq
} from "./controllerDefinitions";

export function controllerRequestSend(
    zation: Zation,
    cRequest: ControllerBaseReq | ControllerStandardReq | ControllerValidationCheckReq,
    responseTimeout: null | number | undefined,
    connectTimeout: ConnectTimeoutOption = undefined
): Promise<Response>
{
    return new Promise(async (resolve, reject) => {
        try {
            await ConnectionUtils.checkConnection(zation,connectTimeout);
        }
        catch (err) {reject(err);}

        if(responseTimeout !== null){
            responseTimeout = responseTimeout === undefined ? zation.getZc().config.responseTimeout: responseTimeout;
        }

        zation.socket.emit(CONTROLLER_EVENT,cRequest,(err,res) => {
            if(err) {
                if(err.name === 'TimeoutError'){
                    reject(new TimeoutError(TimeoutType.responseTimeout,err.message));
                }
                else {
                    reject(err);
                }
            }
            else {
                resolve((new Response(res,zation)));
            }
        },responseTimeout);
    });
}