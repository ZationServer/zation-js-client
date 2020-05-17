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
import {ObjectPath}                 from "../main/utils/objectPath";
// noinspection ES6PreferShortImport
import {AuthenticationFailedError}  from "../main/error/authenticationFailedError";
// noinspection ES6PreferShortImport
import {EventReactionBox}           from "../main/event/eventReactionBox";
// noinspection ES6PreferShortImport
import {StandardRequest}            from "../main/controller/request/main/standardRequest";
// noinspection ES6PreferShortImport
import {Response}                   from "../main/controller/response/response";
import {AuthEngine}                 from "../main/auth/authEngine";
import {ModifiedScClient}           from "../main/sc/modifiedScClient";
// noinspection ES6PreferShortImport
import {TimeoutError, TimeoutType}  from "../main/error/timeoutError";
import DataboxBuilder               from "../main/databox/databoxBuilder";
import perf                         from "../main/utils/perf";
import {BaseRequest}                from "../main/controller/request/main/baseRequest";
// noinspection ES6PreferShortImport
import {AuthRequest}                            from "../main/controller/request/main/authRequest";
import {SpecialController, ValidationCheckPair} from "../main/controller/controllerDefinitions";
import {controllerRequestSend}                  from "../main/controller/controllerSendUtils";
import Package, {isPackage}                     from "../main/receiver/package/main/package";
import {receiverPackageSend}                    from "../main/receiver/receiverSendeUtils";
import PackageBuilder                           from "../main/receiver/package/fluent/packageBuilder";
import Channel                                  from "../main/channel/channel";

const stringify                     = require("fast-stringify");

export class ZationClient
{
    private readonly authEngine: AuthEngine;
    private readonly channelEngine: ChannelEngine;
    private readonly zc: ZationClientConfig;

    //Responds
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
        this.authEngine = new AuthEngine(this);

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
        this.authEngine.connectToSocket(this._socket);
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
     * @internal
     * @description
     * Don't use this method,
     * it is used internal and returns the auth engine.
     */
    _getAuthEngine(): AuthEngine {
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
    async signAuthenticate(signToken: string,connectTimeout: ConnectTimeoutOption = undefined): Promise<void> {
        await this.authEngine.signAuthenticate(signToken,connectTimeout);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Deauthenticate the connection if it is authenticated.
     * @throws DeauthenticationFailedError
     */
    async deauthenticate(): Promise<void> {
        await this.authEngine.deauthenticate();
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
     * Returns a Databox builder, which helps you to build the
     * settings for connecting to the Databox on the server.
     * The builder returns a new Databox object, with this object
     * you easily can connect to a Databox on the server-side.
     * The Databox handles mostly everything: disconnections,
     * missing cud updates, restores.
     * It will do everything that it always has the newest data.
     * @param identifier
     * The identifier of the Databox that is also used to register a
     * Databox in the configuration of the server.
     * @param member
     * The member is only needed if you want to connect to a DataboxFamily.
     */
    databox(identifier: string,member?: string | number): DataboxBuilder {
        return new DataboxBuilder(this,identifier,member);
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
     */
    unsubscribeAllChannels() {
       this.channelEngine.unsubscribeAllChannels();
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
                if(this.zc.isDebug()) {
                    Logger.printInfo('Client is first connected.');
                }
                await this.eventReactionMainBox.forEachParallel(box => box._trigger(Events.FirstConnect));
            }
            else {
                if(this.zc.isDebug()) {
                    Logger.printInfo('Client is reconnected.');
                }
                await this.eventReactionMainBox.forEachParallel(box => box._trigger(Events.Reconnect));
            }
            await this.eventReactionMainBox.forEachParallel(box => box._trigger(Events.Connect,this.firstConnection));
            this.firstConnection = false;
        });

        this._socket.on('error', async (err) => {
            if(this.zc.isDebug()) {
                Logger.printError(err);
            }
            await this.eventReactionMainBox.forEachParallel(box => box._trigger(Events.Error,err));
        });

        this._socket.on('disconnect',async (code,data) =>
        {
            const fromClient: any = data ? data['#internal-fromZationClient']: false;
            if(typeof fromClient === "boolean" && fromClient){
                if(this.zc.isDebug()) {
                    Logger.printInfo(`Client is disconnected from client. Code:'${code}' Data:'${data}'`);
                }
                await this.eventReactionMainBox.forEachParallel(box => box._trigger(Events.ClientDisconnect,code,data));
            }
            else{
                if(this.zc.isDebug()) {
                    Logger.printInfo(`Client is disconnected from server. Code:'${code}' Data:'${data}'`);
                }
                await this.eventReactionMainBox.forEachParallel(box => box._trigger(Events.ServerDisconnect,code,data));
            }
            await this.eventReactionMainBox.forEachParallel(box => box._trigger(Events.Disconnect,fromClient,code,data));
        });

        this._socket.on('deauthenticate',async (oldSignedJwtToken,fromClient) =>
        {
            if(fromClient){
                if(this.zc.isDebug()) {
                    Logger.printInfo('Client is deauthenticated from client.');
                }
                await this.eventReactionMainBox.forEachParallel(box => box._trigger(Events.ClientDeauthenticate,oldSignedJwtToken));
            }
            else{
                if(this.zc.isDebug()) {
                    Logger.printInfo('Client is deauthenticated from server.');
                }
                await this.eventReactionMainBox.forEachParallel(box => box._trigger(Events.ServerDeauthenticate,oldSignedJwtToken));
            }
            await this.eventReactionMainBox.forEachParallel(box => box._trigger(Events.Deauthenticate,!!fromClient,oldSignedJwtToken));
        });

        this._socket.on('connectAbort',async (code,data) => {
            if(this.zc.isDebug()) {
                Logger.printInfo(`Client connect aborted. Code:'${code}' Data:'${data}'`);
            }
            await this.eventReactionMainBox.forEachParallel(box => box._trigger(Events.ConnectAbort,code,data));
        });

        this._socket.on('connecting', async () => {
            if(this.zc.isDebug()) {
                Logger.printInfo('Client is connecting.');
            }
            await this.eventReactionMainBox.forEachParallel(box => box._trigger(Events.Connecting));
        });

        this._socket.on('close', async (code,data) => {
            await this.eventReactionMainBox.forEachParallel(box => box._trigger(Events.Close,code,data));
        });

        this._socket.on('authenticate', async (signedJwtToken) => {
            if(this.zc.isDebug()) {
                Logger.printInfo('Client is authenticated.');
            }
            await this.eventReactionMainBox.forEachParallel(box => box._trigger(Events.Authenticate,signedJwtToken));
        });
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
                variables: stringify(this.zc.config.handshakeVariables)
            }
        };
    }

    private _buildWsSocket() {
        // noinspection JSUnresolvedVariable
        this._socket = ModifiedScClient.create(this._buildScOptions());
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
    hasTokenVariable(path?: string | string[]): boolean {
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
    getTokenVariable(path?: string | string[]): any {
        return ObjectPath.get(this.authEngine.getTokenVariables(),path);
    }

    //Part Token

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns token id of the token form the sc.
     * @throws AuthenticationRequiredError
     */
    getTokenId(): string
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
    getTokenExpire(): number
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
    hasPanelAccess(): boolean
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
    getPlainToken(): ZationToken
    {
        return this.authEngine.getSecurePlainToken();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the current sign token.
     * Is null if socket has no token.
     */
    getSignToken(): string | null
    {
        return this.authEngine.getSignToken();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the socket is authenticated (token with auth user group).
     */
    isAuthenticated(): boolean
    {
        return this.authEngine.isAuthenticated();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the auth user group.
     * Is undefined if socket is not authenticated.
     */
    getAuthUserGroup(): string | undefined
    {
        return this.authEngine.getAuthUserGroup();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the user id.
     * Is undefined if socket is not authenticated or has not a userId.
     */
    getUserId(): string | number | undefined
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