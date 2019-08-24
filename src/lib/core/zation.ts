/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {HttpRequest}                 from "../main/request/main/httpRequest";
import {SendAble}                    from "../main/request/helper/sendAble";
import {ProtocolType}                from "../main/constants/protocolType";
import {ZationOptions}               from "./zationOptions";
import {ProgressHandler}             from "../main/request/helper/progressHandler";
import {OnHandlerFunction, Socket}   from "../main/sc/socket";
import {Events}                      from "../main/constants/events";
import {ValidationCheck}             from "../main/request/main/validationRequest";
import {ChannelTarget}               from "../main/channel/channelTarget";
import {SystemController}            from "../main/constants/systemController";
import {ZationCustomEventNamespace, ZationHttpInfo, ZationToken} from "../main/constants/internal";
import ConnectionUtils, {WaitForConnectionOption}               from "../main/utils/connectionUtils";
import {ChannelEngine}               from "../main/channel/channelEngine";
import {ZationConfig}                from "../main/config/zationConfig";
import {Box}                         from "../main/box/box";
import {ResponseReactionBox}         from "../main/react/reactionBoxes/responseReactionBox";
import {ChannelReactionBox}          from "../main/react/reactionBoxes/channelReactionBox";
import {RequestBuilder}              from "../main/request/fluent/requestBuilder";
import {AuthRequestBuilder}          from "../main/request/fluent/authRequestBuilder";
import {ValidationRequestBuilder}    from "../main/request/fluent/validationRequestBuilder";
import {ZationRequest}               from "../main/request/main/zationRequest";
import {SendEngine}                  from "../main/send/sendEngine";
import {ConnectionAbortError}        from "../main/error/connectionAbortError";
import {Logger}                      from "../main/logger/logger";
import {ObjectPath}                  from "../main/utils/objectPath";
import {ConnectionRequiredError}     from "../main/error/connectionRequiredError";
import {AuthenticationFailedError}   from "../main/error/authenticationFailedError";
import {AuthRequest}                 from "../main/request/main/authRequest";
import {EventReactionBox}            from "../main/react/reactionBoxes/eventReactionBox";
import {WsRequest}                   from "../main/request/main/wsRequest";
import {Response}                    from "../main/response/response";
import {AuthEngine}                  from "../main/auth/authEngine";
import {ModifiedScClient}            from "../main/sc/modifiedScClient";
import stringify                     from "fast-stringify";
import {TimeoutError}                from "../main/error/timeoutError";
import DataboxBuilder                from "../main/databox/databoxBuilder";

export class Zation
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

    /**
     * Indicates if the current connection is the first connection of the socket.
     */
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

        this._buildWsSocket();
        this._registerSocketEvents();
        this.authEngine.connectToSocket(this.socket);
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
                this.eventReactionMainBox.addItem(box);
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
                // noinspection SuspiciousInstanceOfGuard,SuspiciousTypeOfGuard
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
     * @throws ConnectionRequiredError,TimeoutError
     * @param waitForConnection
     * With the WaitForConnection option, you can activate that the socket is
     * trying to connect when it is not connected. You have four possible choices:
     * Undefined: It will use the value from the default options.
     * False: The action will fail and throw a ConnectionRequiredError,
     * when the socket is not connected.
     * For the other options, it is also recommended to have activated the auto-reconnect.
     * Null: The socket will try to connect (if it is not connected) and
     * waits until the connection is made, then it continues the action.
     * Number: Same as null, but now you can specify a timeout (in ms) of
     * maximum waiting time for the connection. If the timeout is reached,
     * it will throw a timeout error.
     */
    async ping(waitForConnection : WaitForConnectionOption = undefined) : Promise<number>
    {
        const req = new WsRequest(SystemController.PING,{},true);
        req.setWaitForConnection(waitForConnection);
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
     * ConnectionRequiredError (if using protocol type webSocket)
     * AuthenticationFailedError
     * TimeoutError
     * @param authData
     * @param protocolType
     * @param waitForConnection
     * With the WaitForConnection option, you can activate that the socket is
     * trying to connect when it is not connected. You have four possible choices:
     * Undefined: It will use the value from the default options.
     * False: The action will fail and throw a ConnectionRequiredError,
     * when the socket is not connected.
     * For the other options, it is also recommended to have activated the auto-reconnect.
     * Null: The socket will try to connect (if it is not connected) and
     * waits until the connection is made, then it continues the action.
     * Number: Same as null, but now you can specify a timeout (in ms) of
     * maximum waiting time for the connection. If the timeout is reached,
     * it will throw a timeout error.
     */
    async authenticate(authData : object = {}, protocolType : ProtocolType = ProtocolType.WebSocket,waitForConnection : WaitForConnectionOption = undefined) : Promise<Response>
    {
        const req = new AuthRequest(authData,protocolType);
        req.setWaitForConnection(waitForConnection);
        const resp = await this.send(req,undefined,false);
        if(resp.isSuccessful()) {
            if(!this.isAuthenticated()) {
                throw new AuthenticationFailedError
                ('After authentication request the client is not authenticated.' +
                    'It may have happened because authenticate was not called in the server auth cotroller.',resp);
            }
        }
        else {
            throw new AuthenticationFailedError
            ('The request has an error that means that the authentication has failed.',resp);
        }
        return resp;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Authenticate this connection by using an signed token.
     * @throws ConnectionRequiredError, SignAuthenticationFailedError, TimeoutError
     * @param signToken
     * @param waitForConnection
     * With the WaitForConnection option, you can activate that the socket is
     * trying to connect when it is not connected. You have four possible choices:
     * Undefined: It will use the value from the default options.
     * False: The action will fail and throw a ConnectionRequiredError,
     * when the socket is not connected.
     * For the other options, it is also recommended to have activated the auto-reconnect.
     * Null: The socket will try to connect (if it is not connected) and
     * waits until the connection is made, then it continues the action.
     * Number: Same as null, but now you can specify a timeout (in ms) of
     * maximum waiting time for the connection. If the timeout is reached,
     * it will throw a timeout error.
     */
    async signAuthenticate(signToken : string,waitForConnection : WaitForConnectionOption = undefined) : Promise<void> {
        await this.authEngine.signAuthenticate(signToken,waitForConnection);
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
     * @param authData The authentication credentials for the client.
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
     * @throws DeauthenticationFailError
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
     * Controller: ''
     * Data: {}
     * SystemController: false
     * UseAuth: true
     * AttachedHttpContent: []
     * @example
     * await zation.request()
     * .controller('sendMessage')
     * .data({msg : 'hallo'})
     * .buildCatchError()
     * .presets()
     * .inputNotMatchWithMinLength('msg')
     * .react(()=>{console.log('Message to short')})
     * .catchError(()=>{console.log('Something went wrong')})
     * .onSuccessful(()=>{console.log('Message sent successfully')})
     * .send();
     * @param controller
     * @param data
     */
    request(controller : string = '',data : object = {}) : RequestBuilder {
        const helper = new RequestBuilder(this);
        helper.controller(controller);
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
     * AttachedHttpContent: []
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
    authRequest(authData : object = {}, protocolType : ProtocolType = ProtocolType.WebSocket) : AuthRequestBuilder {
        const helper = new AuthRequestBuilder(this);
        helper.protocol(protocolType);
        helper.authData(authData);
        return helper;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns an validation request helper.
     * Where you can easy build an validation request with reactions and send it.
     * This is useful for validate individual controller parameters.
     * The default values are:
     * Protocol: WebSocket
     * Controller: ''
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
     * @param controller
     * @param checks
     */
    validationRequest(controller : string = '',...checks : ValidationCheck[]) : ValidationRequestBuilder {
        const helper = new ValidationRequestBuilder(this);
        helper.controller(controller);
        helper.checks(...checks);
        return helper;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns a Databox builder, which helps you to build the
     * settings for connecting to the Databox on the server.
     * The builder returns a new Databox object, with this object
     * you easily can connect to a Databox on the server-side.
     * The Databox handes mostly everything: disconnections,
     * cud updates missing, restores.
     * It will do everything that it always has the newest data.
     * @param name
     * The name of the Databox that is also used to register a
     * Databox in the configuration of the server.
     * @param id
     * The id is only needed if you want to connect to a DataboxFamiliy.
     * The id represents the member id of the family.
     */
    databox(name : string,id ?: string | number) : DataboxBuilder {
        return new DataboxBuilder(this,name,id);
    }

    //Part Send
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Send a sendAble object.
     * Should be used for sending AuthRequests,HttpRequests,ValidationRequests,WsRequests and ZationRequests.
     * Optional you can add a progressHandler and responseReactionBox/es.
     * Notice that the response boxes that are passed in are triggerd before the zation boxes.
     * But the zationBoxes are only triggerd if the triggerZationBoxes param is true.
     * @throws ConnectionRequiredError,TimeoutError
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
            response = await SendEngine.wsSend(this,jsonObj,sendAble.getTimeout(),ph,sendAble.getWaitForConnection());
        }
        else {
            let attachedHttpContent : undefined | {key : string, data : Blob | string}[] = undefined;

            if(sendAble instanceof HttpRequest || sendAble instanceof AuthRequest) {
                attachedHttpContent = sendAble.getAttachedHttpContent();
            }

            response = await SendEngine.httpSend(this,jsonObj,sendAble.getTimeout(),attachedHttpContent,ph);
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
                if(this.isConnected()) {
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
     */
    getSocket() : Socket {
        return this.socket;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the socket is connected to the server.
     */
    isConnected() : boolean {
        return this.socket.state === this.socket.OPEN;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Connect to the server.
     * Promises will be resolve on connection
     * or throw an ConnectionAbortError by connectAbort.
     * If the option autoReconnect is activated,
     * the client will automatically try to establish a new connection when gets disconnected.
     * @throws ConnectionAbortError,TimeoutError
     */
    async connect(timeout : number | null = null) : Promise<void>
    {
        if(this.isConnected()) {
            return;
        }

        return  new Promise<void>((resolve, reject) => {
            let connectListener;
            let connectAbortListener;
            let timeoutHandler;

            if(timeout !== null){
                timeoutHandler = setTimeout(() => {
                    this.socket.off('connect',connectListener);
                    this.socket.off('connectAbort',connectAbortListener);
                    reject(new TimeoutError('To connect to the server.',true));
                },timeout);
            }

            connectListener = () => {
                this.socket.off('connect',connectListener);
                this.socket.off('connectAbort',connectAbortListener);
                clearInterval(timeoutHandler);
                resolve();
            };
            connectAbortListener = (err) => {
                this.socket.off('connect',connectListener);
                this.socket.off('connectAbort',connectAbortListener);
                clearTimeout(timeoutHandler);
                reject(new ConnectionAbortError(err));
            };

            this.socket.on('connect',connectListener);
            this.socket.on('connectAbort',connectAbortListener);

            this.socket.connect();
        });
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Disconnectes the socket.
     * The current auth token will not be removed.
     * This means that when the client is reconnected the token is used again.
     * To prevent this, use the function deauthenticate or deauthDis.
     * @param code error code (disconnection)
     * @param data reason code for disconnection
     */
    disconnect(code ?: number, data : object = {}) : void {
        data['#internal-fromZationClient'] = true;
        this.socket.disconnect(code,data);
        this.firstConnection = true;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Reconnect the socket.
     * @param code error code (disconnection)
     * @param data reason code for disconnection
     */
    async reconnect(code ?: number, data : object = {}) : Promise<void> {
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
            await this._triggerEventReactions(Events.Connect,this.firstConnection);
            this.firstConnection = false;
        });

        this.socket.on('error', async (err) => {
            if(this.zc.isDebug()) {
                Logger.printError(err);
            }
            await this._triggerEventReactions(Events.Error,err);
        });

        this.socket.on('disconnect',async (code,data) =>
        {
            const fromClient : any = data ? data['#internal-fromZationClient'] : false;
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
                await this._triggerEventReactions(Events.ClientDeauthenticate,oldSignedJwtToken);
            }
            else{
                if(this.zc.isDebug()) {
                    Logger.printInfo('Client is deauthenticated from server.');
                }
                await this._triggerEventReactions(Events.ServerDeauthenticate,oldSignedJwtToken);
            }
            await this._triggerEventReactions(Events.Deauthenticate,fromClient,oldSignedJwtToken);
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
            autoReconnect: this.zc.config.autoReconnect,
            autoReconnectOptions : this.zc.config.autoReconnectOptions,
            autoConnect : false,
            multiplex : this.zc.config.multiplex,
            timestampRequests : this.zc.config.timestampRequests,
            ackTimeout : this.zc.config.requestTimeout,
            query: {
                system : this.zc.config.system,
                version : this.zc.config.version,
                apiLevel : this.zc.config.apiLevel,
                variables : stringify(this.zc.config.handshakeVariables)
            }
        };
    }

    private _buildWsSocket() {
        // noinspection JSUnresolvedVariable
        this.socket = ModifiedScClient.create(this._buildScOptions());
    }

    //Part Channel Subscribtion
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Subscribe the user channel.
     * Can be useful if auto sub is disabled.
     * Notice if the socket is not connected the resolve of the promise will wait for connection.
     * @throws UserIdRequiredError, SubscribeFailError, SocketNotCreatedError
     */
    async subUserCh() : Promise<void> {
        await this.authEngine.subUserCh();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the socket has subscribed the user channel.
     * @throws UserIdRequiredError
     */
    hasSubUserCh() : boolean {
       return this.authEngine.hasSubUserCh();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Unsubscribes the user channel.
     * @throws UserIdRequiredError
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
     * @throws AuthUserGroupRequiredError, SubscribeFailError, SocketNotCreatedError
     */
    async subAuthUserGroupCh() : Promise<void> {
        await this.authEngine.subAuthUserGroupCh();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the socket has subscribed the auth user group channel.
     * @throws AuthUserGroupRequiredError
     */
    hasSubAuthUserGroupCh() : boolean {
        return this.authEngine.hasSubAuthUserGroupCh();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Unsubscribes the auth user group channel.
     * @throws AuthUserGroupRequiredError
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
     * @throws SubscribeFailedError, DeauthenticationNeededError, SocketNotCreatedError
     */
    async subDefaultUserGroupCh() : Promise<void> {
        await this.authEngine.subDefaultUserGroupCh();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the socket has subscribed the default user group channel.
     */
    hasSubDefaultUserGroupCh() : boolean {
        return this.channelEngine.hasSubDefaultUserGroupChannel();
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
     * @throws SubscribeFailedError, SocketNotCreatedError
     */
    async subAllCh() : Promise<void> {
        await this.channelEngine.subAllChannel();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the socket has subscribed the all channel.
     */
    hasSubAllCh() : boolean {
        return this.channelEngine.hasSubAllChannel();
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
     * @throws SubscribeFailedError, SocketNotCreatedError
     * @param name
     * @param id
     * @param retrySubForever
     * This option indicates if the client should retry to sub the channel forever.
     * So if the client is kicked from this channel or the subscription fail.
     * It will automatically retry to subscribe it if the authentication token change or the client is reconnected.
     * The default value is true.
     */
    async subCustomCh(name : string, id ?: string,retrySubForever : boolean = true) : Promise<void> {
        await this.channelEngine.subCustomCh(name,id,retrySubForever);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the socket has subscribed the custom channel.
     * @param name if not provided it checks
     * if the socket has subscribed any custom channel.
     * @param id if not provided it checks
     * if the socket has subscribed any custom channel with channel name.
     */
    hasSubCustomCh(name ?: string, id ?: string) : boolean {
        return this.channelEngine.hasSubCustomCh(name,id);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Unsubscribes custom channel.
     * @param name if not provided it will unsubscribe all custom channels.
     * @param id if not provided it will unsubscribe all custom channels with name.
     * @param andDestroy
     * @return
     * An string array with all custom channels there are unsubscribed.
     */
    unsubCustomCh(name ?: string, id ?: string,andDestroy : boolean = true) : string[] {
        return this.channelEngine.unsubscribeCustomCh(name,id,andDestroy);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns all subscribed custom channels in an string array.
     * @param name if not provided it will return all custom channels which are subscribed.
     * @param id if not provided it will return all custom channels which are subscribed and have the
     * same channel name.
     */
    getSubscribedCustomCh(name ?: string, id ?: string) : string[] {
        return this.channelEngine.getSubCustomCh(name,id);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Switch the custom channel subscribtion to another member id.
     * By unsubscribe all custom channels with the name and
     * subscribe the new one.
     * Notice if the socket is not connected the resolve of the promise will wait for connection.
     * @throws SubscribeFailedError
     * @param name
     * @param id
     */
    async switchCustomCh(name : string,id : string) : Promise<void>
    {
        this.unsubCustomCh(name);
        await this.subCustomCh(name,id);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Subscribe the panel out channel.
     * Notice if the socket is not connected the resolve of the promise will wait for connection.
     * @throws SubscribeFailedError, SocketNotCreatedError
     */
    async subPanelOutCh() : Promise<void> {
        await this.channelEngine.subPanelOutChannel();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the socket has subscribed the panel out channel.
     */
    hasSubPanelOutCh() : boolean {
        return this.channelEngine.hasSubPanelOutChannel();
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
     * @throws ConnectionRequiredError, PublishFailError, TimeoutError
     * @param userId
     * @param event
     * @param data
     * @param waitForConnection
     * With the WaitForConnection option, you can activate that the socket is
     * trying to connect when it is not connected. You have four possible choices:
     * Undefined: It will use the value from the default options.
     * False: The action will fail and throw a ConnectionRequiredError,
     * when the socket is not connected.
     * For the other options, it is also recommended to have activated the auto-reconnect.
     * Null: The socket will try to connect (if it is not connected) and
     * waits until the connection is made, then it continues the action.
     * Number: Same as null, but now you can specify a timeout (in ms) of
     * maximum waiting time for the connection. If the timeout is reached,
     * it will throw a timeout error.
     */
    async pubUserCh(userId : string | number,event : string, data : any = {},waitForConnection : WaitForConnectionOption = undefined) : Promise<void> {
        await this.channelEngine.pubUserCh(userId,event,data,waitForConnection);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Publish in a auth user group channel with this client.
     * Notice that the channel needs to allow client publish.
     * Keep in mind that it is recommended to use a controller and then let the server publish in the channel.
     * This gives you better control over validation.
     * @throws ConnectionRequiredError, PublishFailError, TimeoutError
     * @param authUserGroup
     * @param event
     * @param data
     * @param waitForConnection
     * With the WaitForConnection option, you can activate that the socket is
     * trying to connect when it is not connected. You have four possible choices:
     * Undefined: It will use the value from the default options.
     * False: The action will fail and throw a ConnectionRequiredError,
     * when the socket is not connected.
     * For the other options, it is also recommended to have activated the auto-reconnect.
     * Null: The socket will try to connect (if it is not connected) and
     * waits until the connection is made, then it continues the action.
     * Number: Same as null, but now you can specify a timeout (in ms) of
     * maximum waiting time for the connection. If the timeout is reached,
     * it will throw a timeout error.
     */
    async pubAuthUserGroupCh(authUserGroup : string,event : string, data : any = {},waitForConnection : WaitForConnectionOption = undefined) : Promise<void> {
        await this.channelEngine.pubAuthUserGroupCh(authUserGroup,event,data,waitForConnection);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Publish in default user group channel with this client.
     * Notice that the channel needs to allow client publish.
     * Keep in mind that it is recommended to use a controller and then let the server publish in the channel.
     * This gives you better control over validation.
     * @throws ConnectionRequiredError, PublishFailError, TimeoutError
     * @param event
     * @param data
     * @param waitForConnection
     * With the WaitForConnection option, you can activate that the socket is
     * trying to connect when it is not connected. You have four possible choices:
     * Undefined: It will use the value from the default options.
     * False: The action will fail and throw a ConnectionRequiredError,
     * when the socket is not connected.
     * For the other options, it is also recommended to have activated the auto-reconnect.
     * Null: The socket will try to connect (if it is not connected) and
     * waits until the connection is made, then it continues the action.
     * Number: Same as null, but now you can specify a timeout (in ms) of
     * maximum waiting time for the connection. If the timeout is reached,
     * it will throw a timeout error.
     */
    async pubDefaultUserGroupCh(event : string, data : any = {},waitForConnection : WaitForConnectionOption = undefined) : Promise<void> {
        await this.channelEngine.pubDefaultUserGroupCh(event,data,waitForConnection);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Publish in all channel with this client.
     * Notice that the channel needs to allow client publish.
     * Keep in mind that it is recommended to use a controller and then let the server publish in the channel.
     * This gives you better control over validation.
     * @throws ConnectionRequiredError, PublishFailError, TimeoutError
     * @param event
     * @param data
     * @param waitForConnection
     * With the WaitForConnection option, you can activate that the socket is
     * trying to connect when it is not connected. You have four possible choices:
     * Undefined: It will use the value from the default options.
     * False: The action will fail and throw a ConnectionRequiredError,
     * when the socket is not connected.
     * For the other options, it is also recommended to have activated the auto-reconnect.
     * Null: The socket will try to connect (if it is not connected) and
     * waits until the connection is made, then it continues the action.
     * Number: Same as null, but now you can specify a timeout (in ms) of
     * maximum waiting time for the connection. If the timeout is reached,
     * it will throw a timeout error.
     */
    async pubAllCh(event : string, data : any = {},waitForConnection : WaitForConnectionOption = undefined) : Promise<void> {
        await this.channelEngine.pubAllCh(event,data,waitForConnection);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Publish in the panel in channel with this client.
     * Notice the publish in middleware is used on server side.
     * @throws ConnectionRequiredError, PublishFailError, TimeoutError
     * @param event
     * @param data
     * @param waitForConnection
     * With the WaitForConnection option, you can activate that the socket is
     * trying to connect when it is not connected. You have four possible choices:
     * Undefined: It will use the value from the default options.
     * False: The action will fail and throw a ConnectionRequiredError,
     * when the socket is not connected.
     * For the other options, it is also recommended to have activated the auto-reconnect.
     * Null: The socket will try to connect (if it is not connected) and
     * waits until the connection is made, then it continues the action.
     * Number: Same as null, but now you can specify a timeout (in ms) of
     * maximum waiting time for the connection. If the timeout is reached,
     * it will throw a timeout error.
     */
    async pubPanelInCh(event : string, data : any = {},waitForConnection : WaitForConnectionOption = undefined) : Promise<void> {
        await this.channelEngine.pubPanelInCh(event,data,waitForConnection);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Publish in a custom channel with this client.
     * Notice that the socket needs to have access for clientPublish.
     * Keep in mind that it is recommended to use a controller and then let the server publish in the channel.
     * This gives you better control over validation.
     * @throws ConnectionRequiredError, PublishFailError, TimeoutError
     * @param target
     * @param event
     * @param data
     * @param waitForConnection
     * With the WaitForConnection option, you can activate that the socket is
     * trying to connect when it is not connected. You have four possible choices:
     * Undefined: It will use the value from the default options.
     * False: The action will fail and throw a ConnectionRequiredError,
     * when the socket is not connected.
     * For the other options, it is also recommended to have activated the auto-reconnect.
     * Null: The socket will try to connect (if it is not connected) and
     * waits until the connection is made, then it continues the action.
     * Number: Same as null, but now you can specify a timeout (in ms) of
     * maximum waiting time for the connection. If the timeout is reached,
     * it will throw a timeout error.
     */
    async pubCustomCh(target : {name : string,id ?: string},event : string, data : any = {},waitForConnection : WaitForConnectionOption = undefined) : Promise<void> {
        await this.channelEngine.pubCustomCh(target,event,data,waitForConnection);
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
     * @throws AuthenticationRequiredError
     */
    hasTokenVariable(path ?: string | string[]) : boolean {
        return ObjectPath.has(this.authEngine.getTokenVariables(),path);
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
     * @param path Notice if you don't provide a path, it returns all variables in an object.
     * @throws AuthenticationRequiredError
     */
    getTokenVariable(path ?: string | string[]) : any {
        return ObjectPath.get(this.authEngine.getTokenVariables(),path);
    }

    //Part Token

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns token id of the token form the sc.
     * @throws AuthenticationRequiredError
     */
    getTokenId() : string
    {
       // @ts-ignore
        return this.authEngine.getSecurePlainToken().tid;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the expire of the token from the sc.
     * @throws AuthenticationRequiredError
     */
    getTokenExpire() : number
    {
        // @ts-ignore
        return this.authEngine.getSecurePlainToken().exp;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the socket has panel access with the token.
     * @throws AuthenticationRequiredError
     */
    hasPanelAccess() : boolean
    {
        // @ts-ignore
        return this.authEngine.getSecurePlainToken().panelAccess;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the current plain token.
     * @throws AuthenticationRequiredError
     */
    getPlainToken() : ZationToken
    {
        return this.authEngine.getSecurePlainToken();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the current sign token.
     * @throws AuthenticationRequiredError
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

    /**
     * Respond on emit-events of the server.
     * It uses the custom zation event namespace
     * (so you cannot have name conflicts with internal event names).
     * @param event
     * @param handler
     * The function that gets called when the event occurs,
     * parameters are the data and a response function that you can call to respond on the event back.
     */
    on(event : string,handler : OnHandlerFunction) : void {
        this.socket.on(event,handler);
    }

    /**
     * Respond on emit-event of the server but only once.
     * It uses the custom zation event namespace
     * (so you cannot have name conflicts with internal event names).
     * @param event
     * @param handler
     * The function that gets called when the event occurs,
     * parameters are the data and a response function that you can call to respond on the event back.
     */
    once(event : string,handler : OnHandlerFunction) : void {
        const tmpHandler : OnHandlerFunction = (data, response) => {
            tmpHandler(data,response);
            this.socket.off(event,tmpHandler);
        };
        this.socket.on(event,tmpHandler);
    }

    // noinspection JSUnusedGlobalSymbols
    async emit(eventName : string,data : any,onlyTransmit : true,options : {waitForConnection ?: WaitForConnectionOption,timeout ?: number | null}) : Promise<void>
    // noinspection JSUnusedGlobalSymbols
    async emit(eventName : string,data : any,onlyTransmit : false,options : {waitForConnection ?: WaitForConnectionOption,timeout ?: number | null}) : Promise<any>
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Emit to the server.
     * If you not only transmit than the return value is a promise with the result,
     * and if an error occurs while emitting to the server, this error is thrown.
     * It uses the custom zation event namespace
     * (so you cannot have name conflicts with internal event names).
     * @throws TimeoutError, Error
     * @param event
     * @param data
     * @param onlyTransmit
     * Indicates if you only want to transmit data.
     * If not than the promise will be resolved with the result when the server responded on the emit.
     * @param waitForConnection
     * With the WaitForConnection option, you can activate that the socket is
     * trying to connect when it is not connected. You have four possible choices:
     * Undefined: It will use the value from the default options.
     * False: The action will fail and throw a ConnectionRequiredError,
     * when the socket is not connected.
     * For the other options, it is also recommended to have activated the auto-reconnect.
     * Null: The socket will try to connect (if it is not connected) and
     * waits until the connection is made, then it continues the action.
     * Number: Same as null, but now you can specify a timeout (in ms) of
     * maximum waiting time for the connection. If the timeout is reached,
     * it will throw a timeout error.
     * @param timeout
     * Set the timeout of the emit.
     * Value can be null which means the timeout is disabled or
     * undefined then it will use the default timeout of the zation config,
     * or it can be a number that indicates the milliseconds.
     */
    async emit(event : string,data : any,onlyTransmit : boolean = true,
               {waitForConnection,timeout} : {waitForConnection ?: WaitForConnectionOption,timeout ?: number | null} = {}) : Promise<object | void>
    {
        await ConnectionUtils.checkConnection(this,waitForConnection,'To emit an event.');

        return new Promise<object>((resolve, reject) => {
            // noinspection DuplicatedCode
            if(onlyTransmit){
                this.socket.emit(ZationCustomEventNamespace+event,data,undefined,timeout);
                resolve();
            }
            else {
                this.socket.emit(ZationCustomEventNamespace+event,data,(err, data) => {
                    if(err){
                        if(err.name === 'TimeoutError'){
                            reject(new TimeoutError(err.message));
                        }
                        else {
                            reject(err);
                        }
                    }
                    else {
                        resolve(data);
                    }
                },timeout);
            }
        });
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Send some raw data to the server.
     * This will trigger the socketRaw event on the zation server
     * which will carry the provided data.
     * @throws ConnectionRequiredError
     */
    sendRaw(data : any) : void
    {
        if(this.isConnected()) {
            this.socket.send(data);
        }
        else {
            throw new ConnectionRequiredError('To send raw data.');

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
    getPostKey() : string {
        return this.zc.config.postKey;
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
     * Returns the full server address with protocol (http/https), hostname, port and path.
     */
    getServerAddress() : string
    {
        const path = this.zc.config.path;
        const hostname = this.zc.config.hostname;
        const port = this.zc.config.port;
        const secure = this.zc.config.secure;
        return `${secure ? 'https' : 'http'}://${hostname}:${port}${path}`;
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

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the zation config.
     * Used internally.
     * Only use this method carefully.
     */
    getZc() : ZationConfig {
        return this.zc;
    }
}