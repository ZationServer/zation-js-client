/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import Zation                 = require("../../api/zation");
import Response               = require("../../api/response");
import ConnectionNeededError  = require("../error/connectionNeededError");
import ResultIsMissingError   = require("../error/resultIsMissingError");
import {ProtocolType}           from "../constants/protocolType";
import {ProgressHandler}        from "../request/progressHandler";
import fetchProgress            from 'fetch-progress';

class SendEngine
{
    static wsSend(zation : Zation,data : object,progressHandler ?: ProgressHandler) : Promise<Response>
    {
        return new Promise(async (resolve, reject)=>
        {
            const socket = zation.getSocket();
            if(zation.isSocketConnected() && socket) {

                if (!!progressHandler) {
                    progressHandler(0);
                }

                socket.emit('ZATION.SERVER.REQUEST',data,async (err,res) =>
                {
                    if (!!progressHandler) {
                        progressHandler(100);
                    }

                    if(err) {
                        reject(err);
                    }
                    if(res !== undefined) {
                        let response = new Response(res,zation,ProtocolType.WebSocket);
                        resolve(response);
                    }
                    else {
                        reject(new ResultIsMissingError())
                    }

                });
            }
            else {
                reject(new ConnectionNeededError('By sending an webSocket request!'));
            }
        });
    }

    static async httpSend(zation : Zation,data : object,progressHandler ?: ProgressHandler) : Promise<Response>
    {
        return new Promise<Response>((resolve) => {
            fetch(zation.getServerAddress(),
                {
                    method : "POST",
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                    },
                    body : JSON.stringify(data)
                }).then(
                fetchProgress(
                    {
                        onProgress(progress) {
                            if (!!progressHandler) {
                                progressHandler(progress.percentage);
                            }
                        },
                    })
                ).then(async (res) => {
                    resolve(new Response(await res.json(),zation,ProtocolType.Http));
                });
        });
    }
}

export = SendEngine;

