/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {Response}  from "../../response/response";
import {BackError} from "../../response/backError";

//Response
export type ResponseReactionOnSuccessful = (result : any, response : Response) => void | Promise<void>;
export type ResponseReactionOnResponse   = (response : Response) => void | Promise<void>;
export type ResponseReactionOnError      = (filteredErrors : BackError[], response : Response) => void | Promise<void>;
export type ResponseReactionCatchError   = (catchedErrors : BackError[], response : Response) => void | Promise<void>;

//Channel
//Pub
export type ChannelReactionOnPubAnyCh          = (data : any, socketSrcSid : undefined | string, eventName : string, fullChName : string) => void | Promise<void>;
export type ChannelReactionOnPubZationCh       = (data : any, socketSrcSid : undefined | string, eventName : string) => void | Promise<void>;
export type ChannelReactionOnPubCustomCh       = (data : any, socketSrcSid : undefined | string, eventName : string, name : string, id ?: string) => void | Promise<void>;

//KickOut
export type ChannelReactionOnKickOutAnyCh      = (message : string | undefined,fullChName : string) => void | Promise<void>;
export type ChannelReactionOnKickOutZationCh   = (message : string | undefined) => void | Promise<void>;
export type ChannelReactionOnKickOutCustomCh   = (message : string | undefined,name : string,id ?: string) => void | Promise<void>;

//SubFail
export type ChannelReactionOnSubFailAnyCh      = (err : object,fullChName : string) => void | Promise<void>;
export type ChannelReactionOnSubFailZationCh   = (err : object) => void | Promise<void>;
export type ChannelReactionOnSubFailCustomCh   = (err : object,name : string,id ?: string) => void | Promise<void>;

//Sub
export type ChannelReactionOnSubAnyCh          = (fullChName : string) => void | Promise<void>;
export type ChannelReactionOnSubZationCh       = () => void | Promise<void>;
export type ChannelReactionOnSubCustomCh       = (name : string,id ?: string) => void | Promise<void>;

//ClientUnsub
export type ChannelReactionOnClientUnsubAnyCh        = (fullChName : string) => void | Promise<void>;
export type ChannelReactionOnClientUnsubZationCh     = () => void | Promise<void>;
export type ChannelReactionOnClientUnsubCustomCh     = (name : string,id ?: string) => void | Promise<void>;

//Unsub
export type ChannelReactionOnUnsubAnyCh        = (fromClient : boolean,fullChName : string) => void | Promise<void>;
export type ChannelReactionOnUnsubZationCh     = (fromClient : boolean) => void | Promise<void>;
export type ChannelReactionOnUnsubCustomCh     = (fromClient : boolean,name : string,id ?: string) => void | Promise<void>;

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

//ReactionBox
export type WillProcess                  = () => void | Promise<void>;
export type DidProcess                   = () => void | Promise<void>;