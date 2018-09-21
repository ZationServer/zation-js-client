/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import AuthEngine = require("../helper/auth/authEngine");
import Const = require('../helper/constants/constWrapper');
import ChannelEngine = require("../helper/channel/channelEngine");
import Box = require("../helper/box/box");
import ResponseReactionBox = require("./responseReactionBox");
import ChannelReactionBox = require("./channelReactionBox");
import ReactionBox = require("../helper/react/box/reactionBox");
import ConfigTools = require("../helper/tools/configTools");
import ConBackup = require("../helper/connection/conBackup");
import WsRequest = require("./wsRequest");
import Response = require("./response");
import SendEngine = require("../helper/send/sendEngine");
const  SocketClusterClient  = require('socketcluster-client');
import {SendAble} from "../helper/request/sendAble";
import {ProtocolType} from "../helper/constants/protocolType";
import {ZationOptions} from "./zationOptions";
import {ProgressHandler} from "../helper/request/progressHandler";
import ZationRequest = require("../helper/request/zationRequest");
import RequestBuilder = require("../helper/request/requestBuilder");
import ConnectionAbortError = require("../helper/error/connectionAbortError");

class Zation
{
    //Var
    private readonly settings : object;

    private readonly authEngine : AuthEngine;
    private readonly channelEngine : ChannelEngine;

    private debug : boolean = false;
    private system : string = 'W';
    private version : number = 1.0;
    private hostname : string = 'localhost';
    private path : string = '/zation';
    private port : number = 3000;
    private secure : boolean = false;
    private rejectUnauthorized : boolean = false;
    private postKeyWord : string = 'zation';

    private autoAllChSub : boolean = true;
    private autoUserChSub : boolean = true;
    private autoDefaultUserGroupChSub : boolean = true;
    private autoAuthUserGroupChSub : boolean = true;


    //Responds
    private responseReactionMainBox : Box<ResponseReactionBox>;
    private channelReactionMainBox : Box<ChannelReactionBox>;

    //system reactionBoxes
    private readonly syResponseReactionBox : ResponseReactionBox;
    private readonly syChannelReactionBox : ChannelReactionBox;

    private readonly userResponseReactionBox : ResponseReactionBox;
    private readonly userChannelReactionBox : ChannelReactionBox;

    //webSockets
    private socket : any;
    private conBackup : ConBackup;

    
    constructor(settings : ZationOptions = {})
    {
        //Var
        this.settings = settings;

        //this.emitter = new Emitter();

        this.channelEngine = new ChannelEngine(this);
        this.authEngine = new AuthEngine(this,this.channelEngine);

        //Responds
        this.responseReactionMainBox = new Box<ResponseReactionBox>();
        this.channelReactionMainBox = new Box<ChannelReactionBox>();

        //readConfig
        this.readServerGeneratedSettings();
        this.readSettings();

        //system reactionBoxes
        this.syResponseReactionBox = new ResponseReactionBox();
        this.userResponseReactionBox = new ResponseReactionBox();
        this.syChannelReactionBox = new ChannelReactionBox();
        this.userChannelReactionBox = new ChannelReactionBox();

        this.responseReactionMainBox.addFixedItem(this.syResponseReactionBox);
        this.responseReactionMainBox.addFixedItem(this.userResponseReactionBox);
        this.channelReactionMainBox.addFixedItem(this.syChannelReactionBox);
        this.channelReactionMainBox.addFixedItem(this.userChannelReactionBox);

        //Init
        this.addRespondsFromSettings();
        this.createSystemReactions();
    }

    //Part Main Config

    private readServerGeneratedSettings()
    {
        // @ts-ignore
        if(typeof ZATION_SERVER_SETTINGS === 'object')
        {
            // noinspection JSUnresolvedVariable
            // @ts-ignore
            let zss = ZATION_SERVER_SETTINGS;

            if(!!zss['HOSTNAME']) {
                this.hostname = zss['HOSTNAME'];
            }
            if(!!zss['PORT']) {
                this.port = zss['PORT'];
            }
            if(!!zss['PATH']) {
                this.path = zss['PATH'];
            }
            if(!!zss['SECURE']) {
                this.secure = zss['SECURE'];
            }
            if(!!zss['POST_KEY_WORD']) {
                this.postKeyWord = zss['POST_KEY_WORD'];
            }
        }
    }

    private readSettings()
    {
        if (!!this.settings['debug']) {
            this.debug = this.settings['debug'];
        }
        if (!!this.settings['system']) {
            this.system = this.settings['system'];
        }
        if (!!this.settings['version']) {
            this.version = this.settings['version'];
        }
        if (!!this.settings['hostname']) {
            this.hostname = this.settings['hostname'];
        }
        if (!!this.settings['path']) {
            this.path = this.settings['path'];
        }
        if (!!this.settings['port']) {
            this.port = this.settings['port'];
        }
        if (!!this.settings['postKeyWord']) {
            this.postKeyWord = this.settings['postKeyWord'];
        }
        if (!!this.settings['secure']) {
            this.secure = this.settings['secure'];
        }
        if (!!this.settings['rejectUnauthorized']) {
            this.rejectUnauthorized = this.settings['rejectUnauthorized'];
        }
        if (!!this.settings['autoAllChSub']) {
            this.autoAllChSub = this.settings['autoAllChSub'];
        }
        if (!!this.settings['autoUserChSub']) {
            this.autoUserChSub = this.settings['autoUserChSub'];
        }
        if (!!this.settings['autoDefaultUserGroupChSub']) {
            this.autoDefaultUserGroupChSub = this.settings['autoDefaultUserGroupChSub'];
        }
        if (!!this.settings['autoAuthUserGroupChSub']) {
            this.autoAuthUserGroupChSub = this.settings['autoAuthUserGroupChSub'];
        }
    }

    private addRespondsFromSettings()
    {
        let resp = this.settings['responds'];
        if (resp !== undefined)
        {
           ConfigTools.addJsonReactionBox(((reactionBox) => {
               this.addReactionBox(reactionBox);
           }),resp);
        }
    }

    private createSystemReactions()
    {
        this.syChannelReactionBox.onUserCh(Const.Settings.USER_CHANNEL.AUTH_OUT,() => {
            this.authEngine.authOut();
        });

        this.syChannelReactionBox.onUserCh(Const.Settings.USER_CHANNEL.RE_AUTH,() => {
            this.authEngine.reAuth();
        });
    }

    //Part Responds

    // noinspection JSUnusedGlobalSymbols
    removeAllReactionBoxes() : void
    {
        this.responseReactionMainBox.removeAllItems();
        this.channelReactionMainBox.removeAllItems();
    }

    // noinspection JSUnusedGlobalSymbols
    addReactionBox(reactionBox : ReactionBox) : boolean
    {
        if(reactionBox instanceof ResponseReactionBox) {
            return this.responseReactionMainBox.addItem(reactionBox);
        }
        else if(reactionBox instanceof ChannelReactionBox) {
            return this.channelReactionMainBox.addItem(reactionBox);
        }
        else {
            return false;
        }
    }

    // noinspection JSUnusedGlobalSymbols
    addReactionBoxes(...reactionBoxes : ReactionBox[]) : void
    {
        for(let i = 0; i < reactionBoxes.length; i++) {
            this.addReactionBox(reactionBoxes[i]);
        }
    }

    // noinspection JSUnusedGlobalSymbols
    removeReactionBox(reactionBox : ReactionBox) : boolean
    {
        if(reactionBox instanceof ResponseReactionBox) {
            return this.responseReactionMainBox.removeItem(reactionBox);
        }
        else if(reactionBox instanceof ChannelReactionBox) {
            return this.channelReactionMainBox.removeItem(reactionBox);
        }
        else {
            return false;
        }
    }

    //Part Reaction Add
    // noinspection JSUnusedGlobalSymbols
    channelReact() : ChannelReactionBox {
        return this.userChannelReactionBox;
    }

    // noinspection JSUnusedGlobalSymbols
    responseReact() : ResponseReactionBox {
        return this.userResponseReactionBox;
    }

    //Part Ping

    async ping() : Promise<number>
    {
        let req = new WsRequest(Const.SyController.PING);
        let start = Date.now();
        await this.send(req);
        return Date.now() - start;
    }

    //Part Events

    /*
    on(event : string,reaction : Function = () => {}) : void
    {
       this.emitter.on(event,reaction);
    }

    private _emitEvent(event : string,...data : any[]) : void
    {
       this.emitter.emit(event,...data);
    }
    */

    //Part Auth

    getAuthEngine() : AuthEngine {
        return this.authEngine;
    }

    async authIn(authData : object,protocolType : ProtocolType = ProtocolType.WebSocket) : Promise<Response> {
        return await this.authEngine.authIn(authData,protocolType);
    }

    authOut() : void {
        this.authEngine.authOut();
    }

    //Part Easy
    async connectAndAuthIn(authData : object)
    {
        await this.connect();
        return await this.authIn(authData);
    }

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

    getSocket() : any
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
                    this.buildWsConnection();
                }

                //register
                this.socket.on('connect',() => {
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

    private buildScOptions()
    {
        return {
            hostname: this.hostname,
            port: this.port,
            secure: this.secure,
            rejectUnauthorized: this.rejectUnauthorized,
            autoReconnect: true,
            path : this.path,
            autoConnect : false
        };
    }

    private buildWsConnection()
    {

        // noinspection JSUnresolvedVariable
        this.socket = SocketClusterClient.create(this.buildScOptions());
        this.conBackup = new ConBackup(this);

        this.socket.on('connect', async () => {


                //this._emitEvent('connected',this.socket);
        });
    }

    //Part Subscribe

    // noinspection JSUnusedGlobalSymbols
    subUserCh() : boolean {
        return this.authEngine.subUserCh();
    }

    // noinspection JSUnusedGlobalSymbols
    unsubUserCh() : boolean {
        return this.authEngine.unsubUserCh();
    }

    // noinspection JSUnusedGlobalSymbols
    subAuthUserGroupCh() : boolean {
        return this.authEngine.subAuthUserGroupCh();
    }

    // noinspection JSUnusedGlobalSymbols
    unsubAuthUserGroupCh() : boolean {
        return this.authEngine.unsubAuthUserGroupCh();
    }

    // noinspection JSUnusedGlobalSymbols
    subDefaultUserGroupCh() : boolean {
        return this.authEngine.subDefaultUserGroupCh();
    }

    // noinspection JSUnusedGlobalSymbols
    unsubDefaultUserGroupCh() {
        return this.authEngine.unsubDefaultUserGroupCh();
    }

    // noinspection JSUnusedGlobalSymbols
    subAllCh() {
        this.channelEngine.registerAllChannel();
    }

    // noinspection JSUnusedGlobalSymbols
    unsubAllCh() {
        this.channelEngine.unregisterAllChannel();
    }

    // noinspection JSUnusedGlobalSymbols
    subCustomCh(chName : string) {
        this.channelEngine.registerCustomCh(chName);
    }

    // noinspection JSUnusedGlobalSymbols
    isSubCustomCh(chName ?: string) : boolean {
        return this.channelEngine.isSubCustomCh(chName);
    }

    // noinspection JSUnusedGlobalSymbols
    unsubCustomCh(chName ?: string) : string[] {
        return this.channelEngine.unsubscribeCustomCh(chName);
    }

    // noinspection JSUnusedGlobalSymbols
    getSubscribedCustomCh(chName ?: string) : string[] {
        return this.channelEngine.getSubCustomCh(chName);
    }

    subCustomIdCh(chName : string, chId : string) {
        this.channelEngine.registerCustomIdCh(chName,chId);
    }

    // noinspection JSUnusedGlobalSymbols
    isSubCustomIdCh(chName ?: string, chId ?: string) : boolean {
        return this.channelEngine.isSubCustomIdCh(chName,chId);
    }

    unsubCustomIdCh(chName ?: string, chId ?: string) : string[] {
        return this.channelEngine.unsubscribeCustomIdCh(chName,chId);
    }

    // noinspection JSUnusedGlobalSymbols
    getSubscribedCustomIdCh(chName ?: string, chId ?: string) : string[] {
        return this.channelEngine.getSubCustomIdCh(chName,chId);
    }

    // noinspection JSUnusedGlobalSymbols
    switchCustomIdCh(channel,id)
    {
        this.unsubCustomIdCh(channel,id);
        this.subCustomIdCh(channel,id);
    }

    //Part trigger RequestResponds

    private async _triggerResponseReactions(response : Response) : Promise<void>
    {
        await this.responseReactionMainBox.forEach(async (responseReactionBox : ResponseReactionBox) => {
            responseReactionBox.trigger(response);
        });
    }

    //Part Getter/Setter

    // noinspection JSUnusedGlobalSymbols
    isAutoAllChSub() : boolean {
        return this.autoAllChSub;
    }

    // noinspection JSUnusedGlobalSymbols
    setAutoAllChSub(value : boolean) : void {
        this.autoAllChSub = value;
    }

    isAutoUserChSub() : boolean {
        return this.autoUserChSub;
    }

    // noinspection JSUnusedGlobalSymbols
    setAutoUserChSub(value : boolean) : void {
        this.autoUserChSub = value;
    }

    // noinspection JSUnusedGlobalSymbols
    isAutoDefaultUserGroupChSub() : boolean {
        return this.autoDefaultUserGroupChSub;
    }

    // noinspection JSUnusedGlobalSymbols
    setAutoDefaultUserGroupChSub(value : boolean) : void {
        this.autoDefaultUserGroupChSub = value;
    }

    // noinspection JSUnusedGlobalSymbols
    isAutoAuthUserGroupChSub() : boolean {
        return this.autoAuthUserGroupChSub;
    }

    // noinspection JSUnusedGlobalSymbols
    setAutoAuthUserGroupChSub(value : boolean) : void {
        this.autoAuthUserGroupChSub = value;
    }

    // noinspection JSUnusedGlobalSymbols
    getRejectUnauthorized()
    {
        return this.rejectUnauthorized;
    }

    // noinspection JSUnusedGlobalSymbols
    getSystem()
    {
        return this.system;
    };

    // noinspection JSUnusedGlobalSymbols
    getVersion()
    {
        return this.version;
    };

    // noinspection JSUnusedGlobalSymbols
    getHostname()
    {
        return this.hostname;
    };

    // noinspection JSUnusedGlobalSymbols
    getPort()
    {
        return this.port;
    };

    // noinspection JSUnusedGlobalSymbols
    getSecure()
    {
        return this.secure;
    };

    // noinspection JSUnusedGlobalSymbols
    isDebug()
    {
        return this.debug;
    };

    // noinspection JSUnusedGlobalSymbols
    getServerAddress()
    {
        if(!!this.path) {
            return `${this.hostname}:${this.port}`;
        }
        else {
            return `${this.hostname}:${this.port}${this.path}`;
        }
    };

    _getChannelReactionMainBox() : Box<ChannelReactionBox> {
        return this.channelReactionMainBox;
    }

}

export = Zation;