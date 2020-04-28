/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {Response}  from "../../response/response";
import {BackError} from "../../response/backError";

//Response
export type ResponseReactionOnSuccessful = (result: any, response: Response) => void | Promise<void>;
export type ResponseReactionOnResponse   = (response: Response) => void | Promise<void>;
export type ResponseReactionOnError      = (errors: BackError[], response: Response) => void | Promise<void>;
export type ResponseReactionCatchError   = (caughtErrors: BackError[], response: Response) => void | Promise<void>;

//Channel
export type ChannelReactionOnPublish<A>        = (data: any, socketSrcSid: undefined | string, eventName: string,chInfo: A) => void | Promise<void>;
export type ChannelReactionOnKickOut<A>        = (message: string | undefined,chInfo: A) => void | Promise<void>;
export type ChannelReactionOnSubscribeFail<A>  = (err: object,chInfo: A) => void | Promise<void>;
export type ChannelReactionOnSubscribe<A>      = (chInfo: A) => void | Promise<void>;
export type ChannelReactionOnUnsubscribe<A>    = (fromClient: boolean,chInfo: A) => void | Promise<void>;

//Event
export type EventReactionOnConnect                  = (isFirstConnection) => void | Promise<void>;
export type EventReactionOnFirstConnect             = () => void | Promise<void>;
export type EventReactionOnReconnect                = () => void | Promise<void>;
export type EventReactionOnServerDisconnect         = (code: number | undefined, data: object | string | undefined) => void | Promise<void>;
export type EventReactionOnClientDisconnect         = (code: number | undefined, data: object | string | undefined) => void | Promise<void>;
export type EventReactionOnDisconnect               = (fromClient: boolean, code: number | undefined, data: object | string | undefined) => void | Promise<void>;
export type EventReactionOnAuthenticate             = (signedJwtToken: string) => void | Promise<void>;
export type EventReactionOnClinetDeauthenticate     = (oldSignedJwtToken: string) => void | Promise<void>;
export type EventReactionOnServerDeauthenticate     = (oldSignedJwtToken: string) => void | Promise<void>;
export type EventReactionOnDeauthenticate           = (fromClient: boolean, oldSignedJwtToken: string) => void | Promise<void>;
export type EventReactionOnConnectAbort             = (code: number | undefined, data: object | string | undefined) => void | Promise<void>;
export type EventReactionOnConnecting               = () => void | Promise<void>;
export type EventReactionOnError                    = (err: any) => void | Promise<void>;
export type EventReactionOnClose                    = (code: number | undefined, data: object | string | undefined) => void | Promise<void>;

//ReactionBox
export type WillProcess                  = () => void | Promise<void>;
export type DidProcess                   = () => void | Promise<void>;