/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import AuthEngine             = require("../helper/auth/authEngine");
import Const                  = require('../helper/constants/constWrapper');
import ChannelEngine          = require("../helper/channel/channelEngine");
import Box                    = require("../helper/box/box");
import ResponseReactionBox    = require("./responseReactionBox");
import ChannelReactionBox     = require("./channelReactionBox");
import WsRequest              = require("./wsRequest");
import Response               = require("./response");
import SendEngine             = require("../helper/send/sendEngine");
const  SocketClusterClient    = require('socketcluster-client');
import {SendAble}               from "../helper/request/sendAble";
// noinspection TypeScriptPreferShortImport
import {ProtocolType}           from "../helper/constants/protocolType";
import {ZationOptions}          from "./zationOptions";
import {ProgressHandler}        from "../helper/request/progressHandler";
import ZationRequest          = require("../helper/request/zationRequest");
import RequestBuilder         = require("../helper/request/requestBuilder");
import ConnectionAbortError   = require("../helper/error/connectionAbortError");
import ZationConfig           = require("../helper/config/zationConfig");
import EventReactionBox       = require("./eventReactionBox");
import {OnHandlerFunction, ResponseFunction, Socket} from "../helper/sc/socket";
import ObjectPath             = require("../helper/tools/objectPath");
import ConnectionNeededError  = require("../helper/error/connectionNeededError");
import Logger = require("../helper/Logger/logger");
import {Events} from "../helper/constants/events";

class Zation
{
    private readonly authEngine : AuthEngine;
    private readonly channelEngine : ChannelEngine;
    private readonly zc : ZationConfig;

    //Responds
    private readonly responseReactionMainBox : Box<ResponseReactionBox>;
    private readonly channelReactionMainBox : Box<ChannelReactionBox>;
    private readonly eventReactionMainBox : Box<EventReactionBox>;

    //system reactionBoxes
    private readonly syResponseReactionBox : ResponseReactionBox;
    private readonly syChannelReactionBox : ChannelReactionBox;
    private readonly syEventReactionBox : EventReactionBox;

    private readonly userResponseReactionBox : ResponseReactionBox;
    private readonly userChannelReactionBox : ChannelReactionBox;
    private readonly userEventReactionBox : EventReactionBox;

    //webSockets
    private socket : Socket;

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Creates the main zation client.
     * @param settings
     * @param reactionBox
     */
    constructor(settings : ZationOptions = {},...reactionBox : (ResponseReactionBox | ChannelReactionBox | EventReactionBox)[])
    {
        //config
        this.zc = new ZationConfig(settings);

        this.channelEngine = new ChannelEngine(this);
        this.authEngine = new AuthEngine(this,this.channelEngine);

        //Responds
        this.responseReactionMainBox = new Box<ResponseReactionBox>();
        this.channelReactionMainBox = new Box<ChannelReactionBox>();
        this.eventReactionMainBox = new Box<EventReactionBox>();

        //system reactionBoxes
        this.syResponseReactionBox = new ResponseReactionBox();
        this.syResponseReactionBox._link(this);
        this.userResponseReactionBox = new ResponseReactionBox();
        this.userResponseReactionBox._link(this);
        this.syChannelReactionBox = new ChannelReactionBox();
        this.syChannelReactionBox._link(this);
        this.userChannelReactionBox = new ChannelReactionBox();
        this.userChannelReactionBox._link(this);
        this.syEventReactionBox = new EventReactionBox();
        this.syEventReactionBox._link(this);
        this.userEventReactionBox = new EventReactionBox();
        this.userEventReactionBox._link(this);

        this.responseReactionMainBox.addFixedItem(this.syResponseReactionBox);
        this.responseReactionMainBox.addFixedItem(this.userResponseReactionBox);
        this.channelReactionMainBox.addFixedItem(this.syChannelReactionBox);
        this.channelReactionMainBox.addFixedItem(this.userChannelReactionBox);
        this.eventReactionMainBox.addFixedItem(this.syEventReactionBox);
        this.eventReactionMainBox.addFixedItem(this.userEventReactionBox);
        this._addSystemReactions();
        this.addReactionBox(...reactionBox);
    }

    private _addSystemReactions()
    {
        //response for update new token by http req
        this.syResponseReactionBox.onResponse(async (response) => {
            if(response.hasNewToken())
            {
                const signToken = response.getNewSignedToken();
                const plainToken = response.getNewPlainToken();
                if(!!signToken && !!plainToken) {
                    if(this.isSocketConnected()) {
                        try{
                            await this.signAuthenticate(signToken);
                        }
                        catch(e){}
                    }
                    else{
                        await this.authEngine.refreshToken(plainToken,signToken);
                    }
                }
            }

            if(response.hasZationHttpInfo(Const.Settings.ZATION_HTTP_INFO.DEAUTHENTICATE)) {
                await this.authEngine.deauthenticate();
            }
        });
    }

    //Part Responds
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Removes all reaction boxes that you added.
     */
    removeAllReactionBoxes() : void
    {
        this.responseReactionMainBox.removeAllItems();
        this.channelReactionMainBox.removeAllItems();
        this.eventReactionMainBox.removeAllItems();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Add a reactionBox or more reactionBoxes.
     * @example
     * addReactionBox(myResponseReactionBox,myChannelReactionBox,myEventReactionBox);
     * @param reactionBox
     */
    addReactionBox(...reactionBox : (ResponseReactionBox | ChannelReactionBox | EventReactionBox)[]) : void
    {
        for(let i = 0; i < reactionBox.length; i++) {
            const box = reactionBox[i];
            box._link(this);
            if(box instanceof ResponseReactionBox) {
                this.responseReactionMainBox.addItem(box);
            }
            else if(box instanceof ChannelReactionBox) {
                this.channelReactionMainBox.addItem(box);
            }
            else {
                // noinspection SuspiciousInstanceOfGuard
                if(box instanceof EventReactionBox) {
                    this.eventReactionMainBox.addItem(box);
                }
            }
        }
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove a reactionBox or more reactionBoxes.
     * @example
     * removeReactionBox(myResponseReactionBox,myChannelReactionBox,myEventReactionBox);
     * @param reactionBox
     */
    removeReactionBox(...reactionBox : (ResponseReactionBox | ChannelReactionBox | EventReactionBox)[]): void
    {
        for(let i = 0; i < reactionBox.length; i++) {
            const box = reactionBox[i];
            if(box instanceof ResponseReactionBox) {
                if(this.responseReactionMainBox.removeItem(box)){
                    box._unlink();
                }
            }

            else if(box instanceof ChannelReactionBox) {
                if(this.channelReactionMainBox.removeItem(box)){
                    box._unlink();
                }
            }
            else {
                // noinspection SuspiciousInstanceOfGuard
                if(box instanceof EventReactionBox) {
                    if(this.eventReactionMainBox.removeItem(box)){
                        box._unlink();
                    }
                }
            }
        }
    }

    //Part Reaction Add
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the system fixed user channel reaction box.
     */
    channelReact() : ChannelReactionBox {
        return this.userChannelReactionBox;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the system fixed user response reaction box.
     */
    responseReact() : ResponseReactionBox {
        return this.userResponseReactionBox;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the system fixed user event reaction box.
     */
    eventReact() : EventReactionBox {
        return this.userEventReactionBox;
    }

    //Part Ping

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Send a ping request to the server
     * and returns the ping time.
     * @example
     * const ping = await ping();
     * @throws ConnectionNeededError
     */
    async ping() : Promise<number>
    {
        const req = new WsRequest(Const.SyController.PING,{},true);
        const start = Date.now();
        await this.send(req);
        return Date.now() - start;
    }

    //Part Auth
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Don't use this method,
     * it is used internal and returns the auth engine.
     */
    _getAuthEngine() : AuthEngine {
        return this.authEngine;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Authenticate this connection (use authentication controller)
     * with authentication data and returns the response.
     * @example
     * await authenticate({userName : 'Tim', password : 'opqdjß2jdp1d'});
     * @throws ConnectionNeededError(if using protocol type webSocket)
     */
    async authenticate(authData : object, protocolType : ProtocolType = ProtocolType.WebSocket) : Promise<Response> {
        return await this.authEngine.authenticate(authData,protocolType);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Authenticate this connection by using an signed token.
     * @throws ConnectionNeededError, SignAuthenticationFailError
     */
    async signAuthenticate(signToken : string) : Promise<void> {
        await this.authEngine.signAuthenticate(signToken);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Deauthenticate the connection if it is authenticated.
     * @throws DeauthenticationFailError
     */
    async deauthenticate() : Promise<void> {
        await this.authEngine.deauthenticate();
    }

    //Part Easy
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Connect and authenticate the client
     * and returns the Response from the authentication.
     * @example
     * await conAndAuth({userName : 'Tim', password : 'opqdjß2jdp1d'});
     * @throws connectionAbortError
     */
    async conAuth(authData : object) : Promise<Response>
    {
        await this.connect();
        return await this.authenticate(authData);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Deauthenticate and disconnect the client.
     * @example
     * @throws ConnectionNeededError, DeauthenticationFailError
     * @param code error code (disconnection)
     * @param data reason code for disconnection
     */
    async deauthDis(code ?: number, data ?: object | string) : Promise<void>
    {
        await this.deauthenticate();
        await this.disconnect(code,data);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns request builder.
     * Where you can easy build an request.
     */
    buildReq() : RequestBuilder {
        return new RequestBuilder(this);
    }

    //Part Send
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Send a sendAble object.
     * Optional you can add a progressHandler and responseReactionBox/es.
     * @throws ConnectionNeededError
     * @return Response
     */
    async send(sendAble : SendAble, progressHandler ?: ProgressHandler, ...responseReactionBox : ResponseReactionBox[]) : Promise<Response>
    {
        let ph : undefined | ProgressHandler = undefined;
        if(!!progressHandler) {
            ph = progressHandler;
        }
        else if(sendAble instanceof ZationRequest) {
            ph = sendAble.getPogressHandler();
        }

        const jsonObj = await sendAble.getSendData(this);

        let response : Response;
        if(sendAble.getProtocol() === ProtocolType.WebSocket) {
            response = await SendEngine.wsSend(this,jsonObj,ph);
        }
        else {
            response = await SendEngine.httpSend(this,jsonObj,ph);
        }

        await this._triggerResponseReactions(response);

        for(let i = 0; i < responseReactionBox.length; i++) {
            await responseReactionBox[i]._trigger(response);
        }

        return response;
    };

    // Part Connection

    //socket interface
    getSocket() : Socket
    {
        return this.socket;
    }

    //socket interface
    hasSocket() : boolean
    {
        return this.socket !== undefined;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the socket is connected to the server.
     */
    isSocketConnected() : boolean {
        return this.socket !== undefined && this.socket.state === this.socket.OPEN;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Connect to the server.
     * Promises will be resolve on connection
     * or throw an ConnectionAbortError by connectAbort.
     * @throws ConnectionAbortError
     */
    connect() : Promise<void>
    {
        return new Promise<void>((resolve,reject)=>
        {
            if(this.isSocketConnected()) {
                resolve();
            }
            else {
                if(this.socket === undefined) {
                    this._buildWsConnection();
                }

                //register
                this.socket.on('connect',() => {
                    this.authEngine.initAuthEngine();
                    this._registerSocketEvents();
                    resolve();
                });

                this.socket.on('connectAbort',(err) => {
                   reject(new ConnectionAbortError(err));
                });

                //start connection
                this.socket.connect();
            }
        })
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Disconnectes the socket if it is connected.
     * @param code error code (disconnection)
     * @param data reason code for disconnection
     */
    disconnect(code ?: number, data ?: object | string) : void
    {
        if(this.isSocketConnected()) {
            this.socket.disconnect(code,data);
        }
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Reconnect the socket.
     * @param code error code (disconnection)
     * @param data reason code for disconnection
     */
    async reconnect(code ?: number, data ?: object | string) : Promise<void>
    {
       this.disconnect(code,data);
       await this.connect();
    }

    private _registerSocketEvents()
    {
        this.socket.on('error', (err) =>
        {
            if(this.zc.getConfig(Const.Config.DEBUG)) {
                Logger.printError(err);
            }
        });
    }

    private _buildScOptions()
    {
        return {
            hostname: this.zc.getConfig(Const.Config.HOSTNAME),
            port: this.zc.getConfig(Const.Config.PORT),
            secure: this.zc.getConfig(Const.Config.SECURE),
            rejectUnauthorized: this.zc.getConfig(Const.Config.REJECT_UNAUTHORIZED),
            path : this.zc.getConfig(Const.Config.PATH),
            autoReconnect: true,
            autoConnect : false
        };
    }

    private _buildWsConnection()
    {
        // noinspection JSUnresolvedVariable
        this.socket = SocketClusterClient.create(this._buildScOptions());
    }

    //Part Channel Subscribtion
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Subscribe the user channel.
     * Can be useful if auto sub is disabled.
     * Notice if the socket is not connected the resolve of the promise will wait for connection.
     * @throws MissingUserIdError, SubscribeFailError
     */
    async subUserCh() : Promise<void> {
        await this.authEngine.subUserCh();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the socket is subscribes the user channel.
     * @throws MissingUserIdError
     */
    isSubUserCh() : boolean {
       return this.authEngine.isSubUserCh();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Unsubscribes the user channel.
     * @throws MissingUserIdError
     * @param andDestroy
     */
    unsubUserCh(andDestroy : boolean = true) : void {
        this.authEngine.unsubUserCh(andDestroy);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Subscribe the auth user group channel.
     * Can be useful if auto sub is disabled.
     * Notice if the socket is not connected the resolve of the promise will wait for connection.
     * @throws MissingAuthUserGroupError, SubscribeFailError
     */
    async subAuthUserGroupCh() : Promise<void> {
        await this.authEngine.subAuthUserGroupCh();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the socket is subscribes the auth user group channel.
     * @throws MissingAuthUserGroupError
     */
    isSubAuthUserGroupCh() : boolean {
        return this.authEngine.isSubAuthUserGroupCh();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Unsubscribes the auth user group channel.
     * @throws MissingAuthUserGroupError
     * @param andDestroy
     */
    unsubAuthUserGroupCh(andDestroy : boolean = true) : void {
        this.authEngine.unsubAuthUserGroupCh(andDestroy);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Subscribe the default user group channel.
     * Can be useful if auto sub is disabled.
     * Notice if the socket is not connected the resolve of the promise will wait for connection.
     * @throws SubscribeFailError, DeauthenticationNeededError
     */
    async subDefaultUserGroupCh() : Promise<void> {
        await this.authEngine.subDefaultUserGroupCh();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the socket is subscribes the default user group channel.
     */
    isSubDefaultUserGroupCh() : boolean {
        return this.channelEngine.isSubDefaultUserGroupChannel();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Unsubscribes the default user group channel.
     * @param andDestroy
     */
    unsubDefaultUserGroupCh(andDestroy : boolean = true) : void {
        this.authEngine.unsubDefaultUserGroupCh(andDestroy);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Subscribe the all channel.
     * Can be useful if auto sub is disabled.
     * Notice if the socket is not connected the resolve of the promise will wait for connection.
     * @throws SubscribeFailError
     */
    async subAllCh() : Promise<void> {
        await this.channelEngine.subAllChannel();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the socket is subscribes the all channel.
     */
    isSubAllCh() : boolean {
        return this.channelEngine.isSubAllChannel();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Unsubscribes the all channel.
     * @param andDestroy
     */
    unsubAllCh(andDestroy : boolean = true) : void {
        this.channelEngine.unsubAllChannel(andDestroy);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Subscribe a custom channel.
     * Notice if the socket is not connected the resolve of the promise will wait for connection.
     * @throws SubscribeFailError
     * @param chName
     */
    async subCustomCh(chName : string) : Promise<void> {
        await this.channelEngine.subCustomCh(chName);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the socket is subscribes the custom channel.
     * @param chName if not provided it checks
     * if the socket is subscribe any custom channel.
     */
    isSubCustomCh(chName ?: string) : boolean {
        return this.channelEngine.isSubCustomCh(chName);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Unsubscribes custom channel.
     * @param chName if not provided it will unsubscribe all custom channels.
     * @param andDestroy
     * @return
     * An string array with all custom channels there are unsubscribed.
     */
    unsubCustomCh(chName ?: string,andDestroy : boolean = true) : string[] {
        return this.channelEngine.unsubscribeCustomCh(chName,andDestroy);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns all subscribed custom channels in an string array.
     * @param chName if not provided it will return all custom channels which subscribed.
     */
    getSubscribedCustomCh(chName ?: string) : string[] {
        return this.channelEngine.getSubCustomCh(chName);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Subscribe a custom id channel.
     * Notice if the socket is not connected the resolve of the promise will wait for connection.
     * @throws SubscribeFailError
     * @param chName
     * @param chId
     */
    async subCustomIdCh(chName : string, chId : string) : Promise<void> {
        await this.channelEngine.subCustomIdCh(chName,chId);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the socket is subscribes the custom id channel.
     * @param chName if not provided it checks
     * if the socket is subscribe any custom channel.
     * @param chId if not provided it checks
     * if the socket is subscribe any custom channel with channel name.
     */
    isSubCustomIdCh(chName ?: string, chId ?: string) : boolean {
        return this.channelEngine.isSubCustomIdCh(chName,chId);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Unsubscribes custom id channel.
     * @param chName if not provided it will unsubscribe all custom id channels.
     * @param chId if not provided it will unsubscribe all custom id channels with name.
     * @param andDestroy
     * @return
     * An string array with all custom id channels there are unsubscribed.
     */
    unsubCustomIdCh(chName ?: string, chId ?: string,andDestroy : boolean = true) : string[] {
        return this.channelEngine.unsubscribeCustomIdCh(chName,chId,andDestroy);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns all subscribed custom id channels in an string array.
     * @param chName if not provided it will return all custom id channels which subscribed.
     * @param chId if not provided it will return all custom id channels which subscribed and have the
     * same channel name.
     */
    getSubscribedCustomIdCh(chName ?: string, chId ?: string) : string[] {
        return this.channelEngine.getSubCustomIdCh(chName,chId);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Switch the custom id channel subscribtion to another id.
     * By unsubscribe the all custom id channels with ch name and
     * subscribe the new one.
     * Notice if the socket is not connected the resolve of the promise will wait for connection.
     * @throws SubscribeFailError
     * @param channel
     * @param id
     */
    async switchCustomIdCh(channel : string,id : string) : Promise<void>
    {
        this.unsubCustomIdCh(channel);
        await this.subCustomIdCh(channel,id);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Subscribe the panel out channel.
     * Notice if the socket is not connected the resolve of the promise will wait for connection.
     * @throws SubscribeFailError
     */
    async subPanelOutCh() : Promise<void> {
        await this.channelEngine.subPanelOutChannel();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the socket is subscribes the panel out channel.
     */
    isSubPanelOutCh() : boolean {
        return this.channelEngine.isSubPanelOutChannel();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Unsubscribes panel out channel.
     * @param andDestroy
     */
    unsubPanelOutCh(andDestroy : boolean = true) : void {
        this.channelEngine.unsubPanelOutChannel(andDestroy);
    }

    //Part ClientPublish
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Publish in the panel in channel with this client.
     * Notice the publish in middleware is used on server side.
     * @throws ConnectionNeededError, PublishFailError
     * @param event
     * @param data
     */
    async pubPanelInCh(event : string, data : any) : Promise<void> {
        await this.channelEngine.pubPanelInCh(event,data);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Publish in a custom channel with this client.
     * Notice that the socket needs to have access for clientPublish.
     * Keep in mind that it is recommended to use a controller and then let the server publish in the channel.
     * This gives you better control over validation.
     * @throws ConnectionNeededError, PublishFailError
     * @param chName
     * @param event
     * @param data
     */
    async pubCustomCh(chName : string,event : string, data : any) : Promise<void> {
        await this.channelEngine.pubCustomCh(chName,event,data);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Publish in a custom id channel with this client.
     * Notice that the socket needs to have access for clientPublish.
     * Keep in mind that it is recommended to use a controller and then let the server publish in the channel.
     * This gives you better control over validation.
     * @throws ConnectionNeededError, PublishFailError
     * @param chName
     * @param id
     * @param event
     * @param data
     */
    async pubCustomIdCh(chName : string,id : string,event : string, data : any) : Promise<void> {
        await this.channelEngine.pubCustomIdCh(chName,id,event,data);
    }

    //Part CustomTokenVar
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Has a custom token variable with object path.
     * You can access this variables on client and server side.
     * @example
     * hasCustomTokenVar('person.email');
     * @param path
     * @throws AuthenticationNeededError
     */
    hasCustomTokenVar(path ?: string | string[]) : boolean {
        return ObjectPath.has(this.authEngine.getCustomTokenVar(),path);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Get a custom token variable with object path.
     * You can protocolAccess this variables on client and server side.
     * @example
     * getCustomTokenVar('person.email');
     * @param path
     * @throws AuthenticationNeededError
     */
    getCustomTokenVar(path ?: string | string[]) : any {
        return ObjectPath.get(this.authEngine.getCustomTokenVar(),path);
    }

    //Part Token

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns token id of the token form the sc.
     * @throws AuthenticationNeededError
     */
    getTokenId() : string
    {
        return this.authEngine.getTokenVar(Const.Settings.TOKEN.TOKEN_ID);

    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the expire of the token from the sc.
     * @throws AuthenticationNeededError
     */
    getTokenExpire() : number
    {
        return this.authEngine.getTokenVar(Const.Settings.TOKEN.EXPIRE);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the panel access of the token from the sc.
     * @throws AuthenticationNeededError
     */
    getTokenPanelAccess() : boolean
    {
        return this.authEngine.getTokenVar(Const.Settings.TOKEN.PANEL_ACCESS);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the socket is authenticated (token with auth user group).
     */
    isAuthenticated() : boolean
    {
        return this.authEngine.isAuthenticated();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the auth user group.
     * Is undefined if socket is not authenticated.
     */
    getAuthUserGroup() : string | undefined
    {
        return this.authEngine.getAuthUserGroup();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the user id.
     * Is undefined if socket is not authenticated or has not a userId.
     */
    getUserId() : string | number | undefined
    {
        return this.authEngine.getUserId()
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Set on event when server is emit an event.
     * @throws ConnectionNeededError
     */
    on(event : string,handler : OnHandlerFunction) : void
    {
        if(this.isSocketConnected()) {
            this.socket.on(event,handler);
        }
        else {
            throw new ConnectionNeededError('To set on event');

        }
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Emit to server. You can react on the server side
     * by setting an on handler on the server socket. (use socket event).
     * @throws ConnectionNeededError
     */
    emit(event : string,data : any,callback ?: ResponseFunction) : void
    {
        if(this.isSocketConnected()) {
            this.socket.emit(event,data,callback)
        }
        else {
            throw new ConnectionNeededError('To set on event');

        }
    }


    //Part Getter/Setter
    // noinspection JSUnusedGlobalSymbols
    isAutoAllChSub() : boolean {
        return this.zc.getConfig(Const.Config.AUTO_ALL_CH_SUB);
    }

    // noinspection JSUnusedGlobalSymbols
    setAutoAllChSub(value : boolean) : void {
        this.zc.setConfig(Const.Config.AUTO_ALL_CH_SUB,value);
    }

    isAutoUserChSub() : boolean {
        return this.zc.getConfig(Const.Config.AUTO_USER_CH_SUB);
    }

    // noinspection JSUnusedGlobalSymbols
    setAutoUserChSub(value : boolean) : void {
        this.zc.setConfig(Const.Config.AUTO_USER_CH_SUB,value);
    }

    // noinspection JSUnusedGlobalSymbols
    isAutoDefaultUserGroupChSub() : boolean {
        return this.zc.getConfig(Const.Config.AUTO_DEFAULT_USER_GROUP_CH_SUB);
    }

    // noinspection JSUnusedGlobalSymbols
    setAutoDefaultUserGroupChSub(value : boolean) : void {
        this.zc.setConfig(Const.Config.AUTO_DEFAULT_USER_GROUP_CH_SUB,value);
    }

    // noinspection JSUnusedGlobalSymbols
    isAutoAuthUserGroupChSub() : boolean {
        return this.zc.getConfig(Const.Config.AUTO_AUTH_USER_GROUP_CH_SUB);
    }

    // noinspection JSUnusedGlobalSymbols
    setAutoAuthUserGroupChSub(value : boolean) : void {
        this.zc.setConfig(Const.Config.AUTO_AUTH_USER_GROUP_CH_SUB,value);
    }

    // noinspection JSUnusedGlobalSymbols
    getRejectUnauthorized() : boolean{
        return this.zc.getConfig(Const.Config.REJECT_UNAUTHORIZED);
    }

    // noinspection JSUnusedGlobalSymbols
    getSystem() : string {
        return this.zc.getConfig(Const.Config.SYSTEM);
    };

    // noinspection JSUnusedGlobalSymbols
    getVersion() : number {
        return this.zc.getConfig(Const.Config.VERSION);
    };

    // noinspection JSUnusedGlobalSymbols
    getHostname() : string {
        return this.zc.getConfig(Const.Config.HOSTNAME);
    };

    // noinspection JSUnusedGlobalSymbols
    getPort() : number {
        return this.zc.getConfig(Const.Config.PORT);
    };

    // noinspection JSUnusedGlobalSymbols
    getSecure() {
        return this.zc.getConfig(Const.Config.SECURE);
    };

    // noinspection JSUnusedGlobalSymbols
    isDebug() : boolean {
        return this.zc.getConfig(Const.Config.DEBUG);
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the full server address with hostname, port and path.
     */
    getServerAddress() : string
    {
        const path = this.zc.getConfig(Const.Config.PATH);
        const hostname = this.zc.getConfig(Const.Config.HOSTNAME);
        const port = this.zc.getConfig(Const.Config.PORT);
        return `${hostname}:${port}${path}`;
    };

    _getChannelReactionMainBox() : Box<ChannelReactionBox> {
        return this.channelReactionMainBox;
    }

    //Part trigger
    private async _triggerResponseReactions(response : Response) : Promise<void>
    {
        await this.responseReactionMainBox.forEach(async (responseReactionBox : ResponseReactionBox) => {
            await responseReactionBox._trigger(response);
        });
    }

    private async _triggerEventReactions(event : Events,...arg : any[]) : Promise<void>
    {
        await this.eventReactionMainBox.forEach(async (eventReactionBox : EventReactionBox) => {
            await eventReactionBox._trigger(event,...arg);
        });
    }
}

export = Zation;