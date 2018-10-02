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
import ConBackup              = require("../helper/connection/conBackup");
import WsRequest              = require("./wsRequest");
import Response               = require("./response");
import SendEngine             = require("../helper/send/sendEngine");
const  SocketClusterClient    = require('socketcluster-client');
import {SendAble}               from "../helper/request/sendAble";
import {ProtocolType}           from "../helper/constants/protocolType";
import {ZationOptions}          from "./zationOptions";
import {ProgressHandler}        from "../helper/request/progressHandler";
import ZationRequest          = require("../helper/request/zationRequest");
import RequestBuilder         = require("../helper/request/requestBuilder");
import ConnectionAbortError   = require("../helper/error/connectionAbortError");
import ZationConfig           = require("../helper/config/ZationConfig");
import EventReactionBox       = require("./eventReactionBox");
import {Socket}                 from "../helper/sc/socket";
import ObjectPath             = require("../helper/tools/objectPath");

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
    private conBackup : ConBackup;

    constructor(settings : ZationOptions = {},...reactionBox : (ResponseReactionBox | ChannelReactionBox)[])
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
        this.userResponseReactionBox = new ResponseReactionBox();
        this.syChannelReactionBox = new ChannelReactionBox();
        this.userChannelReactionBox = new ChannelReactionBox();
        this.syEventReactionBox = new EventReactionBox();
        this.userEventReactionBox = new EventReactionBox();

        this.responseReactionMainBox.addFixedItem(this.syResponseReactionBox);
        this.responseReactionMainBox.addFixedItem(this.userResponseReactionBox);
        this.channelReactionMainBox.addFixedItem(this.syChannelReactionBox);
        this.channelReactionMainBox.addFixedItem(this.userChannelReactionBox);
        this.eventReactionMainBox.addFixedItem(this.syEventReactionBox);
        this.eventReactionMainBox.addFixedItem(this.userEventReactionBox);
        this.addReactionBox(...reactionBox);
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
     * Add a reactionBox or more reactionBoxes
     * @example
     * addReactionBox(myResponseReactionBox,myChannelReactionBox,myEventReactionBox);
     * @param reactionBox
     */
    addReactionBox(...reactionBox : (ResponseReactionBox | ChannelReactionBox | EventReactionBox)[]) : void
    {
        for(let i = 0; i < reactionBox.length; i++) {
            const box = reactionBox[i];
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
     * Remove a reactionBox or more reactionBoxes
     * @example
     * removeReactionBox(myResponseReactionBox,myChannelReactionBox,myEventReactionBox);
     * @param reactionBox
     */
    removeReactionBox(...reactionBox : (ResponseReactionBox | ChannelReactionBox | EventReactionBox)[]): void
    {
        for(let i = 0; i < reactionBox.length; i++) {
            const box = reactionBox[i];
            if(box instanceof ResponseReactionBox) {
                this.responseReactionMainBox.removeItem(box);
            }
            else if(box instanceof ChannelReactionBox) {
                this.channelReactionMainBox.removeItem(box);
            }
            else {
                // noinspection SuspiciousInstanceOfGuard
                if(box instanceof EventReactionBox) {
                    this.eventReactionMainBox.removeItem(box);
                }
            }
        }
    }

    //Part Reaction Add
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the system fixed user channel reaction box
     */
    channelReact() : ChannelReactionBox {
        return this.userChannelReactionBox;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the system fixed user response reaction box
     */
    responseReact() : ResponseReactionBox {
        return this.userResponseReactionBox;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the system fixed user event reaction box
     */
    eventReact() : EventReactionBox {
        return this.userEventReactionBox;
    }

    //Part Ping

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Send a ping request to the server
     * and returns the ping time
     * @example
     * const ping = await ping();
     * @throws ConnectionNeededError
     */
    async ping() : Promise<number>
    {
        const req = new WsRequest(Const.SyController.PING);
        const start = Date.now();
        await this.send(req);
        return Date.now() - start;
    }

    //Part Auth
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Don't use this method,
     * it is used internal and returns the auth engine
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
     * @throws ConnectionNeededError
     */
    async authenticate(authData : object, protocolType : ProtocolType = ProtocolType.WebSocket) : Promise<Response> {
        return await this.authEngine.authenticate(authData,protocolType);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Deauthenticate the connection
     * if it is authenticated
     */
    deauthenticate() : void {
        //...
    }

    //Part Easy
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Connect and authenticate the client
     * and returns the Response from the authentication.
     * @example
     * await conAndAuth({userName : 'Tim', password : 'opqdjß2jdp1d'});
     * @throws ConnectionNeededError, ConnectionAbortError
     */
    async conAuth(authData : object) : Promise<Response>
    {
        await this.connect();
        return await this.authenticate(authData);
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
    async send(sendAble : SendAble, progressHandler ?: ProgressHandler, responseReactionBox ?: ResponseReactionBox) : Promise<Response>
    {
        let ph : undefined | ProgressHandler = undefined;
        if(!!progressHandler) {
            ph = progressHandler;
        }
        else if(sendAble instanceof ZationRequest) {
            ph = sendAble.getPogressHandler();
        }

        let jsonObj = await sendAble.getSendData(this);

        let response : Response;

        if(sendAble.getProtocol() === ProtocolType.WebSocket) {
            response = await SendEngine.wsSend(this,jsonObj,ph);
            await this._triggerResponseReactions(response);
        }
        else {
            response = await SendEngine.httpSend(this,jsonObj,ph);
            await this._triggerResponseReactions(response);
        }

        if(!!responseReactionBox) {
            responseReactionBox.trigger(response);
        }

        return response;
    };

    // Part Connection

    //socket interface
    getSocket() : Socket
    {
        return this.socket;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the socket is connected to the server
     */
    isSocketConnected() : boolean {
        return this.socket !== undefined && this.socket.state === this.socket.OPEN;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Connect to the server
     * Promises will be resolve on connection
     * Or throw an ConnectionAbortError by connectAbort
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
                    this.conBackup = new ConBackup(this);
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
     * Reconnect the socket
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
     * @throws ConnectionNeededError, MissingUserIdError, SubscribeFailError
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
     * @throws ConnectionNeededError, MissingAuthUserGroupError, SubscribeFailError
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
     * @throws ConnectionNeededError, SubscribeFailError, NotAuthenticatedNeededError
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
     * @throws ConnectionNeededError, SubscribeFailError
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
     * @throws ConnectionNeededError, SubscribeFailError
     */
    async subCustomCh(chName : string) : Promise<void> {
        await this.channelEngine.registerCustomCh(chName);
    }

    // noinspection JSUnusedGlobalSymbols
    isSubCustomCh(chName ?: string) : boolean {
        return this.channelEngine.isSubCustomCh(chName);
    }

    // noinspection JSUnusedGlobalSymbols
    unsubCustomCh(chName ?: string,andDestroy : boolean = true) : string[] {
        return this.channelEngine.unsubscribeCustomCh(chName,andDestroy);
    }

    // noinspection JSUnusedGlobalSymbols
    getSubscribedCustomCh(chName ?: string) : string[] {
        return this.channelEngine.getSubCustomCh(chName);
    }

    async subCustomIdCh(chName : string, chId : string) : Promise<void> {
        await this.channelEngine.registerCustomIdCh(chName,chId);
    }

    // noinspection JSUnusedGlobalSymbols
    isSubCustomIdCh(chName ?: string, chId ?: string) : boolean {
        return this.channelEngine.isSubCustomIdCh(chName,chId);
    }

    unsubCustomIdCh(chName ?: string, chId ?: string,andDestroy : boolean = true) : string[] {
        return this.channelEngine.unsubscribeCustomIdCh(chName,chId,andDestroy);
    }

    // noinspection JSUnusedGlobalSymbols
    getSubscribedCustomIdCh(chName ?: string, chId ?: string) : string[] {
        return this.channelEngine.getSubCustomIdCh(chName,chId);
    }

    // noinspection JSUnusedGlobalSymbols
    async switchCustomIdCh(channel,id) : Promise<void>
    {
        this.unsubCustomIdCh(channel,id);
        await this.subCustomIdCh(channel,id);
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
    getServerAddress() : string
    {
        const path = this.zc.getConfig(Const.Config.PATH);
        const hostname = this.zc.getConfig(Const.Config.HOSTNAME);
        const port = this.zc.getConfig(Const.Config.PORT);

        if(path) {
            return `${hostname}:${port}`;
        } else {
            return `${hostname}:${port}${path}`;
        }
    };

    _getChannelReactionMainBox() : Box<ChannelReactionBox> {
        return this.channelReactionMainBox;
    }

    //Part trigger RequestResponds
    private async _triggerResponseReactions(response : Response) : Promise<void>
    {
        await this.responseReactionMainBox.forEach(async (responseReactionBox : ResponseReactionBox) => {
            responseReactionBox.trigger(response);
        });
    }

    //Part CustomTokenVar
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Has a custom token variable with object path
     * You can access this variables on client and server side
     * @example
     * hasCustomTokenVar('person.email');
     * @param path
     */
    hasCustomTokenVar(path ?: string | string[]) : boolean {
        return ObjectPath.has(this.tokenEngine.getCustomTokenVar(),path);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Get a custom token variable with object path
     * You can protocolAccess this variables on client and server side
     * @example
     * getCustomTokenVar('person.email');
     * @param path
     */
    getCustomTokenVar(path ?: string | string[]) : any {
        return ObjectPath.get(this.tokenEngine.getCustomTokenVar(),path);
    }

    //Part Token

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns token id of the token form the sc.
     */
    getTokenId() : string | undefined
    {
        return this.tokenEngine.getTokenVariable(Const.Settings.TOKEN.TOKEN_ID);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the expire of the token from the sc.
     */
    getTokenExpire() : string | undefined
    {
        return this.tokenEngine.getTokenVariable(Const.Settings.TOKEN.EXPIRE);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Checks if the current request has a token.
     */
    hasToken() : boolean
    {
        return this.shBridge.getTokenBridge().getToken() !==  undefined;
    }



}

export = Zation;