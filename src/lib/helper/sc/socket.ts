/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {Channel} from "./channel";

export type OnHandlerFunction = (data : any, response : ResponseFunction) => void
export type ResponseFunction = (err : any | number, responseData : any) => void

export interface Socket
{
    id : string;
    state : string;
    pendingReconnect : boolean;
    pendingReconnectTimeout : number;
    connectAttempts : number;
    authState : string;
    authToken : null | object;
    signedAuthToken : null | string;
    channels : object;

    CONNECTING : string;
    OPEN : string;
    CLOSED : string;
    AUTHENTICATED : string;
    UNAUTHENTICATED : string;

    connect() : void;
    getState() : string;
    getAuthToken() : null | object;
    getSignedAuthToken() : null | string;
    disconnect(code ?: number, data ?: string | object) : void;
    emit(event : string,data : any, callback ?: ResponseFunction) : void;
    on(event : string, handler : OnHandlerFunction) : void;
    off(event ?: string, handler ?: Function) : void;
    send(data : any, options ?: object) : void;
    authenticate(encryptedTokenString : string,callback ?: Function) : void;
    deauthenticate(callback ?: Function) :void;

    publish(channelName : string, data : any, callback ?: Function) : void;
    subscribe(channelName : string,options ?: object) : void;
    unsubscribe(channelName : string) : void;
    channel(channelName : string) : Channel
    watch(channelName : string,handler : Function) : void;
    unwatch(channelName : string, handler ?: Function) : void;
    watchers(channelName) : Function[];
    destroyChannel(channelName) : void;
    subscriptions(includingPending : boolean) : string[];
    isSubscribed(channelName : string,includingPending ?: boolean) : boolean;
    destroy() : void;
}


