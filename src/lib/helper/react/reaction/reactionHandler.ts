/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import Response = require("../../../api/response");
import {TaskError} from "../taskError/taskError";
import Zation = require("../../../api/zation");

//Response
export type ResponseReactionOnSuccessful = (result : any, response : Response) => void | Promise<void>;
export type ResponseReactionOnResponse   = (response : Response, zation : Zation) => void | Promise<void>;
export type ResponseReactionOnError      = (filteredErrors : TaskError[], response : Response) => void | Promise<void>;
export type ResponseReactionCatchError   = (catchedErrors : TaskError[], response : Response) => void | Promise<void>;

//Channel
export type ChannelReactionOnPubZationCh   = (data : any, socketSrcSid : undefined | string, eventName : string) => void | Promise<void>;
export type ChannelReactionOnPubCustomCh   = (data : any, socketSrcSid : undefined | string, eventName : string, chName : string) => void | Promise<void>;
export type ChannelReactionOnPubCustomIdCh = (data : any, socketSrcSid : undefined | string, eventName : string, chId : string, chName : string) => void | Promise<void>;

//Event
export type EventReactionOnConnect                  = (isFirstConnection) => void | Promise<void>;
export type EventReactionOnFirstConnect             = () => void | Promise<void>;
export type EventReactionOnReconnect                = () => void | Promise<void>;
export type EventReactionOnServerDisconnect         = (code : number | undefined, data : object | string | undefined) => void | Promise<void>;
export type EventReactionOnClientDisconnect         = (code : number | undefined, data : object | string | undefined) => void | Promise<void>;
export type EventReactionOnDisconnect               = (fromClient : boolean, code : number | undefined, data : object | string | undefined) => void | Promise<void>;
export type EventReactionOnAuthenticate             = (signedJwtToken : string) => void | Promise<void>;
export type EventReactionOnClinetDeauthenticate     = (oldSignedJwtToken : string) => void | Promise<void>;
export type EventReactionOnServerDeauthenticate     = (oldSignedJwtToken : string) => void | Promise<void>;
export type EventReactionOnDeauthenticate           = (fromClient : boolean, oldSignedJwtToken : string) => void | Promise<void>;
export type EventReactionOnConnectAbort             = (code : number | undefined, data : object | string | undefined) => void | Promise<void>;
export type EventReactionOnConnecting               = () => void | Promise<void>;
export type EventReactionOnError                    = (err : any) => void | Promise<void>;
export type EventReactionOnClose                    = (code : number | undefined, data : object | string | undefined) => void | Promise<void>;
