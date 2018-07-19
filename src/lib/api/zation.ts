/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import AuthEngine = require("../helper/auth/authEngine");
import Const = require('../helper/constants/constWrapper');
import ChannelEngine = require("../helper/channel/channelEngine");
import Box = require("../helper/box/box");
import Emitter = require('emitter');
import ResponseReactionBox = require("./responseReactionBox");
import ChannelReactionBox = require("./channelReactionBox");
import ReactionBox = require("../helper/react/reactionBox");
import ConfigTools = require("../helper/tools/configTools");
import ConBackup = require("../helper/connection/conBackup");
import WsRequest = require("./wsRequest");
import Response = require("./response");
import SendEngine = require("../helper/send/sendEngine");
const SocketClusterClient  = require('socketcluster-client');
import {SendAble} from "../helper/request/sendAble";
import {ProtocolType} from "../helper/constants/protocolType";
import {ZationOptions} from "./zationOptions";
import {ProgressHandler} from "../helper/request/progressHandler";
import ZationRequest = require("../helper/request/zationRequest");
import RequestBuilder = require("../helper/request/requestBuilder");

class Zation
{
    //Var
    private readonly settings : object;

    private authEngine : AuthEngine;
    private channelEngine : ChannelEngine;

    private debug : boolean = false;
    private system : string = 'W';
    private version : number = 1.0;
    private hostname : string = 'localhost';
    private path : string = '';
    private port : number = 3000;
    private secure : boolean = false;
    private rejectUnauthorized : boolean = false;
    private postKeyWord : string = 'zation';

    private emitter : Emitter;

    //Responds
    private responseReactionMainBox : Box<ResponseReactionBox>;
    private channelReactionMainBox : Box<ChannelReactionBox>;

    //system reactionBoxes
    private readonly syResponseReactionBox : ResponseReactionBox;
    private readonly syChannelReactionBox : ResponseReactionBox;

    private readonly userResponseReactionBox : ResponseReactionBox;
    private readonly userChannelReactionBox : ResponseReactionBox;

    //webSockets
    private socket : any;
    private conBackup : ConBackup;

    
    constructor(settings : ZationOptions)
    {
        //Var
        this.settings = settings;

        this.debug = false;
        this.system = 'W';
        this.version = 1.0;
        this.hostname = 'localhost';
        this.path = '';
        this.port = 3000;
        this.secure = false;
        this.rejectUnauthorized = false;
        this.postKeyWord = 'zation';

        this.emitter = new Emitter();

        this.authEngine = new AuthEngine(this);
        this.channelEngine = new ChannelEngine(this);

        //Responds
        this.responseReactionMainBox = new Box<ResponseReactionBox>();
        this.channelReactionMainBox = new Box<ChannelReactionBox>();

        //readConfig
        this.readServerGeneratedSettings();
        this.readSettings();

        //system reactionBoxes
        this.syResponseReactionBox = new ResponseReactionBox();
        this.userResponseReactionBox = new ResponseReactionBox();
        this.syChannelReactionBox = new ResponseReactionBox();
        this.userChannelReactionBox = new ResponseReactionBox();

        this.responseReactionMainBox.addFixedItem(this.syResponseReactionBox);
        this.responseReactionMainBox.addFixedItem(this.userResponseReactionBox);
        this.channelReactionMainBox.addFixedItem(this.syChannelReactionBox);
        this.channelReactionMainBox.addFixedItem(this.userChannelReactionBox);

        //Init
        this.addRespondsFromSettings();
        this.createSystemReactions();
        this.buildWsConnection();
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
    }

    private addRespondsFromSettings()
    {
        let resp = this.settings['responds'];
        if (resp !== undefined)
        {
           ConfigTools.addJsonReactionBox(((reactionBox, key) => {
               this.addReactionBox(reactionBox,key);
           }),resp);
        }
    }

    private createSystemReactions()
    {
        requestResp.onError(
            "authOut",
            () =>
            {
                this.authOut();
            },
            {
                name : 'clientAuthOut',
                type : ZationConst.ERROR_TYP_REACT
            }
        );

        channelResp.onUserCh(ZationConst.USER_CHANNEL_AUTH_OUT,() =>
        {
            this.authOut();
        });

        channelResp.onUserCh(ZationConst.USER_CHANNEL_RE_AUTH,() =>
        {
            this.reAuth();
        });
    }

    //Part Responds

    // noinspection JSUnusedGlobalSymbols
    getResponseReactionBox(key : string) : ResponseReactionBox
    {
        return this.responseReactionMainBox.getKeyItem(key);
    }

    // noinspection JSUnusedGlobalSymbols
    getChannelReactionBox(key : string) : ChannelReactionBox
    {
        return this.channelReactionMainBox.getKeyItem(key);
    }

    // noinspection JSUnusedGlobalSymbols
    removeReactionBoxItems() : void
    {
        this.responseReactionMainBox.removeAllItems();
        this.channelReactionMainBox.removeAllItems();
    }

    // noinspection JSUnusedGlobalSymbols
    addReactionBox(reactionBox : ReactionBox,key ?: string,overwrite : boolean = true) : boolean
    {
        if(reactionBox instanceof ResponseReactionBox) {
            return this.responseReactionMainBox.addItem(reactionBox,key,overwrite);
        }
        else if(reactionBox instanceof ChannelReactionBox) {
            return this.channelReactionMainBox.addItem(reactionBox,key,overwrite);
        }
        else {
            return false;
        }
    }

    // noinspection JSUnusedGlobalSymbols
    addReactionBoxes(...reactionBoxes : ReactionBox[]) : void
    {
        for(let i = 0; i < reactionBoxes.length; i++)
        {
            this.addReactionBox(reactionBoxes[i]);
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

    on(event : string,reaction : Function = () => {}) : void
    {
       this.emitter.on(event,reaction);
    }

    private _emitEvent(event : string,...data : any[]) : void
    {
       this.emitter.emit(event,...data);
    }

    //Part Auth

    getAuthEngine() : AuthEngine
    {
        return this.authEngine;
    }

    async authIn(authData : object,protocolType : ProtocolType = ProtocolType.WebSocket) : Promise<Response>
    {
        return await this.authEngine.authIn(authData,protocolType);
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
    async send(sendAble : SendAble, progressHandler ?: ProgressHandler) : Promise<Response>
    {
        let ph : undefined | ProgressHandler = undefined;
        if(!!progressHandler) {
            ph = progressHandler;
        }
        else if(sendAble instanceof ZationRequest) {
            ph = sendAble.getPogressHandler();
        }

        let jsonObj = await sendAble.getSendData(this);

        if(sendAble.getProtocol() === ProtocolType.WebSocket) {
            const response = await SendEngine.wsSend(this,jsonObj,ph);
            await this.triggerResponseReactions(response);
            return response;
        }
        else {
            const response = await SendEngine.httpSend(this,jsonObj,ph);
            await this.triggerResponseReactions(response);
            return response;
        }
    };

    // Part Connection

    getSocket() : any
    {
        return this.socket;
    }

    isSocketConnected() : boolean
    {
        return this.socket !== undefined && this.socket.state === this.socket.OPEN
    }

    connect() : Promise<void>
    {
        return new Promise<void>((resolve)=>
        {
            if(this.isSocketConnected())
            {
                resolve();
            }
            else
            {
                if(this.socket === undefined) {
                    this.buildWsConnection();
                }

                this.socket.on('connect',() =>
                {
                    resolve();
                });
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
            path : this.path
        };
    }

    private buildWsConnection()
    {

        // noinspection JSUnresolvedVariable
        this.socket = SocketClusterClient.create(this.buildScOptions());
        this.conBackup = new ConBackup(this);

        this.socket.on('connect', async () => {

                this._emitEvent('connected',this.socket);
        });


    }

    //Part trigger RequestResponds

    private async triggerResponseReactions(response : Response) : Promise<void>
    {
        await this.responseReactionMainBox.forEach(async (responseReaction) =>
        {
            responseReaction._trigger(response);
        });
    }



    // PART OLD
    _setNewAuthId(id)
    {
        if (this._currentUserId !== id)
        {
            this.unregisterUserChannel();

            this._currentUserId = id;

            if(this._userChannelAutoRegistration)
            {
                this.registerUserChannel();
            }
        }
    }

    _setNewAuthGroup(group)
    {
        if (this._currentUserAuthGroup !== group)
        {
            if (group !== undefined && group !== '')
            {
                this.unregisterDefaultGroupChannel();
                this.unregisterAuthGroupChannel();

                this._currentUserAuthGroup = group;

                if(this._authGroupChannelAutoRegistration)
                {
                    this.registerAuthGroupChannel();
                }

                if(this.debug)
                {
                    ZationTools._printInfo(`User is Login with id -> ${this._currentUserId} in Group
                 -> ${this._currentUserAuthGroup}`);
                }
            }
            else
            {
                this.unregisterAuthGroupChannel();

                this._currentUserAuthGroup = group;

                if(this._defaultGroupChannelAutoRegistration)
                {
                    this.registerDefaultGroupChannel();
                }
            }
        }
    }

    _updateAuthInfo(token)
    {
        if(token !== null)
        {
            if(token[ZationConst.CLIENT_AUTH_ID] !== undefined)
            {
                this._setNewAuthId(token[ZationConst.CLIENT_AUTH_ID]);
            }

            if(token[ZationConst.CLIENT_AUTH_GROUP] !== undefined)
            {
                this._setNewAuthGroup(token[ZationConst.CLIENT_AUTH_GROUP]);
            }
        }
    }

    // noinspection JSUnusedGlobalSymbols
    _socketIsAuthOut()
    {
        this._setNewAuthGroup('');
        this._setNewAuthId(undefined);
    }

    reAuth()
    {
        this._isReAuth = true;
        this._authOutWithAuto();
    }

    _authOutWithAuto()
    {
        this._socket.deauthenticate((e) =>
        {
            if(e)
            {
                this._socket.disconnect();
            }
            else
            {
                this._socketIsAuthOut();
            }
        });
    }

    authOut()
    {
        this._isAuthOut = true;
        this._authOutWithAuto();
    }

    // noinspection JSUnusedGlobalSymbols
    async authInOld(respond, authData)
    {
        if(authData !== undefined)
        {
            this._authData = authData;
        }
        else
        {
            authData = this._authData;
        }

        let data = ZationTools._buildAuthRequestData(authData, this.system, this.version);
        await this._emitZationRequest(data,respond);
        return this.isAuthIn();
    }

    //Part Channel

    // noinspection JSUnusedGlobalSymbols
    registerUserChannel()
    {
        if(this._currentUserId !== undefined)
        {
            this._registerZationChannel(ZationConst.CHANNEL_USER_CHANNEL_PREFIX,this._currentUserId);
            return true;
        }
        else
        {
            return false;
        }
    }

    // noinspection JSUnusedGlobalSymbols
    unregisterUserChannel()
    {
        if(this._currentUserId !== undefined)
        {
            this._unregisterZationChannel(ZationConst.CHANNEL_USER_CHANNEL_PREFIX + this._currentUserId);
            return true;
        }
        else
        {
            return false;
        }
    }

    // noinspection JSUnusedGlobalSymbols
    registerAuthGroupChannel()
    {
        if(ZationTools._isAuthIn(this._currentUserAuthGroup))
        {
            this._registerZationChannel(ZationConst.CHANNEL_AUTH_GROUP_PREFIX, this._currentUserAuthGroup);
            return true;
        }
        else
        {
            return false;
        }
    }

    // noinspection JSUnusedGlobalSymbols
    unregisterAuthGroupChannel()
    {
        if(ZationTools._isAuthIn(this._currentUserAuthGroup))
        {
            this._unregisterZationChannel(ZationConst.CHANNEL_AUTH_GROUP_PREFIX + this._currentUserAuthGroup);
            return true;
        }
        else
        {
            return false;
        }
    }

    // noinspection JSUnusedGlobalSymbols
    registerDefaultGroupChannel()
    {
        if(!ZationTools._isAuthIn(this._currentUserAuthGroup))
        {
            this._registerZationChannel(ZationConst.CHANNEL_DEFAULT_GROUP);
            return true;
        }
        else
        {
            return false;
        }
    }

    // noinspection JSUnusedGlobalSymbols
    unregisterDefaultGroupChannel()
    {
        if(!ZationTools._isAuthIn(this._currentUserAuthGroup))
        {
            this._unregisterZationChannel(ZationConst.CHANNEL_DEFAULT_GROUP);
            return true;
        }
        else
        {
            return false;
        }
    }

    // noinspection JSUnusedGlobalSymbols
    registerAllChannel()
    {
        this._registerZationChannel(ZationConst.CHANNEL_ALL);
    }

    // noinspection JSUnusedGlobalSymbols
    unregisterAllChannel()
    {
        this._unregisterZationChannel(ZationConst.CHANNEL_ALL);
    }

    _registerZationChannel(channel,id = '')
    {
        let fullChannel = channel + id;
        this._socket.subscribe(fullChannel,{});

        let watcher = (input) =>
        {
            this.channelReactionMainBox.forEach((respond) =>
            {
                respond._trigger(
                    {
                        channel : channel,
                        isSpecial : false,
                        event : input['e'],
                        data : input['d']
                    });
            });
        };
        this._socket.unwatch(fullChannel);
        this._socket.watch(fullChannel,watcher);
    }

    _unregisterZationChannel(channel)
    {
        if(this._socket !== undefined && this._socket.isSubscribed(channel))
        {
            this._socket.destroyChannel(channel);
        }
    }

    //Part Special Channel

    // noinspection JSUnusedGlobalSymbols
    subscribeSpecialCh(channel,id)
    {
        let channelName = ZationConst.CHANNEL_SPECIAL_CHANNEL_PREFIX + channel + ZationConst.CHANNEL_SPECIAL_CHANNEL_ID + id;
        this._socket.subscribe(channelName);

        let watcher = (input) =>
        {
            this.channelReactionMainBox.forEach((respond) =>
            {
                respond._trigger(
                    {
                        channel : channel,
                        id : id,
                        isSpecial : true,
                        event : input['e'],
                        data : input['d']
                    });
            });
        };
        this._socket.unwatch(channelName);
        this._socket.watch(channelName,watcher);
    }

    // noinspection JSUnusedGlobalSymbols
    subscribeNewSpecialChannelId(channel,id)
    {
        this.unsubscribeSpecialCh(channel);
        this.subscribeSpecialCh(channel,id);
    }

    // noinspection JSUnusedGlobalSymbols
    isSubscribeSpecialCh(channel,id)
    {
        let channelName = ZationTools.getSpecialChannelName(channel,id);
        let subs = this._socket.subscriptions();
        let found = false;

        for(let i = 0; i < subs.length; i++)
        {
            if(subs[i].indexOf(channelName) !== -1)
            {
                found = true;
            }
        }
        return found;
    }

    // noinspection JSUnusedGlobalSymbols
    static getSpecialChannelName(channel,id)
    {
        let channelName = ZationConst.CHANNEL_SPECIAL_CHANNEL_PREFIX;

        if(channel !== undefined)
        {
            channelName+= id;
            if(id !== undefined)
            {
                channelName += ZationConst.CHANNEL_SPECIAL_CHANNEL_ID + id;
            }
        }

        return channelName;
    }

    // noinspection JSUnusedGlobalSymbols
    unsubscribeSpecialCh(channel,id)
    {
        let channelName = ZationTools.getSpecialChannelName(channel,id);

        let subs = this._socket.subscriptions();
        let isUnsubscribeAChannel = false;

        for(let i = 0; i < subs.length; i++)
        {
            if(subs[i].indexOf(channelName) !== -1)
            {
                this._socket.destroyChannel(subs[i]);
                isUnsubscribeAChannel = true;
            }
        }
        return isUnsubscribeAChannel;
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
    getServerAddress()
    {
        return this.hostname + ':' + this.settings.port;
    };


    //Part Connection

    // noinspection JSUnusedGlobalSymbols
    _refreshChannelRegistration()
    {
        this.registerAllChannel();
        this.registerDefaultGroupChannel();
        this.registerUserChannel();
        this.registerAuthGroupChannel();
    }


}

export = Zation;