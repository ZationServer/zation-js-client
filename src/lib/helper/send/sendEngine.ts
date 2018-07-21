/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import Zation = require("../../api/zation");
import Response = require("../../api/response");
import ConnectionNeededError = require("../error/connectionNeededError");
import ResultIsMissingError = require("../error/resultIsMissingError");
import nodeFetch = require("node-fetch");
import {ProtocolType} from "../constants/protocolType";
import {ProgressHandler} from "../request/progressHandler";

class SendEngine
{
    static wsSend(zation : Zation,data : object,progressHandler ?: ProgressHandler) : Promise<Response>
    {
        return new Promise(async (resolve, reject)=>
        {
            if(zation.isSocketConnected()) {
                zation.getSocket().emit('zationRequest',data,async (err,res) => {
                    if(err) {
                        reject(err);
                    }

                    if(res !== undefined) {
                        let response = new Response(res,ProtocolType.WebSocket);
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
        if(typeof fetch === 'function')
        {
            const response  = await fetch(zation.getServerAddress(),
                {
                    method : "POST",
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                    },
                    body : JSON.stringify(data)
                });
            return new Response((await response.json()),ProtocolType.Http);
        }
        else
        {
            // @ts-ignore
            const response  = await nodeFetch(zation.getServerAddress(),
                {
                    method : "POST",
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                    },
                    body : JSON.stringify(data)
                });
            return new Response((await response.json()),ProtocolType.Http);
        }
    }
}

export = SendEngine;

