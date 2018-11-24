/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import AuthEngine = require("../helper/auth/authEngine");
import ChannelEngine = require("../helper/channel/channelEngine");
import Box = require("../helper/box/box");
import ResponseReactionBox = require("./responseReactionBox");
import ChannelReactionBox = require("./channelReactionBox");
import WsRequest = require("./wsRequest");
import Response = require("./response");
import SendEngine = require("../helper/send/sendEngine");
import ZationRequest = require("../helper/request/zationRequest");
import RequestHelper = require("../helper/request/requestHelper");
import ConnectionAbortError = require("../helper/error/connectionAbortError");
import ZationConfig = require("../helper/config/zationConfig");
import EventReactionBox = require("./eventReactionBox");
import ObjectPath = require("../helper/tools/objectPath");
import ConnectionNeededError = require("../helper/error/connectionNeededError");
import Logger = require("../helper/logger/logger");
import AuthRequestHelper = require("../helper/request/authRequestHelper");
import AuthRequest = require("./authRequest");
import ValidationRequestHelper = require("../helper/request/validationRequestHelper");

const  Emitter = require('component-emitter');
const  SocketClusterClient    = require('socketcluster-client');
import {SendAble} from "../helper/request/sendAble";
// noinspection TypeScriptPreferShortImport
import {ProtocolType} from "../helper/constants/protocolType";
import {ZationOptions} from "./zationOptions";
import {ProgressHandler} from "../helper/request/progressHandler";
import {OnHandlerFunction, ResponseFunction, Socket} from "../helper/sc/socket";
import {Events} from "../helper/constants/events";
import {ValidationCheck} from "./validationRequest";
import {ChannelTarget} from "../helper/channel/channelTarget";
import {SystemController} from "../helper/constants/systemController";
import {ZationHttpInfo, ZationToken} from "../helper/constants/internal";
import AuthenticationNeededError = require("../helper/error/authenticationNeededError");
import AuthenticationFailedError = require("../helper/error/authenticationFailedError");

//override for decide between client/server deauthenticate
SocketClusterClient.SCClientSocket.prototype.deauthenticate = function (callback) {
    const self = this;
    this.auth.removeToken(this.authTokenName, function (err, oldToken) {
        if (err) {
            // Non-fatal error - Do not close the connection
            self._onSCError(err);
        } else {
            Emitter.prototype.emit.call(self, 'removeAuthToken', oldToken);
            if (self.state !== self.CLOSED) {
                self.emit('#removeAuthToken');
            }
            self._changeToUnauthenticatedStateAndClearTokens(true);
        }
        callback && callback(err);
    });
};

SocketClusterClient.SCClientSocket.prototype._changeToUnauthenticatedStateAndClearTokens = function (fromClient : boolean = false) {
    if (this.authState !== this.UNAUTHENTICATED) {
        const oldState = this.authState;
        const oldSignedToken = this.signedAuthToken;
        this.authState = this.UNAUTHENTICATED;
        this.signedAuthToken = null;
        this.authToken = null;

        const stateChangeData = {
            oldState: oldState,
            newState: this.authState
        };
        Emitter.prototype.emit.call(this, 'authStateChange', stateChangeData);
        Emitter.prototype.emit.call(this, 'deauthenticate', oldSignedToken,fromClient);
    }
};

//override for decide between client/server unsub channel
SocketClusterClient.SCClientSocket.prototype.unsubscribe = function (channelName) {
    const channel = this.channels[channelName];

    if (channel) {
        if (channel.state !== channel.UNSUBSCRIBED) {
            this._triggerChannelUnsubscribe(channel,undefined,true);
            this._tryUnsubscribe(channel);
        }
    }
};

SocketClusterClient.SCClientSocket.prototype._triggerChannelUnsubscribe = function (channel, newState, fromClient : boolean = false) {
    const channelName = channel.name;
    const oldState = channel.state;

    if (newState) {
        channel.state = newState;
    } else {
        channel.state = channel.UNSUBSCRIBED;
    }
    this._cancelPendingSubscribeCallback(channel);

    if (oldState === channel.SUBSCRIBED) {
        const stateChangeData = {
            channel: channelName,
            oldState: oldState,
            newState: channel.state
        };
        channel.emit('subscribeStateChange', stateChangeData);
        channel.emit('unsubscribe', channelName,fromClient);
        Emitter.prototype.emit.call(this, 'subscribeStateChange', stateChangeData);
        Emitter.prototype.emit.call(this, 'unsubscribe', channelName, fromClient);
    }
};

class Zation
{
    private readonly authEngine : AuthEngine;
    private readonly channelEngine : ChannelEngine;
    private readonly zc : ZationConfig;

    //Responds
    private readonly responseReactionMainBox : Box<ResponseReactionBox>;
    private readonly channelReactionMainBox : Box<ChannelReactionBox>;
    private readonly eventReactionMainBox : Box<EventReactionBox>;

    //User system reaction boxes
    private readonly userResponseReactionBox : ResponseReactionBox;
    private readonly userChannelReactionBox : ChannelReactionBox;
    private readonly userEventReactionBox : EventReactionBox;

    //webSockets
    private socket : Socket;

    private firstConnection : boolean = true;

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Creates the returnTarget zation client.
     * @param settings
     * @param reactionBox
     */
    constructor(settings ?: ZationOptions,...reactionBox : (ResponseReactionBox | ChannelReactionBox | EventReactionBox)[])
    {
        //config
        this.zc = new ZationConfig(settings);

        this.channelEngine = new ChannelEngine(this);
        this.authEngine = new AuthEngine(this,this.channelEngine);

        //Responds
        this.responseReactionMainBox = new Box<ResponseReactionBox>();
        this.channelReactionMainBox = new Box<ChannelReactionBox>();
        this.eventReactionMainBox = new Box<EventReactionBox>();

        //user system reaction boxes
        this.userResponseReactionBox = new ResponseReactionBox();
        this.userResponseReactionBox._link(this);
        this.userChannelReactionBox = new ChannelReactionBox();
        this.userChannelReactionBox._link(this);
        this.userEventReactionBox = new EventReactionBox();
        this.userEventReactionBox._link(this);

        this.responseReactionMainBox.addFixedItem(this.userResponseReactionBox);
        this.channelReactionMainBox.addFixedItem(this.userChannelReactionBox);
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
     * Add a reactionBox or more reactionBoxes.
     * Notice that the response reaction boxes are triggerd before the system response reaction box.
     * The system response reaction box is the box that is returned by the method zation.responseReact().
     * The system response reaction box should be used to catch the remaining errors.
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
     * Can be used to catch the remaining errors.
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

    //Part Reaction Boxes

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns a new channel reaction box
     * and add this box to the client.
     */
    newChannelReactionBox(addReactionBoxToClient : boolean = true) : ChannelReactionBox {
        const box = new ChannelReactionBox();
        if(addReactionBoxToClient){this.addReactionBox(box);}
        return box;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns a new response reaction box
     * and add this box to the client.
     */
    newResponseReactionBox(addReactionBoxToClient : boolean = true) : ResponseReactionBox {
        const box = new ResponseReactionBox();
        if(addReactionBoxToClient){this.addReactionBox(box);}
        return box;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns a new event reaction box
     * and add this box to the client.
     */
    newEventReactionBox(addReactionBoxToClient : boolean = true) : EventReactionBox {
        const box = new EventReactionBox();
        if(addReactionBoxToClient){this.addReactionBox(box);}
        return box;
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
        const req = new WsRequest(SystemController.PING,{},true);
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
     * with authentication authData and returns the response.
     * This method automatically throws an AuthenticationFailedError
     * if the response was successful and the client is not authenticated or the response has errors.
     * At the AuthenticationFailedError you have the possibility to react exactly to the response.
     * If you prefer to do it by yourself or for advanced use cases, you should use the other method authRequest.
     * Also notice that the zation response reaction boxes are not triggerd.
     * Because then you have the opportunity to react with the response on specific things
     * then trigger the zation response reaction boxes (using zationReact()).
     * @example
     * try{
     *  await client.authenticate({userName : 'Tim', password : 'opqdjß2jdp1d'});
     * }
     * catch (e : AuthenticationFailedError) {
     *   const response = e.getResponse();
     * }
     * @throws
     * ConnectionNeededError(if using protocol type webSocket)
     * AuthenticationFailedError
     */
    async authenticate(authData : object = {}, protocolType : ProtocolType = ProtocolType.WebSocket) : Promise<Response> {
        const resp = await this.send(new AuthRequest(authData,protocolType),undefined,false);
        resp.react().onSuccessful(() => {
            if(!this.isAuthenticated()){
                throw new AuthenticationFailedError
                ('After authentication request the client is not authenticated.' +
                    'It may have happened because authenticate was not called in the server auth cotroller.',resp);
            }
        }).onError(() => {
            throw new AuthenticationFailedError
            ('The request has an error that means that the authentication has failed.',resp);
        });
        return resp;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Authenticate this connection by using an signed token.
     * @throws ConnectionNeededError, SignAuthenticationFailedError
     */
    async signAuthenticate(signToken : string) : Promise<void> {
        await this.authEngine.signAuthenticate(signToken);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Deauthenticate the connection if it is authenticated.
     * @throws DeauthenticationFailedError
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
     * Notice that the zation response reaction boxes are not triggerd.
     * Because then you have the opportunity to react with the response on specific things
     * then trigger the zation response reaction boxes (using response.react().zationReact()).
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
    async deauthDis(code ?: number, data : object = {}) : Promise<void>
    {
        await this.deauthenticate();
        await this.disconnect(code,data);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns an request helper.
     * Where you can easy build an request with reactions and send it.
     * The default values are:
     * Protocol: WebSocket
     * ControllerName: ''
     * Data: {}
     * SystemController: false
     * UseAuth: true
     * @example
     * await zation.request()
     * .controller('sendMessage')
     * .authData({msg : 'hallo'})
     * .buildCatchError()
     * .presets()
     * .inputNotMatchWithMinLength('msg')
     * .react(()=>{console.log('Message to short')})
     * .catchError(()=>{console.log('Something went wrong')})
     * .onSuccessful(()=>{console.log('Message sent successfully')})
     * .send();
     * @param controllerName
     * @param data
     */
    request(controllerName : string = '',data : object = {}) : RequestHelper {
        const helper = new RequestHelper(this);
        helper.controller(controllerName);
        helper.data(data);
        return helper;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns an auth request helper.
     * Where you can easy build an auth request with reactions and send it.
     * This is another way to authenticate this client.
     * The default values are:
     * Protocol: WebSocket
     * AuthData: {}
     * @example
     * await zation.authRequest()
     * .authData({userName : 'luca',password : '123'})
     * .buildOnError()
     * .nameIs('passwordIsWrong')
     * .react(() => {console.log('The password is wrong')})
     * .catchError(()=>{console.log('Something went wrong')})
     * .onSuccessful(() => {console.log('Successfully authenticated')})
     * .send();
     * @param authData
     * @param protocolType
     */
    authRequest(authData : object = {}, protocolType : ProtocolType = ProtocolType.WebSocket) : AuthRequestHelper {
        const helper = new AuthRequestHelper(this);
        helper.protocol(protocolType);
        helper.authData(authData);
        return helper;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns an validation request helper.
     * Where you can easy build an validation request with reactions and send it.
     * This is useful for checking the verification of individual controller parameters.
     * The default values are:
     * Protocol: WebSocket
     * ControllerName: ''
     * Checks: []
     * @example
     * await zation.validationRequest()
     * .controller('sendMessage')
     * .check('msg','hallo')
     * .buildCatchError()
     * .presets()
     * .inputNotMatchWithMinLength()
     * .react(()=>{console.log('Message to short')})
     * .catchError(()=>{console.log('Something went wrong')})
     * .onSuccessful(()=>{console.log('Message is ok')})
     * .send();
     * @param controllerName
     * @param checks
     */
    validationRequest(controllerName : string = '',...checks : ValidationCheck[]) : ValidationRequestHelper {
        const helper = new ValidationRequestHelper(this);
        helper.controller(controllerName);
        helper.checks(...checks);
        return helper;
    }

    //Part Send
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Send a sendAble object.
     * Optional you can add a progressHandler and responseReactionBox/es.
     * Notice that the response boxes that are passed in are triggerd before the zation boxes.
     * But the zationBoxes are only triggerd if the triggerZationBoxes param is true.
     * @throws ConnectionNeededError
     * @return Response
     * @param sendAble
     * @param progressHandler
     * @param triggerZationBoxes
     * @param responseReactionBox
     */
    async send(sendAble : SendAble, progressHandler ?: ProgressHandler,triggerZationBoxes : boolean = false,...responseReactionBox : ResponseReactionBox[]) : Promise<Response>
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

        await this._respondsActions(response);

        for(let i = 0; i < responseReactionBox.length; i++) {
            await responseReactionBox[i]._trigger(response);
        }

        if(triggerZationBoxes) {
            await this._triggerResponseReactions(response);
        }

        return response;
    };

    private async _respondsActions(response : Response)
    {
        //response for update new token by http req
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

        if(response.hasZationHttpInfo(ZationHttpInfo.DEAUTHENTICATE)) {
            await this.authEngine.deauthenticate();
        }
    }

    // Part Connection

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the current socket.
     * Is undefined if socket is not created.
     */
    getSocket() : Socket {
        return this.socket;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if client has a current socket.
     */
    hasSocket() : boolean {
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
     * The client will also automatically try to establish a new connection when gets disconnected.
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

                this._registerSocketEvents();

                //register
                this.socket.on('connect',async () => {
                    this.authEngine.initAuthEngine();
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
     * The current auth token will not be removed.
     * This means that when the client is reconnected the token is used again.
     * To prevent this, use the function deauthenticate or deauthDis.
     * @param code error code (disconnection)
     * @param data reason code for disconnection
     */
    disconnect(code ?: number, data : object = {}) : void
    {
        if(this.isSocketConnected()) {
            data['#internal-fromZationClient'] = true;
            this.socket.disconnect(code,data);
            this.firstConnection = true;
        }
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Reconnect the socket.
     * @param code error code (disconnection)
     * @param data reason code for disconnection
     */
    async reconnect(code ?: number, data : object = {}) : Promise<void>
    {
       this.disconnect(code,data);
       await this.connect();
    }

    private _registerSocketEvents()
    {
        this.socket.on('connect',async () => {
            if(this.firstConnection) {
                if(this.zc.isDebug()) {
                    Logger.printInfo('Client is first connected.');
                }
                await this._triggerEventReactions(Events.FirstConnect);
            }
            else {
                if(this.zc.isDebug()) {
                    Logger.printInfo('Client is reconnected.');
                }
                await this._triggerEventReactions(Events.Reconnect);
            }
            this.firstConnection = false;

            await this._triggerEventReactions(Events.Connect,this.firstConnection);
        });

        this.socket.on('error', async (err) => {
            if(this.zc.isDebug()) {
                Logger.printError(err);
            }
            await this._triggerEventReactions(Events.Error,err);
        });

        this.socket.on('disconnect',async (code,data) =>
        {
            const fromClient = data['#internal-fromZationClient'];
            if(typeof fromClient === "boolean" && fromClient){
                if(this.zc.isDebug()) {
                    Logger.printInfo(`Client is disconnected from client. Code:'${code}' Data:'${data}'`);
                }
                await this._triggerEventReactions(Events.ClientDisconnect,code,data);
            }
            else{
                if(this.zc.isDebug()) {
                    Logger.printInfo(`Client is disconnected from server. Code:'${code}' Data:'${data}'`);
                }
                await this._triggerEventReactions(Events.ServerDisconnect,code,data);
            }
            await this._triggerEventReactions(Events.Disconnect,!!fromClient,code,data);
        });

        this.socket.on('deauthenticate',async (oldSignedJwtToken,fromClient) =>
        {
            if(fromClient){
                if(this.zc.isDebug()) {
                    Logger.printInfo('Client is deauthenticated from client.');
                }
                await this._triggerEventReactions(Events.ClientDisconnect,oldSignedJwtToken);
            }
            else{
                if(this.zc.isDebug()) {
                    Logger.printInfo('Client is deauthenticated from server.');
                }
                await this._triggerEventReactions(Events.ServerDisconnect,oldSignedJwtToken);
            }
            await this._triggerEventReactions(Events.Disconnect,fromClient,oldSignedJwtToken);
        });

        this.socket.on('connectAbort',async (code,data) => {
            if(this.zc.isDebug()) {
                Logger.printInfo(`Client connect aborted. Code:'${code}' Data:'${data}'`);
            }
            await this._triggerEventReactions(Events.ConnectAbort,code,data);
        });

        this.socket.on('connecting', async () => {
            if(this.zc.isDebug()) {
                Logger.printInfo('Client is connecting.');
            }
            await this._triggerEventReactions(Events.Connecting);
        });

        this.socket.on('close', async (code,data) => {
            await this._triggerEventReactions(Events.Close,code,data);
        });

        this.socket.on('authenticate', async (signedJwtToken) => {
            if(this.zc.isDebug()) {
                Logger.printInfo('Client is authenticated.');
            }
            await this._triggerEventReactions(Events.Authenticate,signedJwtToken);
        });

        //events for any channel
        this.socket.on('kickOut',async (msg,chName) => {
            await this._getChannelReactionMainBox().forEachAll(async (chReactionBox : ChannelReactionBox) => {
                await chReactionBox._triggerEvent(chReactionBox.mapKick,ChannelTarget.ANY,{chFullName : chName},msg);
            });
        });

        this.socket.on('subscribeFail',async (err,chName) => {
            await this._getChannelReactionMainBox().forEachAll(async (chReactionBox : ChannelReactionBox) => {
                await chReactionBox._triggerEvent(chReactionBox.mapSubFail,ChannelTarget.ANY,{chFullName : chName},err);
            });
        });

        this.socket.on('subscribe',async (chName) => {
            await this._getChannelReactionMainBox().forEachAll(async (chReactionBox : ChannelReactionBox) => {
                await chReactionBox._triggerEvent(chReactionBox.mapSub,ChannelTarget.ANY,{chFullName : chName});
            });
        });

        this.socket.on('unsubscribe',async (chName,fromClient) => {
            if(fromClient){
                await this._getChannelReactionMainBox().forEachAll(async (chReactionBox : ChannelReactionBox) => {
                    await chReactionBox._triggerEvent(chReactionBox.mapClientUnsub,ChannelTarget.ANY,{chFullName : chName});
                });
            }
            await this._getChannelReactionMainBox().forEachAll(async (chReactionBox : ChannelReactionBox) => {
                await chReactionBox._triggerEvent(chReactionBox.mapUnsub,ChannelTarget.ANY,{chFullName : chName},fromClient);
            });
        });
    }

    private _buildScOptions()
    {
        return {
            hostname: this.zc.config.hostname,
            port: this.zc.config.port,
            secure: this.zc.config.secure,
            rejectUnauthorized: this.zc.config.rejectUnauthorized,
            path : this.zc.config.path,
            autoReconnect: true,
            autoConnect : false,
            query: {
                system : this.zc.config.system,
                version : this.zc.config.version
            }
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
     * @throws SubscribeFailedError, DeauthenticationNeededError
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
     * @throws SubscribeFailedError
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
     * @throws SubscribeFailedError
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
     * @throws SubscribeFailedError
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
     * @throws SubscribeFailedError
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
     * @throws SubscribeFailedError
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
     * Publish in a user channel with this client.
     * Notice that the channel needs to allow client publish.
     * Keep in mind that it is recommended to use a controller and then let the server publish in the channel.
     * This gives you better control over validation.
     * @throws ConnectionNeededError, PublishFailError
     * @param userId
     * @param event
     * @param data
     */
    async pubUserCh(userId : string | number,event : string, data : any) : Promise<void> {
        await this.channelEngine.pubUserCh(userId,event,data);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Publish in a auth user group channel with this client.
     * Notice that the channel needs to allow client publish.
     * Keep in mind that it is recommended to use a controller and then let the server publish in the channel.
     * This gives you better control over validation.
     * @throws ConnectionNeededError, PublishFailError
     * @param authUserGroup
     * @param event
     * @param data
     */
    async pubAuthUserGroupCh(authUserGroup : string,event : string, data : any) : Promise<void> {
        await this.channelEngine.pubAuthUserGroupCh(authUserGroup,event,data);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Publish in default user group channel with this client.
     * Notice that the channel needs to allow client publish.
     * Keep in mind that it is recommended to use a controller and then let the server publish in the channel.
     * This gives you better control over validation.
     * @throws ConnectionNeededError, PublishFailError
     * @param event
     * @param data
     */
    async pubDefaultUserGroupCh(event : string, data : any) : Promise<void> {
        await this.channelEngine.pubDefaultUserGroupCh(event,data);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Publish in all channel with this client.
     * Notice that the channel needs to allow client publish.
     * Keep in mind that it is recommended to use a controller and then let the server publish in the channel.
     * This gives you better control over validation.
     * @throws ConnectionNeededError, PublishFailError
     * @param event
     * @param data
     */
    async pubAllCh(event : string, data : any) : Promise<void> {
        await this.channelEngine.pubAllCh(event,data);
    }

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

    //Part TokenVar
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Has a token variable with object path.
     * Notice that the token variables are separated from the main zation token variables.
     * You can access this variables on client and server side.
     * But only change, delete or set on the server.
     * @example
     * hasTokenVariable('person.email');
     * @param path
     * @throws AuthenticationNeededError
     */
    hasTokenVariable(path ?: string | string[]) : boolean {
        return ObjectPath.has(this.authEngine.getCustomTokenVariable(),path);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Get a token variable with object path.
     * Notice that the token variables are separated from the main zation token variables.
     * You can access this variables on client and server side.
     * But only change, delete or set on the server.
     * @example
     * getTokenVariable('person.email');
     * @param path
     * @throws AuthenticationNeededError
     */
    getTokenVariable(path ?: string | string[]) : any {
        return ObjectPath.get(this.authEngine.getCustomTokenVariable(),path);
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
       // @ts-ignore
        return this.authEngine.getSecurePlainToken().zationTokenId;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the expire of the token from the sc.
     * @throws AuthenticationNeededError
     */
    getTokenExpire() : number
    {
        // @ts-ignore
        return this.authEngine.getSecurePlainToken().exp;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the panel access of the token from the sc.
     * @throws AuthenticationNeededError
     */
    getTokenPanelAccess() : boolean
    {
        // @ts-ignore
        return this.authEngine.getSecurePlainToken().zationPanelAccess;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the current plain token.
     * @throws AuthenticationNeededError
     */
    getPlainToken() : ZationToken
    {
        return this.authEngine.getSecurePlainToken();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the current sign token.
     * @throws AuthenticationNeededError
     */
    getSignToken() : string
    {
        return this.authEngine.getSecureSignToken();
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
            throw new ConnectionNeededError('To set on event.');

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
            throw new ConnectionNeededError('To emit an event.');

        }
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Send some raw data to the server.
     * This will trigger the socketRaw event on the zation server
     * which will carry the provided data.
     * @throws ConnectionNeededError
     */
    sendRaw(data : any) : void
    {
        if(this.isSocketConnected()) {
            this.socket.send(data);
        }
        else {
            throw new ConnectionNeededError('To send raw data.');

        }
    }

    //Part Getter/Setter
    // noinspection JSUnusedGlobalSymbols
    isAutoAllChSub() : boolean {
        return this.zc.config.autoAllChSub
    }

    // noinspection JSUnusedGlobalSymbols
    setAutoAllChSub(value : boolean) : void {
        this.zc.config.autoAllChSub = value;
    }

    isAutoUserChSub() : boolean {
        return this.zc.config.autoUserChSub;
    }

    // noinspection JSUnusedGlobalSymbols
    setAutoUserChSub(value : boolean) : void {
        this.zc.config.autoUserChSub = value;
    }

    // noinspection JSUnusedGlobalSymbols
    isAutoDefaultUserGroupChSub() : boolean {
        return this.zc.config.autoDefaultUserGroupChSub;
    }

    // noinspection JSUnusedGlobalSymbols
    setAutoDefaultUserGroupChSub(value : boolean) : void {
        this.zc.config.autoDefaultUserGroupChSub = value;
    }

    // noinspection JSUnusedGlobalSymbols
    isAutoAuthUserGroupChSub() : boolean {
        return this.zc.config.autoAuthUserGroupChSub;
    }

    // noinspection JSUnusedGlobalSymbols
    setAutoAuthUserGroupChSub(value : boolean) : void {
        this.zc.config.autoAuthUserGroupChSub = value;
    }

    // noinspection JSUnusedGlobalSymbols
    getRejectUnauthorized() : boolean{
        return this.zc.config.rejectUnauthorized;
    }

    // noinspection JSUnusedGlobalSymbols
    getSystem() : string {
        return this.zc.config.system;
    };

    // noinspection JSUnusedGlobalSymbols
    getVersion() : number {
        return this.zc.config.version;
    };

    // noinspection JSUnusedGlobalSymbols
    getHostname() : string {
        return this.zc.config.hostname;
    };

    // noinspection JSUnusedGlobalSymbols
    getPort() : number {
        return this.zc.config.port;
    };

    // noinspection JSUnusedGlobalSymbols
    getSecure() : boolean {
        return this.zc.config.secure;
    };

    // noinspection JSUnusedGlobalSymbols
    isDebug() : boolean {
        return this.zc.config.debug;
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the full server address with hostname, port and path.
     */
    getServerAddress() : string
    {
        const path = this.zc.config.path;
        const hostname = this.zc.config.hostname;
        const port = this.zc.config.port;
        return `${hostname}:${port}${path}`;
    };

    //Part trigger

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Used internally.
     * Only use this method carefully.
     */
    _getChannelReactionMainBox() : Box<ChannelReactionBox> {
        return this.channelReactionMainBox;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Used internally.
     * Only use this method carefully.
     */
    async _triggerResponseReactions(response : Response) : Promise<void>
    {
        await this.responseReactionMainBox.forEach(async (responseReactionBox : ResponseReactionBox) => {
            await responseReactionBox._trigger(response);
        });
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Used internally.
     * Only use this method carefully.
     */
    private async _triggerEventReactions(event : Events,...arg : any[]) : Promise<void>
    {
        await this.eventReactionMainBox.forEachAll(async (eventReactionBox : EventReactionBox) => {
            await eventReactionBox._trigger(event,...arg);
        });
    }
}

export = Zation;