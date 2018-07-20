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
import ReactionBox = require("../helper/react/box/reactionBox");
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

    private autoAllChSub : boolean = true;
    private autoUserChSub : boolean = true;
    private autoDefaultUserGroupChSub : boolean = true;
    private autoAuthUserGroupChSub : boolean = true;

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
    async send(sendAble : SendAble, responseReactionBox : ResponseReactionBox ,progressHandler ?: ProgressHandler) : Promise<Response>
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
        return `${this.hostname}:${this.port}/${this.path}`;
    };

}

export = Zation;