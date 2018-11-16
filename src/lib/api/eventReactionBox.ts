/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import ReactionBox = require("../helper/react/box/reactionBox");
import {
    EventReactionOnAuthenticate,
    EventReactionOnConnect,
    EventReactionOnClinetDeauthenticate,
    EventReactionOnDisconnect,
    EventReactionOnClientDisconnect,
    EventReactionOnServerDisconnect,
    EventReactionOnServerDeauthenticate,
    EventReactionOnDeauthenticate,
    EventReactionOnConnectAbort,
    EventReactionOnFirstConnect,
    EventReactionOnReconnect, EventReactionOnConnecting, EventReactionOnError, EventReactionOnClose
} from "../helper/react/reaction/reactionHandler";
import {Events} from "../helper/constants/events";
import SboxMapper = require("../helper/box/sboxMapper");

type EventReaction = EventReactionOnAuthenticate | EventReactionOnConnect | EventReactionOnClinetDeauthenticate |
    EventReactionOnDisconnect | EventReactionOnClientDisconnect | EventReactionOnServerDisconnect |
    EventReactionOnServerDeauthenticate | EventReactionOnDeauthenticate | EventReactionOnConnectAbort |
    EventReactionOnFirstConnect | EventReactionOnReconnect | EventReactionOnConnecting | EventReactionOnError |
    EventReactionOnClose

class EventReactionBox extends ReactionBox
{
    private readonly map: SboxMapper<any> = new SboxMapper<any>();
    private lastEventReactionTmp : EventReaction;

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Creates a new EventReactionBox.
     * This box can be linked to the zation client.
     */
    constructor() {
        super();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on clinet is connected (firstConnection and reconnections are included)
     * @example
     * onConnect(() => {isFirstConnection});
     * @param reaction
     * @return
     * It returns the eventReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onConnect(reaction : EventReactionOnConnect) : EventReactionBox {
        this.map.add(Events.Connect,reaction);
        this.lastEventReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on connect reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offConnect(reaction ?: EventReaction) : void {
        this.map.remove(Events.Connect,reaction);
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
    onFirstConnect(reaction : EventReactionOnFirstConnect) : EventReactionBox {
        this.map.add(Events.FirstConnect,reaction);
        this.lastEventReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on first connect reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offFirstConnect(reaction ?: EventReaction) : void {
        this.map.remove(Events.FirstConnect,reaction);
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
    onReconnect(reaction : EventReactionOnReconnect) : EventReactionBox {
        this.map.add(Events.Reconnect,reaction);
        this.lastEventReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on reconnect reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offReconnect(reaction ?: EventReaction) : void {
        this.map.remove(Events.Reconnect,reaction);
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
    onClinetDisconnect(reaction : EventReactionOnClientDisconnect) : EventReactionBox {
        this.map.add(Events.ClientDisconnect,reaction);
        this.lastEventReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on client disconnect reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offClientDisconnect(reaction ?: EventReaction) : void {
        this.map.remove(Events.ClientDisconnect,reaction);
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
    onServerDisconnect(reaction : EventReactionOnServerDisconnect) : EventReactionBox {
        this.map.add(Events.ServerDisconnect,reaction);
        this.lastEventReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on server disconnect reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offServerDisconnect(reaction ?: EventReaction) : void {
        this.map.remove(Events.ServerDisconnect,reaction);
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
    onDisconnect(reaction : EventReactionOnDisconnect) : EventReactionBox {
        this.map.add(Events.Disconnect,reaction);
        this.lastEventReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on disconnect reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offDisconnect(reaction ?: EventReaction) : void {
        this.map.remove(Events.Disconnect,reaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on authenticate.
     * This event triggers if the client becomes authenticated.
     * @example
     * onAuthenticate((signJwtToken) => {});
     * @param reaction
     * @return
     * It returns the eventReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onAuthenticate(reaction : EventReactionOnAuthenticate) : EventReactionBox {
        this.map.add(Events.Authenticate,reaction);
        this.lastEventReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on authenticate reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offAuthenticate(reaction ?: EventReaction) : void {
        this.map.remove(Events.Authenticate,reaction);
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
    onClientDeauthenticate(reaction : EventReactionOnClinetDeauthenticate) : EventReactionBox {
        this.map.add(Events.ClientDeauthenticate,reaction);
        this.lastEventReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on client deauthenticate reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offClientDeauthenticate(reaction ?: EventReaction) : void {
        this.map.remove(Events.ClientDeauthenticate,reaction);
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
    onServerDeauthenticate(reaction : EventReactionOnServerDeauthenticate) : EventReactionBox {
        this.map.add(Events.ServerDeauthenticate,reaction);
        this.lastEventReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on server deauthenticate reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offServerDeauthenticate(reaction ?: EventReaction) : void {
        this.map.remove(Events.ServerDeauthenticate,reaction);
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
    onDeauthenticate(reaction : EventReactionOnDeauthenticate) : EventReactionBox {
        this.map.add(Events.Deauthenticate,reaction);
        this.lastEventReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on server deauthenticate reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offDeauthenticate(reaction ?: EventReaction) : void {
        this.map.remove(Events.Deauthenticate,reaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on connect abort.
     * Triggers when a new connection is aborted for whatever reason.
     * This could be caused by a failure during the connection phase or
     * it may be triggered intentionally by calling zation.disconnect() while the socket is connecting.
     * @example
     * onConnectAbort((code,data) => {});
     * @param reaction
     * @return
     * It returns the eventReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onConnectAbort(reaction : EventReactionOnConnectAbort) : EventReactionBox {
        this.map.add(Events.ConnectAbort,reaction);
        this.lastEventReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on connect abort reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offConnectAbort(reaction ?: EventReaction) : void {
        this.map.remove(Events.ConnectAbort,reaction);
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
    onConnecting(reaction : EventReactionOnConnecting) : EventReactionBox {
        this.map.add(Events.Connecting,reaction);
        this.lastEventReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on connecting reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offConnecting(reaction ?: EventReaction) : void {
        this.map.remove(Events.Connecting,reaction);
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
    onError(reaction : EventReactionOnError) : EventReactionBox {
        this.map.add(Events.Error,reaction);
        this.lastEventReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on error reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offError(reaction ?: EventReaction) : void {
        this.map.remove(Events.Error,reaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on close.
     * Triggers when a socket is disconnected or the connection is aborted
     * @example
     * onClose((code,data) => {});
     * @param reaction
     * @return
     * It returns the eventReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onClose(reaction : EventReactionOnClose) : EventReactionBox {
        this.map.add(Events.Close,reaction);
        this.lastEventReactionTmp = reaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on close reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offClose(reaction ?: EventReaction) : void {
        this.map.remove(Events.Close,reaction);
    }

    private async _triggerDataEventBox(mapKey : number, ...data : any[])
    {
        const box = this.map.tryGet(mapKey);
        if(box) {
            await box.forEachAll(async (reaction : Function) =>
            {
                await reaction(...data);
            });
        }
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Used internally.
     * Only use this method carefully.
     */
    async _trigger(event : Events,...arg : any[])
    {
        if(this.active)
        {
            switch (event)
            {
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

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the last added EventReaction, you can use it to remove the reaction from the box
     * by calling the specific off method.
     * @return
     * It returns the last added EventReaction.
     */
    getLastReaction() : EventReaction {
        return this.lastEventReactionTmp;
    }

}

export = EventReactionBox;