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
import Box = require("../helper/box/box");
import {Events} from "../helper/constants/events";

class EventReactionBox extends ReactionBox
{
    private readonly connectReactionBox : Box<EventReactionOnConnect>
        = new Box<EventReactionOnConnect>();

    private readonly firstConnectReactionBox : Box<EventReactionOnFirstConnect>
        = new Box<EventReactionOnFirstConnect>();

    private readonly reconnectReactionBox : Box<EventReactionOnReconnect>
        = new Box<EventReactionOnReconnect>();

    private readonly clientDisconnectReactionBox : Box<EventReactionOnClientDisconnect>
        = new Box<EventReactionOnClientDisconnect>();

    private readonly serverDisconnectReactionBox : Box<EventReactionOnServerDisconnect>
        = new Box<EventReactionOnServerDisconnect>();

    private readonly disconnectReactionBox : Box<EventReactionOnDisconnect>
        = new Box<EventReactionOnDisconnect>();

    private readonly authenticateReactionBox : Box<EventReactionOnAuthenticate>
        = new Box<EventReactionOnAuthenticate>();

    private readonly clientDeauthenticateReactionBox : Box<EventReactionOnClinetDeauthenticate>
        = new Box<EventReactionOnClinetDeauthenticate>();

    private readonly serverDeauthenticateReactionBox : Box<EventReactionOnServerDeauthenticate>
        = new Box<EventReactionOnServerDeauthenticate>();

    private readonly deauthenticateReactionBox : Box<EventReactionOnDeauthenticate>
        = new Box<EventReactionOnDeauthenticate>();

    private readonly connectAbortReactionBox : Box<EventReactionOnConnectAbort>
        = new Box<EventReactionOnConnectAbort>();

    private readonly connectingReactionBox : Box<EventReactionOnConnecting>
        = new Box<EventReactionOnConnecting>();

    private readonly errorReactionBox : Box<EventReactionOnError>
        = new Box<EventReactionOnError>();

    private readonly closeReactionBox : Box<EventReactionOnClose>
        = new Box<EventReactionOnClose>();

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
     * It returns the Reaction, you can use it to remove this Reaction from the box with the off method.
     */
    onConnect(reaction : EventReactionOnConnect) : EventReactionOnConnect {
        this.connectReactionBox.addItem(reaction);
        return reaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on connect reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offConnect(reaction ?: EventReactionOnConnect) : void {
        this.connectReactionBox.remove(reaction);
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
     * It returns the Reaction, you can use it to remove this Reaction from the box with the off method.
     */
    onFirstConnect(reaction : EventReactionOnFirstConnect) : EventReactionOnFirstConnect {
        this.firstConnectReactionBox.addItem(reaction);
        return reaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on first connect reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offFirstConnect(reaction ?: EventReactionOnFirstConnect) : void {
        this.firstConnectReactionBox.remove(reaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React only on reconnect of the client.
     * @example
     * onReconnect(() => {});
     * @param reaction
     * @return
     * It returns the Reaction, you can use it to remove this Reaction from the box with the off method.
     */
    onReconnect(reaction : EventReactionOnReconnect) : EventReactionOnReconnect {
        this.reconnectReactionBox.addItem(reaction);
        return reaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on reconnect reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offReconnect(reaction ?: EventReactionOnReconnect) : void {
        this.reconnectReactionBox.remove(reaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on disconnect with the client.
     * This event can trigger if you call the disconnect method on the client.
     * @example
     * onClientDisconnect((code,authData) => {});
     * @param reaction
     * @return
     * It returns the Reaction, you can use it to remove this Reaction from the box with the off method.
     */
    onClinetDisconnect(reaction : EventReactionOnClientDisconnect) : EventReactionOnClientDisconnect {
        this.clientDisconnectReactionBox.addItem(reaction);
        return reaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on client disconnect reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offClientDisconnect(reaction ?: EventReactionOnClientDisconnect) : void {
        this.clientDisconnectReactionBox.remove(reaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on disconnect with the server.
     * This event can trigger if the server is disconnet this client or
     * the connection is lost to the server.
     * @example
     * onServerDisconnect((code,authData) => {});
     * @param reaction
     * @return
     * It returns the Reaction, you can use it to remove this Reaction from the box with the off method.
     */
    onServerDisconnect(reaction : EventReactionOnServerDisconnect) : EventReactionOnServerDisconnect {
        this.serverDisconnectReactionBox.addItem(reaction);
        return reaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on server disconnect reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offServerDisconnect(reaction ?: EventReactionOnServerDisconnect) : void {
        this.serverDisconnectReactionBox.remove(reaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on disconnect it handles the client and server disconnections.
     * So this event is trigger if you call the disconnect method on the client,
     * the server is disconnect the client or the connection to the server is lost.
     * @example
     * onDisconnect((fromClient,code,authData) => {});
     * @param reaction
     * @return
     * It returns the Reaction, you can use it to remove this Reaction from the box with the off method.
     */
    onDisconnect(reaction : EventReactionOnDisconnect) : EventReactionOnDisconnect {
        this.disconnectReactionBox.addItem(reaction);
        return reaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on disconnect reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offDisconnect(reaction ?: EventReactionOnDisconnect) : void {
        this.disconnectReactionBox.remove(reaction);
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
     * It returns the Reaction, you can use it to remove this Reaction from the box with the off method.
     */
    onAuthenticate(reaction : EventReactionOnAuthenticate) : EventReactionOnAuthenticate {
        this.authenticateReactionBox.addItem(reaction);
        return reaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on authenticate reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offAuthenticate(reaction ?: EventReactionOnAuthenticate) : void {
        this.authenticateReactionBox.remove(reaction);
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
     * It returns the Reaction, you can use it to remove this Reaction from the box with the off method.
     */
    onClientDeauthenticate(reaction : EventReactionOnClinetDeauthenticate) : EventReactionOnClinetDeauthenticate {
        this.clientDeauthenticateReactionBox.addItem(reaction);
        return reaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on client deauthenticate reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offClientDeauthenticate(reaction ?: EventReactionOnClinetDeauthenticate) : void {
        this.clientDeauthenticateReactionBox.remove(reaction);
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
     * It returns the Reaction, you can use it to remove this Reaction from the box with the off method.
     */
    onServerDeauthenticate(reaction : EventReactionOnServerDeauthenticate) : EventReactionOnServerDeauthenticate {
        this.serverDeauthenticateReactionBox.addItem(reaction);
        return reaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on server deauthenticate reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offServerDeauthenticate(reaction ?: EventReactionOnServerDeauthenticate) : void {
        this.serverDeauthenticateReactionBox.remove(reaction);
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
     * It returns the Reaction, you can use it to remove this Reaction from the box with the off method.
     */
    onDeauthenticate(reaction : EventReactionOnDeauthenticate) : EventReactionOnDeauthenticate {
        this.deauthenticateReactionBox.addItem(reaction);
        return reaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on server deauthenticate reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offDeauthenticate(reaction ?: EventReactionOnDeauthenticate) : void {
        this.deauthenticateReactionBox.remove(reaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on connect abort.
     * Triggers when a new connection is aborted for whatever reason.
     * This could be caused by a failure during the connection phase or
     * it may be triggered intentionally by calling zation.disconnect() while the socket is connecting.
     * @example
     * onConnectAbort((code,authData) => {});
     * @param reaction
     * @return
     * It returns the Reaction, you can use it to remove this Reaction from the box with the off method.
     */
    onConnectAbort(reaction : EventReactionOnConnectAbort) : EventReactionOnConnectAbort {
        this.connectAbortReactionBox.addItem(reaction);
        return reaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on connect abort reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offConnectAbort(reaction ?: EventReactionOnConnectAbort) : void {
        this.connectAbortReactionBox.remove(reaction);
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
     * It returns the Reaction, you can use it to remove this Reaction from the box with the off method.
     */
    onConnecting(reaction : EventReactionOnConnecting) : EventReactionOnConnecting {
        this.connectingReactionBox.addItem(reaction);
        return reaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on connecting reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offConnecting(reaction ?: EventReactionOnConnecting) : void {
        this.connectingReactionBox.remove(reaction);
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
     * It returns the Reaction, you can use it to remove this Reaction from the box with the off method.
     */
    onError(reaction : EventReactionOnError) : EventReactionOnError {
        this.errorReactionBox.addItem(reaction);
        return reaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on error reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offError(reaction ?: EventReactionOnError) : void {
        this.errorReactionBox.remove(reaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on close.
     * Triggers when a socket is disconnected or the connection is aborted
     * @example
     * onClose((code,authData) => {});
     * @param reaction
     * @return
     * It returns the Reaction, you can use it to remove this Reaction from the box with the off method.
     */
    onClose(reaction : EventReactionOnClose) : EventReactionOnClose {
        this.closeReactionBox.addItem(reaction);
        return reaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on close reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offClose(reaction ?: EventReactionOnClose) : void {
        this.closeReactionBox.remove(reaction);
    }

    private async _triggerDataEventBox(box : Box<any>,...data : any[])
    {
        let promises : Promise<void>[] = [];
        promises.push(box.forEach(async (reaction : Function) =>
        {
            await reaction(...data);
        }));
        await Promise.all(promises);
    }

    async _trigger(event : Events,...arg : any[])
    {
        if(this.active)
        {
            switch (event)
            {
                case Events.Connect:
                    await this._triggerDataEventBox(this.connectReactionBox,...arg);
                    break;
                case Events.FirstConnect:
                    await this._triggerDataEventBox(this.firstConnectReactionBox,...arg);
                    break;
                case Events.Reconnect:
                    await this._triggerDataEventBox(this.reconnectReactionBox,...arg);
                    break;
                case Events.ServerDisconnect:
                    await this._triggerDataEventBox(this.serverDisconnectReactionBox,...arg);
                    break;
                case Events.ClientDisconnect:
                    await this._triggerDataEventBox(this.clientDisconnectReactionBox,...arg);
                    break;
                case Events.Disconnect:
                    await this._triggerDataEventBox(this.disconnectReactionBox,...arg);
                    break;
                case Events.Authenticate:
                    await this._triggerDataEventBox(this.authenticateReactionBox,...arg);
                    break;
                case Events.ClientDeauthenticate:
                    await this._triggerDataEventBox(this.clientDeauthenticateReactionBox,...arg);
                    break;
                case Events.ServerDeauthenticate:
                    await this._triggerDataEventBox(this.serverDeauthenticateReactionBox,...arg);
                    break;
                case Events.Deauthenticate:
                    await this._triggerDataEventBox(this.deauthenticateReactionBox,...arg);
                    break;
                case Events.ConnectAbort:
                    await this._triggerDataEventBox(this.connectAbortReactionBox,...arg);
                    break;
                case Events.Connecting:
                    await this._triggerDataEventBox(this.connectingReactionBox,...arg);
                    break;
                case Events.Error:
                    await this._triggerDataEventBox(this.errorReactionBox,...arg);
                    break;
                case Events.Close:
                    await this._triggerDataEventBox(this.closeReactionBox,...arg);
                    break;
            }
        }
    }

}

export = EventReactionBox;