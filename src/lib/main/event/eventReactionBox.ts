/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {Events}      from "../constants/events";
import {ReactionBox} from "../react/reactionBox";
import {ListMap}     from "../container/listMap";

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

type EventReaction = EventReactionOnAuthenticate | EventReactionOnConnect | EventReactionOnClinetDeauthenticate |
    EventReactionOnDisconnect | EventReactionOnClientDisconnect | EventReactionOnServerDisconnect |
    EventReactionOnServerDeauthenticate | EventReactionOnDeauthenticate | EventReactionOnConnectAbort |
    EventReactionOnFirstConnect | EventReactionOnReconnect | EventReactionOnConnecting | EventReactionOnError |
    EventReactionOnClose;

export class EventReactionBox extends ReactionBox<EventReactionBox>
{
    private readonly map: ListMap<any> = new ListMap<any>();
    private readonly onceMap: ListMap<any> = new ListMap<any>();
    protected lastReactionTmp: any;

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Creates a new EventReactionBox.
     * This box can be linked to the zation client.
     */
    constructor() {
        super();
        this.self = this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on clinet is connected (firstConnection and reconnections are included)
     * @example
     * onConnect((isFirstConnection) => {});
     * @param reaction
     * @return
     * It returns the eventReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onConnect(reaction: EventReactionOnConnect): EventReactionBox {
        this.map.add(Events.Connect,reaction);
        this.lastReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on clinet is connected (firstConnection and reconnections are included)
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceConnect((isFirstConnection) => {});
     * @param reaction
     * @return
     * It returns the eventReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceConnect(reaction: EventReactionOnConnect): EventReactionBox {
        this.onceMap.add(Events.Connect,reaction);
        this.lastReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on connect reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offConnect(reaction?: EventReaction): void {
        this.map.remove(Events.Connect,reaction);
        this.onceMap.remove(Events.Connect,reaction)
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React only on the first connect of the client.
     * It will be reset if you disconnect the client self.
     * @example
     * onFirstConnect(() => {});
     * @param reaction
     * @return
     * It returns the eventReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onFirstConnect(reaction: EventReactionOnFirstConnect): EventReactionBox {
        this.map.add(Events.FirstConnect,reaction);
        this.lastReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React only on the first connect of the client.
     * It will be reset if you disconnect the client self.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceFirstConnect(() => {});
     * @param reaction
     * @return
     * It returns the eventReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceFirstConnect(reaction: EventReactionOnFirstConnect): EventReactionBox {
        this.onceMap.add(Events.FirstConnect,reaction);
        this.lastReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on first connect reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offFirstConnect(reaction?: EventReaction): void {
        this.map.remove(Events.FirstConnect,reaction);
        this.onceMap.remove(Events.FirstConnect,reaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React only on reconnect of the client.
     * @example
     * onReconnect(() => {});
     * @param reaction
     * @return
     * @return
     * It returns the eventReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onReconnect(reaction: EventReactionOnReconnect): EventReactionBox {
        this.map.add(Events.Reconnect,reaction);
        this.lastReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React only on reconnect of the client.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceReconnect(() => {});
     * @param reaction
     * @return
     * @return
     * It returns the eventReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceReconnect(reaction: EventReactionOnReconnect): EventReactionBox {
        this.onceMap.add(Events.Reconnect,reaction);
        this.lastReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on reconnect reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offReconnect(reaction?: EventReaction): void {
        this.map.remove(Events.Reconnect,reaction);
        this.onceMap.remove(Events.Reconnect,reaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on disconnect with the client.
     * This event can trigger if you call the disconnect method on the client.
     * @example
     * onClientDisconnect((code,data) => {});
     * @param reaction
     * @return
     * It returns the eventReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onClientDisconnect(reaction: EventReactionOnClientDisconnect): EventReactionBox {
        this.map.add(Events.ClientDisconnect,reaction);
        this.lastReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on disconnect with the client.
     * This event can trigger if you call the disconnect method on the client.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceClientDisconnect((code,data) => {});
     * @param reaction
     * @return
     * It returns the eventReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceClientDisconnect(reaction: EventReactionOnClientDisconnect): EventReactionBox {
        this.onceMap.add(Events.ClientDisconnect,reaction);
        this.lastReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on client disconnect reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offClientDisconnect(reaction?: EventReaction): void {
        this.map.remove(Events.ClientDisconnect,reaction);
        this.onceMap.remove(Events.ClientDisconnect,reaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on disconnect with the server.
     * This event can trigger if the server is disconnet this client or
     * the connection is lost to the server.
     * @example
     * onServerDisconnect((code,data) => {});
     * @param reaction
     * @return
     * It returns the eventReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onServerDisconnect(reaction: EventReactionOnServerDisconnect): EventReactionBox {
        this.map.add(Events.ServerDisconnect,reaction);
        this.lastReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on disconnect with the server.
     * This event can trigger if the server is disconnet this client or
     * the connection is lost to the server.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceServerDisconnect((code,data) => {});
     * @param reaction
     * @return
     * It returns the eventReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceServerDisconnect(reaction: EventReactionOnServerDisconnect): EventReactionBox {
        this.onceMap.add(Events.ServerDisconnect,reaction);
        this.lastReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on server disconnect reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offServerDisconnect(reaction?: EventReaction): void {
        this.map.remove(Events.ServerDisconnect,reaction);
        this.onceMap.remove(Events.ServerDisconnect,reaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on disconnect it handles the client and server disconnections.
     * So this event is trigger if you call the disconnect method on the client,
     * the server is disconnect the client or the connection to the server is lost.
     * @example
     * onDisconnect((fromClient,code,data) => {});
     * @param reaction
     * @return
     * It returns the eventReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onDisconnect(reaction: EventReactionOnDisconnect): EventReactionBox {
        this.map.add(Events.Disconnect,reaction);
        this.lastReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on disconnect it handles the client and server disconnections.
     * So this event is trigger if you call the disconnect method on the client,
     * the server is disconnect the client or the connection to the server is lost.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceDisconnect((fromClient,code,data) => {});
     * @param reaction
     * @return
     * It returns the eventReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceDisconnect(reaction: EventReactionOnDisconnect): EventReactionBox {
        this.onceMap.add(Events.Disconnect,reaction);
        this.lastReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on disconnect reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offDisconnect(reaction?: EventReaction): void {
        this.map.remove(Events.Disconnect,reaction);
        this.onceMap.remove(Events.Disconnect,reaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on authenticate.
     * This event triggers if the client becomes authenticated.
     * Notice that it also triggers every time when the token is updated from the server side.
     * @example
     * onAuthenticate((signJwtToken) => {});
     * @param reaction
     * @return
     * It returns the eventReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onAuthenticate(reaction: EventReactionOnAuthenticate): EventReactionBox {
        this.map.add(Events.Authenticate,reaction);
        this.lastReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on authenticate.
     * This event triggers if the client becomes authenticated.
     * Notice that it also triggers every time when the token is updated from the server side.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceAuthenticate((signJwtToken) => {});
     * @param reaction
     * @return
     * It returns the eventReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceAuthenticate(reaction: EventReactionOnAuthenticate): EventReactionBox {
        this.onceMap.add(Events.Authenticate,reaction);
        this.lastReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on authenticate reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offAuthenticate(reaction?: EventReaction): void {
        this.map.remove(Events.Authenticate,reaction);
        this.onceMap.remove(Events.Authenticate,reaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on client deauthenticate.
     * This event can trigger if you call the deauthenticate method on the client.
     * @example
     * onClientDeauthenticate((oldSignedJwtToken) => {});
     * @param reaction
     * @return
     * It returns the eventReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onClientDeauthenticate(reaction: EventReactionOnClinetDeauthenticate): EventReactionBox {
        this.map.add(Events.ClientDeauthenticate,reaction);
        this.lastReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on client deauthenticate.
     * This event can trigger if you call the deauthenticate method on the client.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceClientDeauthenticate((oldSignedJwtToken) => {});
     * @param reaction
     * @return
     * It returns the eventReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceClientDeauthenticate(reaction: EventReactionOnClinetDeauthenticate): EventReactionBox {
        this.onceMap.add(Events.ClientDeauthenticate,reaction);
        this.lastReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on client deauthenticate reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offClientDeauthenticate(reaction?: EventReaction): void {
        this.map.remove(Events.ClientDeauthenticate,reaction);
        this.onceMap.remove(Events.ClientDeauthenticate,reaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on server deauthenticate.
     * This event can trigger if the client gets deauthenticated from the server side.
     * This can happen if the token is expired or the server is dauthenticate the client.
     * @example
     * onServerDeauthenticate((oldSignedJwtToken) => {});
     * @param reaction
     * @return
     * It returns the eventReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onServerDeauthenticate(reaction: EventReactionOnServerDeauthenticate): EventReactionBox {
        this.map.add(Events.ServerDeauthenticate,reaction);
        this.lastReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on server deauthenticate.
     * This event can trigger if the client gets deauthenticated from the server side.
     * This can happen if the token is expired or the server is dauthenticate the client.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceServerDeauthenticate((oldSignedJwtToken) => {});
     * @param reaction
     * @return
     * It returns the eventReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceServerDeauthenticate(reaction: EventReactionOnServerDeauthenticate): EventReactionBox {
        this.onceMap.add(Events.ServerDeauthenticate,reaction);
        this.lastReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on server deauthenticate reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offServerDeauthenticate(reaction?: EventReaction): void {
        this.map.remove(Events.ServerDeauthenticate,reaction);
        this.onceMap.remove(Events.ServerDeauthenticate,reaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on deauthenticate it handles the client and server deauthenticate.
     * This event can trigger if the client gets deauthenticated from the server side.
     * This can happen if the token is expired or the server is dauthenticate the client.
     * @example
     * onDeauthenticate((fromClient,oldSignedJwtToken) => {});
     * @param reaction
     * @return
     * It returns the eventReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onDeauthenticate(reaction: EventReactionOnDeauthenticate): EventReactionBox {
        this.map.add(Events.Deauthenticate,reaction);
        this.lastReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on deauthenticate it handles the client and server deauthenticate.
     * This event can trigger if the client gets deauthenticated from the server side.
     * This can happen if the token is expired or the server is dauthenticate the client.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceDeauthenticate((fromClient,oldSignedJwtToken) => {});
     * @param reaction
     * @return
     * It returns the eventReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceDeauthenticate(reaction: EventReactionOnDeauthenticate): EventReactionBox {
        this.onceMap.add(Events.Deauthenticate,reaction);
        this.lastReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on server deauthenticate reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offDeauthenticate(reaction?: EventReaction): void {
        this.map.remove(Events.Deauthenticate,reaction);
        this.onceMap.remove(Events.Deauthenticate,reaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on connect abort.
     * Triggers when a new connection is aborted for whatever reason.
     * This could be caused by a failure during the connection phase or
     * it may be triggered intentionally by calling client.disconnect() while the socket is connecting.
     * @example
     * onConnectAbort((code,data) => {});
     * @param reaction
     * @return
     * It returns the eventReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onConnectAbort(reaction: EventReactionOnConnectAbort): EventReactionBox {
        this.map.add(Events.ConnectAbort,reaction);
        this.lastReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on connect abort.
     * Triggers when a new connection is aborted for whatever reason.
     * This could be caused by a failure during the connection phase or
     * it may be triggered intentionally by calling client.disconnect() while the socket is connecting.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceConnectAbort((code,data) => {});
     * @param reaction
     * @return
     * It returns the eventReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceConnectAbort(reaction: EventReactionOnConnectAbort): EventReactionBox {
        this.onceMap.add(Events.ConnectAbort,reaction);
        this.lastReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on connect abort reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offConnectAbort(reaction?: EventReaction): void {
        this.map.remove(Events.ConnectAbort,reaction);
        this.onceMap.remove(Events.ConnectAbort,reaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on connecting.
     * Triggers whenever the socket initiates a connection to the server.
     * This includes reconnects.
     * @example
     * onConnecting(() => {});
     * @param reaction
     * @return
     * It returns the eventReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onConnecting(reaction: EventReactionOnConnecting): EventReactionBox {
        this.map.add(Events.Connecting,reaction);
        this.lastReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on connecting.
     * Triggers whenever the socket initiates a connection to the server.
     * This includes reconnects.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceConnecting(() => {});
     * @param reaction
     * @return
     * It returns the eventReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceConnecting(reaction: EventReactionOnConnecting): EventReactionBox {
        this.onceMap.add(Events.Connecting,reaction);
        this.lastReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on connecting reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offConnecting(reaction?: EventReaction): void {
        this.map.remove(Events.Connecting,reaction);
        this.onceMap.remove(Events.Connecting,reaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on error.
     * This gets triggered when an error occurs on this client.
     * @example
     * onError((err) => {});
     * @param reaction
     * @return
     * It returns the eventReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onError(reaction: EventReactionOnError): EventReactionBox {
        this.map.add(Events.Error,reaction);
        this.lastReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on error.
     * This gets triggered when an error occurs on this client.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceError((err) => {});
     * @param reaction
     * @return
     * It returns the eventReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceError(reaction: EventReactionOnError): EventReactionBox {
        this.onceMap.add(Events.Error,reaction);
        this.lastReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on error reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offError(reaction?: EventReaction): void {
        this.map.remove(Events.Error,reaction);
        this.onceMap.remove(Events.Error,reaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on close.
     * Triggers when a socket is disconnected or the connection is aborted.
     * @example
     * onClose((code,data) => {});
     * @param reaction
     * @return
     * It returns the eventReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onClose(reaction: EventReactionOnClose): EventReactionBox {
        this.map.add(Events.Close,reaction);
        this.lastReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on close.
     * Triggers when a socket is disconnected or the connection is aborted.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceClose((code,data) => {});
     * @param reaction
     * @return
     * It returns the eventReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceClose(reaction: EventReactionOnClose): EventReactionBox {
        this.onceMap.add(Events.Close,reaction);
        this.lastReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on close reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offClose(reaction?: EventReaction): void {
        this.map.remove(Events.Close,reaction);
        this.onceMap.remove(Events.Close,reaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the last added Reaction, you can use it to remove the reaction from the box
     * by calling the specific off method.
     * @return
     * It returns the last added Reaction.
     */
    getLastReaction(): any {
        return this.lastReactionTmp;
    }

    private async _triggerDataEventBox(mapKey: Events, ...data: any[]) {
        const promises: Promise<void>[] = [];
        const box = this.map.tryGet(mapKey);
        if(box) {
            promises.push(box.forEachParallel(async (reaction: Function) => {
                await reaction(...data);
            }));
        }
        const onceBox = this.onceMap.tryGet(mapKey);
        if(onceBox) {
            const items = onceBox.getItems();
            //will not touch our items above
            onceBox.removeAllItems();
            for(let i = 0; i < items.length; i++) {
                promises.push(items[i](...data));
            }
        }
        await Promise.all(promises);
    }

    async _trigger(event: Events.Connect,...args: Parameters<EventReactionOnConnect>);
    async _trigger(event: Events.FirstConnect,...args: Parameters<EventReactionOnFirstConnect>);
    async _trigger(event: Events.Reconnect,...args: Parameters<EventReactionOnReconnect>);
    async _trigger(event: Events.ServerDisconnect,...args: Parameters<EventReactionOnServerDisconnect>);
    async _trigger(event: Events.ClientDisconnect,...args: Parameters<EventReactionOnClientDisconnect>);
    async _trigger(event: Events.Disconnect,...args: Parameters<EventReactionOnDisconnect>);
    async _trigger(event: Events.Authenticate,...args: Parameters<EventReactionOnAuthenticate>);
    async _trigger(event: Events.ClientDeauthenticate,...args: Parameters<EventReactionOnClinetDeauthenticate>);
    async _trigger(event: Events.ServerDeauthenticate,...args: Parameters<EventReactionOnServerDeauthenticate>);
    async _trigger(event: Events.Deauthenticate,...args: Parameters<EventReactionOnDeauthenticate>);
    async _trigger(event: Events.ConnectAbort,...args: Parameters<EventReactionOnConnectAbort>);
    async _trigger(event: Events.Connecting,...args: Parameters<EventReactionOnConnecting>);
    async _trigger(event: Events.Error,...args: Parameters<EventReactionOnError>);
    async _trigger(event: Events.Close,...args: Parameters<EventReactionOnClose>);
    // noinspection JSUnusedGlobalSymbols
    /**
     * @internal
     * @description
     * Used internally.
     * Only use this method carefully.
     */
    async _trigger(event: Events,...arg: any[])
    {
        if(this.active) {
            switch (event) {
                case Events.Connect:
                    await this._triggerDataEventBox(Events.Connect,...arg);
                    break;
                case Events.FirstConnect:
                    await this._triggerDataEventBox(Events.FirstConnect,...arg);
                    break;
                case Events.Reconnect:
                    await this._triggerDataEventBox(Events.Reconnect,...arg);
                    break;
                case Events.ServerDisconnect:
                    await this._triggerDataEventBox(Events.ServerDisconnect,...arg);
                    break;
                case Events.ClientDisconnect:
                    await this._triggerDataEventBox(Events.ClientDisconnect,...arg);
                    break;
                case Events.Disconnect:
                    await this._triggerDataEventBox(Events.Disconnect,...arg);
                    break;
                case Events.Authenticate:
                    await this._triggerDataEventBox(Events.Authenticate,...arg);
                    break;
                case Events.ClientDeauthenticate:
                    await this._triggerDataEventBox(Events.ClientDeauthenticate,...arg);
                    break;
                case Events.ServerDeauthenticate:
                    await this._triggerDataEventBox(Events.ServerDeauthenticate,...arg);
                    break;
                case Events.Deauthenticate:
                    await this._triggerDataEventBox(Events.Deauthenticate,...arg);
                    break;
                case Events.ConnectAbort:
                    await this._triggerDataEventBox(Events.ConnectAbort,...arg);
                    break;
                case Events.Connecting:
                    await this._triggerDataEventBox(Events.Connecting,...arg);
                    break;
                case Events.Error:
                    await this._triggerDataEventBox(Events.Error,...arg);
                    break;
                case Events.Close:
                    await this._triggerDataEventBox(Events.Close,...arg);
                    break;
            }
        }
    }
}

