/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import Zation = require("../../api/zation");
import Response = require("../../api/response");
import ConnectionNeededError = require("../error/connectionNeededError");
import ResultIsMissingError = require("../error/resultIsMissingError");
import {ProtocolType} from "../constants/protocolType";

class SendEngine
{
    static wsSend(zation : Zation,data : object) : Promise<Response>
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
                        await zation._triggerResponseReactions(response);
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

    static httpSend()
    {



    }
}

export = SendEngine;

