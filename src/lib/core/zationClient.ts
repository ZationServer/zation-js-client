/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {ZationClientOptions}                        from "./zationClientOptions";
import {OnHandlerFunction, Socket}                  from "../main/sc/socket";
import {Events}                                     from "../main/constants/events";
import {SystemController}                           from "../main/constants/systemController";
import {ZATION_CUSTOM_EVENT_NAMESPACE, ZationToken} from "../main/constants/internal";
import ConnectionUtils, {ConnectTimeoutOption}      from "../main/utils/connectionUtils";
import {ChannelEngine}                              from "../main/channel/channelEngine";
import {ZationClientConfig}                         from "../main/config/zationClientConfig";
import {MultiList}                                  from "../main/container/multiList";
// noinspection ES6PreferShortImport
import {ResponseReactionBox}           from "../main/controller/response/responseReactionBox";
// noinspection ES6PreferShortImport
import {StandardRequestBuilder}        from "../main/controller/request/fluent/standardRequestBuilder";
// noinspection ES6PreferShortImport
import {AuthRequestBuilder}            from "../main/controller/request/fluent/authRequestBuilder";
// noinspection ES6PreferShortImport
import {ValidationCheckRequestBuilder} from "../main/controller/request/fluent/validationCheckRequestBuilder";
// noinspection ES6PreferShortImport
import {ConnectionAbortError}       from "../main/error/connectionAbortError";
import {Logger}                     from "../main/logger/logger";
// noinspection ES6PreferShortImport
import {AuthenticationFailedError}  from "../main/error/authenticationFailedError";
// noinspection ES6PreferShortImport
import {EventReactionBox}           from "../main/event/eventReactionBox";
// noinspection ES6PreferShortImport
import {StandardRequest}            from "../main/controller/request/main/standardRequest";
// noinspection ES6PreferShortImport
import {Response}                   from "../main/controller/response/response";
import {ModifiedScClient}           from "../main/sc/modifiedScClient";
// noinspection ES6PreferShortImport
import {TimeoutError, TimeoutType}  from "../main/error/timeoutError";
import perf                         from "../main/utils/perf";
import {BaseRequest}                from "../main/controller/request/main/baseRequest";
// noinspection ES6PreferShortImport
import {AuthRequest}                            from "../main/controller/request/main/authRequest";
// noinspection ES6PreferShortImport
import {AuthenticationRequiredError}            from "../main/error/authenticationRequiredError";
// noinspection ES6PreferShortImport
import {SignAuthenticationFailedError}          from "../main/error/signAuthenticationFailedError";
// noinspection ES6PreferShortImport
import {DeauthenticationFailedError}            from "../main/error/deauthenticationFailedError";
// noinspection ES6PreferShortImport
import {UndefinedUserIdError}                   from "../main/error/undefinedUserIdError";
// noinspection ES6PreferShortImport
import {UndefinedAuthUserGroupError}            from "../main/error/undefinedAuthUserGroupError";
// noinspection ES6PreferShortImport
import {SpecialController, ValidationCheckPair} from "../main/controller/controllerDefinitions";
import {controllerRequestSend}                  from "../main/controller/controllerSendUtils";
import Package, {isPackage}                     from "../main/receiver/package/main/package";
import {receiverPackageSend}                    from "../main/receiver/receiverSendeUtils";
import PackageBuilder                           from "../main/receiver/package/fluent/packageBuilder";
import Channel                                  from "../main/channel/channel";
import Databox, {DataboxOptions}                from "../main/databox/databox";
import DataboxManager                           from "../main/databox/databoxManager";
import {deepClone}                              from "../main/utils/cloneUtils";
const stringify                               = require("fast-stringify");

export class ZationClient<TP extends object = any>
{
    private readonly channelEngine: ChannelEngine;
    private readonly databoxManager: DataboxManager;
    private readonly zc: ZationClientConfig;

    //auth
    private _userId: number | string | undefined = undefined;
    private _authUserGroup: string | undefined = undefined;
    private _signedToken: string | null = null;
    private _plainToken: ZationToken | null = null;

    private readonly responseReactionMainBox: MultiList<ResponseReactionBox>;
    private readonly eventReactionMainBox: MultiList<EventReactionBox>;

    //User system reaction boxes
    private readonly userResponseReactionBox: ResponseReactionBox;
    private readonly userEventReactionBox: EventReactionBox;

    //webSockets
    private _socket: Socket;

    /**
     * Indicates if the current connection is the first connection of the socket.
     */
    private firstConnection: boolean = true;

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Creates a zation client.
     * @param settings
     */
    constructor(settings?: ZationClientOptions)
    {
        //config
        this.zc = new ZationClientConfig(settings);

        this.channelEngine = new ChannelEngine(this.zc);
        this.databoxManager = new DataboxManager();

        //Responds
        this.responseReactionMainBox = new MultiList<ResponseReactionBox>();
        this.eventReactionMainBox = new MultiList<EventReactionBox>();

        //user system reaction boxes
        this.userResponseReactionBox = new ResponseReactionBox();
        this.userResponseReactionBox._link(this);
        this.userEventReactionBox = new EventReactionBox();
        this.userEventReactionBox._link(this);

        this.responseReactionMainBox.addFixedItem(this.userResponseReactionBox);
        this.eventReactionMainBox.addFixedItem(this.userEventReactionBox);

        this._buildWsSocket();
        this._registerSocketEvents();
        this.channelEngine.connectToSocket(this._socket);
    }

    //Part Responds
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Removes all reaction boxes that you added.
     */
    removeAllReactionBoxes(): void
    {
        this.responseReactionMainBox.removeAllItems();
        this.eventReactionMainBox.removeAllItems();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Add a reactionBox or more reactionBoxes.
     * Notice that the response reaction boxes are triggerd before the system response reaction box.
     * The system response reaction box is the box that is returned by the method client.responseReact().
     * The system response reaction box should be used to catch the remaining errors.
     * @example
     * addReactionBox(myResponseReactionBox,myEventReactionBox);
     * @param reactionBox
     */
    addReactionBox(...reactionBox: (ResponseReactionBox| EventReactionBox)[]): void
    {
        for(let i = 0; i < reactionBox.length; i++) {
            const box = reactionBox[i];
            box._link(this);
            if(box instanceof ResponseReactionBox) {
                this.responseReactionMainBox.addItem(box);
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
     * removeReactionBox(myResponseReactionBox,myEventReactionBox);
     * @param reactionBox
     */
    removeReactionBox(...reactionBox: (ResponseReactionBox | EventReactionBox)[]): void
    {
        for(let i = 0; i < reactionBox.length; i++) {
            const box = reactionBox[i];
            if(box instanceof ResponseReactionBox) {
                if(this.responseReactionMainBox.removeItem(box)){
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
     * Returns the system fixed user response reaction box.
     * Can be used to catch the remaining errors.
     */
    responseReact(): ResponseReactionBox {
        return this.userResponseReactionBox;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the system fixed user event reaction box.
     */
    eventReact(): EventReactionBox {
        return this.userEventReactionBox;
    }

    //Part Reaction Boxes
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns a new response reaction box
     * and add this box to the client.
     */
    newResponseReactionBox(addReactionBoxToClient: boolean = true): ResponseReactionBox {
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
    newEventReactionBox(addReactionBoxToClient: boolean = true): EventReactionBox {
        const box = new EventReactionBox();
        if(addReactionBoxToClient){this.addReactionBox(box);}
        return box;
    }

    //Part Ping

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the measured time between sending a request to the system ping controller
     * on the server-side and receiving a response.
     * @example
     * const ping = await ping();
     * @throws ConnectionRequiredError,TimeoutError
     * @param connectTimeout
     * With the ConnectTimeout option, you can activate that the socket is
     * trying to connect when it is not connected. You have five possible choices:
     * Undefined: It will use the value from the default options.
     * False: The action will fail and throw a ConnectionRequiredError,
     * when the socket is not connected.
     * Null: The socket will try to connect (if it is not connected) and
     * waits until the connection is made, then it continues the action.
     * Number: Same as null, but now you can specify a timeout (in ms) of
     * maximum waiting time for the connection. If the timeout is reached,
     * it will throw a timeout error.
     * AbortTrigger: Same as null, but now you have the possibility to abort the wait later.
     */
    async ping(connectTimeout: ConnectTimeoutOption = undefined): Promise<number>
    {
        const req = new StandardRequest(SystemController.Ping);
        req.setConnectTimeout(connectTimeout);
        const start = perf.now();
        await this.send(req);
        return perf.now() - start;
    }

    //Part Auth
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Authenticate this connection (use authentication controller)
     * with authentication authData and returns the response.
     * This method automatically throws an AuthenticationFailedError
     * if the response was successful and the client is not authenticated or the response has errors.
     * At the AuthenticationFailedError you have the possibility to react exactly to the response.
     * If you prefer to do it by yourself or for advanced use cases, you should use the other method authRequest.
     * Also notice that the zation client response reaction boxes are not triggerd.
     * Because then you have the opportunity to react with the response on specific things
     * then trigger the zation client response reaction boxes (using triggerClientBoxes()).
     * @example
     * try{
     *  await client.authenticate({userName: 'Tim', password: 'opqdjß2jdp1d'});
     * }
     * catch (e: AuthenticationFailedError) {
     *   const response = e.getResponse();
     * }
     * @throws
     * ConnectionRequiredError
     * AuthenticationFailedError
     * TimeoutError
     * @param authData
     * @param connectTimeout
     * With the ConnectTimeout option, you can activate that the socket is
     * trying to connect when it is not connected. You have five possible choices:
     * Undefined: It will use the value from the default options.
     * False: The action will fail and throw a ConnectionRequiredError,
     * when the socket is not connected.
     * Null: The socket will try to connect (if it is not connected) and
     * waits until the connection is made, then it continues the action.
     * Number: Same as null, but now you can specify a timeout (in ms) of
     * maximum waiting time for the connection. If the timeout is reached,
     * it will throw a timeout error.
     * AbortTrigger: Same as null, but now you have the possibility to abort the wait later.
     */
    async authenticate(authData: object = {},connectTimeout: ConnectTimeoutOption = undefined): Promise<Response>
    {
        const req = new AuthRequest(authData);
        req.setConnectTimeout(connectTimeout);
        const resp = await this.send(req,false);
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
     * @throws ConnectionRequiredError, SignAuthenticationFailedError, TimeoutError,AbortSignal
     * @param signToken
     * @param connectTimeout
     * With the ConnectTimeout option, you can activate that the socket is
     * trying to connect when it is not connected. You have five possible choices:
     * Undefined: It will use the value from the default options.
     * False: The action will fail and throw a ConnectionRequiredError,
     * when the socket is not connected.
     * Null: The socket will try to connect (if it is not connected) and
     * waits until the connection is made, then it continues the action.
     * Number: Same as null, but now you can specify a timeout (in ms) of
     * maximum waiting time for the connection. If the timeout is reached,
     * it will throw a timeout error.
     * AbortTrigger: Same as null, but now you have the possibility to abort the wait later.
     */
    async signAuthenticate(signToken: string, connectTimeout: ConnectTimeoutOption = undefined): Promise<void> {
        await ConnectionUtils.checkConnection(this,connectTimeout);

        return new Promise<void>(async (resolve, reject) => {
            this._socket.authenticate(signToken,(err,authState) => {
                if(err){
                    if(err.name === 'TimeoutError'){reject(new TimeoutError(err.message));}
                    else {reject(new SignAuthenticationFailedError(err));}
                }
                else if(authState.authError){
                    reject(new SignAuthenticationFailedError(authState.authError));
                }
                else {resolve();}
            });
        });
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Deauthenticates the client.
     * @throws DeauthenticationFailedError
     */
    async deauthenticate(): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            this._socket.deauthenticate((e => {
                if(e){reject(new DeauthenticationFailedError(e));}
                else {resolve();}
            }));
        });
    }

    //Part Easy
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Connect and authenticate the client
     * and returns the Response from the authentication.
     * Notice that the zation client response reaction boxes are not triggerd.
     * Because then you have the opportunity to react with the response on specific things
     * then trigger the zation client response reaction boxes (using response.react().triggerClientBoxes()).
     * @example
     * await conAndAuth({userName: 'Tim', password: 'opqdjß2jdp1d'});
     * @param authData The authentication credentials for the client.
     * @throws connectionAbortError
     */
    async conAuth(authData: object): Promise<Response>
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
    async deauthDis(code?: number, data: object = {}): Promise<void>
    {
        await this.deauthenticate();
        await this.disconnect(code,data);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns an StandardRequestBuilder.
     * The StandardRequestBuilder can be used to easily build
     * a standard request with reactions and send it.
     * The default values are:
     * Data: undefined
     * @example
     * await client.request('sendMessage')
     * .data({msg: 'hallo'})
     * .catchError()
     * .presets()
     * .valueNotMatchesWithMinLength('msg')
     * .react(()=>{console.log('Message to short')})
     * .catchError(()=>{console.log('Something went wrong')})
     * .onSuccessful(()=>{console.log('Message sent successfully')})
     * .send();
     * @param controller
     * @param data
     */
    request(controller: string | SpecialController, data: any = undefined): StandardRequestBuilder {
        return new StandardRequestBuilder(this,controller,data);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns an AuthRequestBuilder.
     * The AuthRequestBuilder can be used to easily build
     * an auth request with reactions and send it.
     * This is another way to authenticate this client.
     * The default values are:
     * AuthData: undefined
     * @example
     * await client.authRequest()
     * .authData({userName: 'luca',password: '123'})
     * .catchError()
     * .nameIs('passwordIsWrong')
     * .react(() => {console.log('The password is wrong')})
     * .catchError(()=>{console.log('Something went wrong')})
     * .onSuccessful(() => {console.log('Successfully authenticated')})
     * .send();
     * @param authData
     */
    authRequest(authData: any = undefined): AuthRequestBuilder {
        const helper = new AuthRequestBuilder(this);
        helper.authData(authData);
        return helper;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns an ValidationCheckRequestBuilder.
     * The ValidationCheckRequestBuilder can be used to easily build
     * a validation check request with reactions and send it.
     * This is useful to validate individual controller data.
     * The default values are:
     * Checks: []
     * @example
     * await client.validationRequest()
     * .check('msg','hallo')
     * .catchError()
     * .presets()
     * .valueNotMatchesWithMinLength()
     * .react(()=>{console.log('Message to short')})
     * .catchError(()=>{console.log('Something went wrong')})
     * .onSuccessful(()=>{console.log('Message is ok')})
     * .send();
     * @param controller
     * @param checks
     */
    validationRequest(controller: string | SpecialController,...checks: ValidationCheckPair[]): ValidationCheckRequestBuilder {
        const helper = new ValidationCheckRequestBuilder(this,controller);
        helper.checks(...checks);
        return helper;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns a PackageBuilder.
     * The PackageBuilder can be used to easily build a package send it to a receiver.
     * @example
     * await transmit('movement')
     * .data('up')
     * .send()
     * @param receiver
     * @param data
     */
    transmit(receiver: string,data: any = undefined): PackageBuilder {
       return new PackageBuilder(this,receiver,data);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns a new Databox.
     * With the Databox you can keep data in a current state in real-time.
     * The client-side Databox will connect to the server-side
     * Databox and handles mostly everything: disconnections, missing cud updates, restores.
     * It will do everything, that it always has the newest data.
     * To process data changes extremely fast the client Databox has
     * internally optimized storage instances.
     * @param identifier
     * The identifier of the Databox that is also used to register a
     * Databox in the configuration of the server.
     * @param options
     */
    databox(identifier: string,options: DataboxOptions = {}): Databox {
        return new Databox(this,identifier,options);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Disconnects all Databoxes.
     * Can be used to securely clear all resources.
     */
    async disconnectAllDataboxes(): Promise<void> {
        return this.databoxManager.disconnectAll();
    }

    /**
     * Returns a new Channel for the specific identifier with an API level.
     * The Channel can be used to subscribe to it or to subscribe to specific
     * members in case of a ChannelFamily and listen to publishes.
     * @param identifier
     * @param apiLevel
     * The API level of this client for the Channel subscription request.
     * If you don't provide one, the server will use the connection API
     * level or the default API level.
     */
    channel(identifier: string,apiLevel?: number): Channel {
        return new Channel(this,identifier,apiLevel);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Unsubscribe all channels.
     * Can be used to securely clear all resources.
     * @param identifier
     * If provided it only unsubscribe all
     * channels with that identifier.
     */
    unsubscribeAllChannels(identifier?: string) {
       this.channelEngine.unsubscribeAllChannels(identifier);
    }

    //Part Send
    /**
     * @description
     * Sends a Package.
     * @throws ConnectionRequiredError,TimeoutError,AbortSignal
     * @return Response
     * @param pack
     */
    send(pack: Package): Promise<void>
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Sends a BaseRequest.
     * Should be used for sending AuthRequests, ValidationCheckRequests and StandardRequests.
     * Optional you can pass in ResponseReactionBox/es and specify if the
     * client attached ResponseReactionBoxes should be triggered.
     * Notice that if you want to trigger the client attached boxes,
     * the ResponseReactionBoxes that are passed in will be triggered before.
     * @throws ConnectionRequiredError,TimeoutError,AbortSignal
     * @return Response
     * @param request
     * @param triggerClientBoxes
     * @param responseReactionBoxes
     */
    async send(request: BaseRequest,triggerClientBoxes?: boolean,responseReactionBoxes?: ResponseReactionBox[]): Promise<Response>
    async send(value: BaseRequest | Package,triggerClientBoxes: boolean = false,responseReactionBoxes: ResponseReactionBox[] = []): Promise<Response | void> {
        if(isPackage(value)) {
            return receiverPackageSend(this,value.build(),value.getConnectTimeout());
        }
        else {
            const response = await controllerRequestSend(this,value.build(),value.getResponseTimeout(),
                value.getConnectTimeout());

            for(let i = 0; i < responseReactionBoxes.length; i++) {
                await responseReactionBoxes[i]._trigger(response);
            }

            if(triggerClientBoxes) {
                await this._triggerResponseReactions(response);
            }
            return response;
        }
    }

    // Part Connection

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the current socket.
     */
    get socket(): Socket {
        return this._socket;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the socket is connected to the server.
     */
    isConnected(): boolean {
        return this._socket.state === this._socket.OPEN;
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
    async connect(timeout: number | null = null): Promise<void>
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
                    this._socket.off('connect',connectListener);
                    this._socket.off('connectAbort',connectAbortListener);
                    reject(new TimeoutError(TimeoutType.connectTiemeout));
                },timeout);
            }

            connectListener = () => {
                this._socket.off('connect',connectListener);
                this._socket.off('connectAbort',connectAbortListener);
                clearInterval(timeoutHandler);
                resolve();
            };
            connectAbortListener = (err) => {
                this._socket.off('connect',connectListener);
                this._socket.off('connectAbort',connectAbortListener);
                clearTimeout(timeoutHandler);
                reject(new ConnectionAbortError(err));
            };

            this._socket.on('connect',connectListener);
            this._socket.on('connectAbort',connectAbortListener);

            this._socket.connect();
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
    disconnect(code?: number, data: object = {}): void {
        data['#internal-fromZationClient'] = true;
        this._socket.disconnect(code,data);
        this.firstConnection = true;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Reconnect the socket.
     * @param code error code (disconnection)
     * @param data reason code for disconnection
     */
    async reconnect(code?: number, data: object = {}): Promise<void> {
       this.disconnect(code,data);
       await this.connect();
    }

    private _registerSocketEvents()
    {
        this._socket.on('connect',async () => {
            if(this.firstConnection) {
                if(this.zc.isDebug()) {Logger.printInfo('Client is connected.');}
                await this.eventReactionMainBox.forEachParallel(box => box._trigger(Events.FirstConnect));
            }
            else {
                if(this.zc.isDebug()) {Logger.printInfo('Client is reconnected.');}
                await this.eventReactionMainBox.forEachParallel(box => box._trigger(Events.Reconnect));
            }
            await this.eventReactionMainBox.forEachParallel(box => box._trigger(Events.Connect,this.firstConnection));
            this.firstConnection = false;
        });

        this._socket.on('error', async (err) => {
            if(this.zc.isDebug()) {Logger.printError(err);}
            await this.eventReactionMainBox.forEachParallel(box => box._trigger(Events.Error,err));
        });

        this._socket.on('disconnect',async (code,data) =>
        {
            if(this.zc.isDebug()) {Logger.printInfo(`Client is disconnected. Code:'${code}' Data:'${data}'`);}

            const fromClient: any = data ? data['#internal-fromZationClient'] : false;
            if(typeof fromClient === "boolean" && fromClient){
                await this.eventReactionMainBox.forEachParallel(box => box._trigger(Events.ClientDisconnect,code,data));
            }
            else{
                await this.eventReactionMainBox.forEachParallel(box => box._trigger(Events.ServerDisconnect,code,data));
            }
            await this.eventReactionMainBox.forEachParallel(box => box._trigger(Events.Disconnect,fromClient,code,data));
        });

        this._socket.on('deauthenticate',async (oldSignedJwtToken,fromClient: any) =>
        {
            this._updateToken(null,null);
            if(this.zc.isDebug()) {Logger.printInfo('Client is deauthenticated.');}
            if(fromClient){
                await this.eventReactionMainBox.forEachParallel(box => box._trigger(Events.ClientDeauthenticate,oldSignedJwtToken));
            }
            else{
                await this.eventReactionMainBox.forEachParallel(box => box._trigger(Events.ServerDeauthenticate,oldSignedJwtToken));
            }
            await this.eventReactionMainBox.forEachParallel(box => box._trigger(Events.Deauthenticate,!!fromClient,oldSignedJwtToken));
        });

        this._socket.on('connectAbort',async (code,data) => {
            if(this.zc.isDebug()) {Logger.printInfo(`Client connect aborted. Code:'${code}' Data:'${data}'`);}
            await this.eventReactionMainBox.forEachParallel(box => box._trigger(Events.ConnectAbort,code,data));
        });

        this._socket.on('connecting', async () => {
            if(this.zc.isDebug()) {Logger.printInfo('Client is connecting.');}
            await this.eventReactionMainBox.forEachParallel(box => box._trigger(Events.Connecting));
        });

        this._socket.on('close', async (code,data) => {
            this._resetAuthState();
            await this.eventReactionMainBox.forEachParallel(box => box._trigger(Events.Close,code,data));
        });

        this._socket.on('authenticate', async (signedJwtToken) => {
            this._updateToken(this._socket.getAuthToken(),this._socket.getSignedAuthToken());
            if(this.isDebug()) {
                Logger.printInfo(`Client is authenticated with userId: '${this._userId}' and auth user group: '${this._authUserGroup}'.`)
            }
            await this.eventReactionMainBox.forEachParallel(box => box._trigger(Events.Authenticate,signedJwtToken));
        });
    }

    private _resetAuthState() {
        this._userId = undefined;
        this._authUserGroup = undefined;
        this._plainToken = null;
        this._signedToken = null;
    }

    private _updateToken(token: ZationToken | null, signedToken: null | string) {
        this._plainToken = token;
        this._signedToken = signedToken;
        if(token != null){
            this._userId = token.userId;
            this._authUserGroup = token.authUserGroup;
        }
        else {
            this._userId = undefined;
            this._authUserGroup = undefined;
        }
    }

    private _buildScOptions()
    {
        return {
            hostname: this.zc.config.hostname,
            port: this.zc.config.port,
            secure: this.zc.config.secure,
            rejectUnauthorized: this.zc.config.rejectUnauthorized,
            path: this.zc.config.path,
            autoReconnect: this.zc.config.autoReconnect,
            autoReconnectOptions: this.zc.config.autoReconnectOptions,
            autoConnect: false,
            multiplex: false,
            timestampRequests: this.zc.config.timestampRequests,
            ackTimeout: this.zc.config.responseTimeout,
            query: {
                system: this.zc.config.system,
                version: this.zc.config.version,
                apiLevel: this.zc.config.apiLevel,
                attachment: stringify(this.zc.config.handshakeAttachment)
            }
        };
    }

    private _buildWsSocket() {
        // noinspection JSUnresolvedVariable
        this._socket = ModifiedScClient.create(this._buildScOptions());
    }

    //Part Token
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the client is authenticated.
     */
    isAuthenticated(): boolean {
        return this._plainToken != null;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the client is not authenticated.
     */
    isNotAuthenticated(): boolean {
        return this._plainToken == null;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns the raw plain token.
     */
    get plainToken(): ZationToken | null {
        return this._plainToken;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns the raw plain token.
     * @throws AuthenticationRequiredError if the client is not authenticated.
     */
    getPlainToken(): ZationToken {
        if(this._plainToken != null) return this._plainToken;
        throw new AuthenticationRequiredError('To access the plain token.');
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns the raw singed token.
     */
    get rawSignedToken(): string | null {
        return this._signedToken;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns the raw signed token.
     * @throws AuthenticationRequiredError if the client is not authenticated.
     */
    getRawSignedToken(): string {
        if(this._signedToken != null) return this._signedToken;
        throw new AuthenticationRequiredError('To access the signed token.');
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns the token payload of this socket.
     */
    get tokenPayload(): Partial<TP> | undefined {
        if(this._plainToken == null) return undefined;
        const payload = this._plainToken.payload;
        return payload ? deepClone(payload) : {};
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns the token payload of this socket.
     * @throws AuthenticationRequiredError if the client is not authenticated.
     */
    getTokenPayload(): Partial<TP> {
        const payload = this.getPlainToken().payload;
        return payload ? deepClone(payload) : {};
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the token id of the token.
     */
    get tokenId(): string | undefined {
        return this._plainToken?.tid;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the token id of the token.
     * @throws AuthenticationRequiredError if the client is not authenticated.
     */
    getTokenId(): string {
        return this.getPlainToken().tid!;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the token expire.
     */
    get tokenExpire(): number | undefined {
        return this._plainToken?.exp;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the token expire.
     * @throws AuthenticationRequiredError if the client is not authenticated.
     */
    getTokenExpire(): number {
        return this.getPlainToken().exp!;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the client has panel access with the current token state.
     */
    hasPanelAccess(): boolean {
        return this.plainToken?.panelAccess === true;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the user id of the client.
     */
    get userId(): string | number | undefined {
        return this._userId;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the user id of the client.
     * @throws AuthenticationRequiredError if the client is not authenticated.
     * @throws UndefinedUserIdError if no user id is defined.
     */
    getUserId(): string | number {
        if(this._plainToken == null) throw new AuthenticationRequiredError('To access the user id.');
        if(this._userId !== undefined)
            return this._userId!;
        else {
            throw new UndefinedUserIdError();
        }
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the authUserGroup of the client.
     */
    get authUserGroup(): string | undefined {
        return this._authUserGroup;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the authUserGroup of the client.
     * @throws AuthenticationRequiredError if the client is not authenticated.
     * @throws UndefinedAuthUserGroupError if no auth user group is defined.
     * Can happen in only panel tokens.
     */
    getAuthUserGroup(): string {
        if(this._plainToken == null) throw new AuthenticationRequiredError('To access the authUserGroup.');
        if(this._authUserGroup !== undefined){
            return this._authUserGroup;
        }
        else {
            throw new UndefinedAuthUserGroupError();
        }
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
    on(event: string,handler: OnHandlerFunction): void {
        this._socket.on(ZATION_CUSTOM_EVENT_NAMESPACE+event,handler);
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
    once(event: string,handler: OnHandlerFunction): void {
        this._socket.once(ZATION_CUSTOM_EVENT_NAMESPACE+event,handler);
    }

    // noinspection JSUnusedGlobalSymbols
    async emit(eventName: string,data: any,onlyTransmit: true,options: {connectTimeout?: ConnectTimeoutOption,responseTimeout?: number | null}): Promise<void>
    // noinspection JSUnusedGlobalSymbols
    async emit(eventName: string,data: any,onlyTransmit: false,options: {connectTimeout?: ConnectTimeoutOption,responseTimeout?: number | null}): Promise<any>
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Emit to the server.
     * If you not only transmit than the return value is a promise with the result,
     * and if an error occurs while emitting to the server, this error is thrown.
     * It uses the custom zation event namespace
     * (so you cannot have name conflicts with internal event names).
     * @throws ConnectionRequiredError, TimeoutError, Error,AbortSignal
     * @param event
     * @param data
     * @param onlyTransmit
     * Indicates if you only want to transmit data.
     * If not than the promise will be resolved with the result when the server responded on the emit.
     * @param connectTimeout
     * With the ConnectTimeout option, you can activate that the socket is
     * trying to connect when it is not connected. You have five possible choices:
     * Undefined: It will use the value from the default options.
     * False: The action will fail and throw a ConnectionRequiredError,
     * when the socket is not connected.
     * Null: The socket will try to connect (if it is not connected) and
     * waits until the connection is made, then it continues the action.
     * Number: Same as null, but now you can specify a timeout (in ms) of
     * maximum waiting time for the connection. If the timeout is reached,
     * it will throw a timeout error.
     * AbortTrigger: Same as null, but now you have the possibility to abort the wait later.
     * @param responseTimeout
     * Set the response timeout of the emit.
     * Value can be null which means the timeout is disabled or
     * undefined then it will use the default response timeout of the zation client config,
     * or it can be a number that indicates the milliseconds.
     */
    async emit(event: string,data: any,onlyTransmit: boolean = true,
               {connectTimeout,responseTimeout}: {connectTimeout?: ConnectTimeoutOption,responseTimeout?: number | null} = {}): Promise<object | void>
    {
        await ConnectionUtils.checkConnection(this,connectTimeout);

        return new Promise<object>((resolve, reject) => {
            // noinspection DuplicatedCode
            if(onlyTransmit){
                this._socket.emit(ZATION_CUSTOM_EVENT_NAMESPACE+event,data,undefined);
                resolve();
            }
            else {
                this._socket.emit(ZATION_CUSTOM_EVENT_NAMESPACE+event,data,(err, data) => {
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
                },responseTimeout);
            }
        });
    }

    //Part Getter/Setter
    // noinspection JSUnusedGlobalSymbols
    getRejectUnauthorized(): boolean{
        return this.zc.config.rejectUnauthorized;
    }

    // noinspection JSUnusedGlobalSymbols
    getSystem(): string {
        return this.zc.config.system;
    };

    // noinspection JSUnusedGlobalSymbols
    getVersion(): number {
        return this.zc.config.version;
    };

    // noinspection JSUnusedGlobalSymbols
    getHostname(): string {
        return this.zc.config.hostname;
    };

    // noinspection JSUnusedGlobalSymbols
    getPort(): number {
        return this.zc.config.port;
    };

    // noinspection JSUnusedGlobalSymbols
    getSecure(): boolean {
        return this.zc.config.secure;
    };

    // noinspection JSUnusedGlobalSymbols
    isDebug(): boolean {
        return this.zc.config.debug;
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the full server address with protocol (http/https), hostname, port and path.
     */
    getServerAddress(): string {
        const path = this.zc.config.path;
        const hostname = this.zc.config.hostname;
        const port = this.zc.config.port;
        const secure = this.zc.config.secure;
        return `${secure ? 'https': 'http'}://${hostname}:${port}${path}`;
    };

    //Part trigger
    // noinspection JSUnusedGlobalSymbols
    /**
     * @internal
     * @description
     * Used internally.
     * Only use this method carefully.
     */
    _triggerResponseReactions(response: Response): Promise<void> {
        return this.responseReactionMainBox.forEach((responseReactionBox) =>
            responseReactionBox._trigger(response));
    }

    /**
     * @internal
     * Used internally.
     * @private
     */
    _getChannelEngine(): ChannelEngine {
        return this.channelEngine;
    }

    /**
     * @internal
     * Used internally.
     * @private
     */
    _getDataboxManager(): DataboxManager {
        return this.databoxManager;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the zation client config.
     * Used internally.
     * Only use this method carefully.
     */
    getZc(): ZationClientConfig {
        return this.zc;
    }

    /**
     * Cast a value to an instance of this class.
     * That can be useful if you are programming in javascript,
     * but the IDE can interpret the typescript information of this library.
     * @param value
     */
    static cast(value: any): ZationClient {
        return value as ZationClient;
    }
}