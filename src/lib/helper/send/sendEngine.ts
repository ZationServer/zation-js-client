/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */


import {ProtocolType}           from "../constants/protocolType";
import {ProgressHandler}        from "../../request/helper/progressHandler";
import {Zation}                 from "../../mainApi/zation";
import {Response}               from "../../response/response";
import {ResultIsMissingError}   from "../error/resultIsMissingError";
import {ConnectionNeededError}  from "../error/connectionNeededError";
import axios, {AxiosRequestConfig} from 'axios';
const FormData                = require('form-data');
import stringify                from "fast-stringify";

export class SendEngine
{
    static wsSend(zation : Zation,data : object,timeout : null | number | undefined,progressHandler ?: ProgressHandler) : Promise<Response>
    {
        return new Promise(async (resolve, reject)=>
        {
            const socket = zation.getSocket();
            if(zation.isConnected() && socket) {

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
                },timeout);
            }
            else {
                reject(new ConnectionNeededError('By sending an webSocket request!'));
            }
        });
    }

    static async httpSend(
        zation : Zation,
        data : object,
        timeout : null | number | undefined,
        attachedContent ?: {key : string,data : Blob | string}[],
        progressHandler ?: ProgressHandler
    ) : Promise<Response>
    {
        return new Promise<Response>(async (resolve,reject) =>
        {
            const config : AxiosRequestConfig = {};

            if (!!progressHandler) {
                config.onUploadProgress = progressEvent => {
                    progressHandler(Math.round( (progressEvent.loaded * 100) / progressEvent.total));
                };
            }

            if(timeout !== null){
               config.timeout = timeout === undefined ? zation.getZc().config.requestTimeout : timeout;
            }

            const bodyFormData = new FormData();

            bodyFormData.append(zation.getPostKey(),stringify(data));

            if(attachedContent) {
                for(let i = 0; i < attachedContent.length; i ++) {
                    bodyFormData.append(attachedContent[i].key,attachedContent[i].data);
                }
            }

            config.headers = bodyFormData.getHeaders();

            axios.post(zation.getServerAddress(),bodyFormData,config)
                .then(async (res) => {
                    resolve(new Response(await res.data,zation,ProtocolType.Http));
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}


