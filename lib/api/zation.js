/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

const SocketClusterClient = require('socketcluster-client');
const Const               = require('../helper/constants/constWrapper');

// noinspection JSUnusedGlobalSymbols
class Zation
{
    constructor(settings = {})
    {
        //Var
        this._settings = settings;

        this._currentUserId = undefined;
        this._currentUserAuthGroup = undefined;

        this._authData = {};
        this._debug = false;
        this._autoStartAuth = false;
        this._autoReAuth = true;
        this._system = 'W';
        this._version = 1.0;
        this._hostname = 'localhost';
        this._path = '';
        this._port = 3000;
        this._secure = false;
        this._rejectUnauthorized = false;
        this._postKeyWord = 'zation';

        //SystemVars
        this._isAuthOut = false;
        this._isReAuth  = false;
        this._isFirstStart = true;
        this._authTokenName = 'zationToken';
        this._reconnect = false;

        //ChannelRegistration
        this._userChannelAutoRegistration         = true;
        this._authGroupChannelAutoRegistration    = true;
        this._defaultGroupChannelAutoRegistration = true;
        this._allChannelAutoRegistration          = true;

        this._events = [];

        //Responds
        this._requestResponds = new Box();
        this._channelResponds = new Box();

        //Init
        this._createSystemResponds();
        this._readServerSettings();
        this._readSettings();
        this._addRespondsFromSettings();
        this._createSystemReactions();
        this._buildConnection();
    }

    _createSystemResponds()
    {
        this._requestRespondSystem = this._requestResponds.addFixedItem(new RequestRespond());
        this._channelRespondSystem = this._channelResponds.addFixedItem(new ChannelRespond());
    }

    _createSystemReactions()
    {
        let requestResp = this._requestResponds.getFixedItem(this._requestRespondSystem);
        let channelResp = this._channelResponds.getFixedItem(this._channelRespondSystem);

        requestResp.catchError(
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

    //Part Ping

    async ping()
    {
        let req = new Request(ZationConst.SYSTEM_CONTROLLER_PING);
        let start = Date.now();
        await this.send(req);
        return Date.now() - start;
    }

    //Part Responds

    // noinspection JSUnusedGlobalSymbols
    getRequestRespond(key)
    {
        return this._requestResponds.getItem(key);
    }

    // noinspection JSUnusedGlobalSymbols
    getChannelRespond(key)
    {
        return this._channelResponds.getItem(key);
    }

    // noinspection JSUnusedGlobalSymbols
    removeAllResponds()
    {
        this._requestResponds.removeAllItems();
        this._channelResponds.removeAllItems();
    }


    _addRespondsFromSettings()
    {
        let resp = this._settings['responds'];
        if (resp !== undefined)
        {
            if (Array.isArray(resp))
            {
                for(let i = 0; i < resp.length; i++)
                {
                    this.addRespond(resp[i]);
                }
            }
            else if(typeof resp === 'object')
            {
                for(let k in resp)
                {
                    if(resp.hasOwnProperty(k))
                    {
                        this.addRespond(resp[k],k);
                    }
                }
            }
            else if(resp instanceof Respond)
            {
                this.addRespond(resp);
            }
        }
    }


    // noinspection JSUnusedGlobalSymbols
    addRespond(respond,key,overwrite = true)
    {
        if(respond instanceof RequestRespond)
        {
            this._requestResponds.addItem(respond,key,overwrite);
            return true;
        }
        else if(respond instanceof ChannelRespond)
        {
            this._channelResponds.addItem(respond,key,overwrite);
            return true;
        }
        else
        {
            return false;
        }
    }

    //Part Events

    on(event,reaction = () => {})
    {
        return new Promise((resolve) =>
        {
            if(typeof reaction === 'function')
            {
                this._events.push({event : event,reaction : (data) =>
                    {
                        reaction(data);
                        resolve(data);
                    }});
                return true;
            }
            else
            {
                return false;
            }
        });
    }

    _emitEvent(event,data)
    {
        for(let i = 0; i < this._events.length; i++)
        {
            if(this._events[i].event === event)
            {
                this._events[i].reaction(data);
            }
        }
    }

    //Part Auth


    isAuthIn()
    {
        return ZationTools._isAuthIn(this._currentUserAuthGroup);
    }

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

                if(this._debug)
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
    async authIn(respond, authData)
    {
        if(authData !== undefined)
        {
            this._authData = authData;
        }
        else
        {
            authData = this._authData;
        }

        let data = ZationTools._buildAuthRequestData(authData, this._system, this._version);
        await this._emitZationRequest(data,respond);
        return this.isAuthIn();
    }

    //Part trigger RequestResponds

    _triggerRequestResponds(result)
    {
        this._requestResponds.forEach((respond) =>
        {
            respond.trigger(result);
        });
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
            this._channelResponds.forEach((respond) =>
            {
                respond.trigger(
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
            this._channelResponds.forEach((respond) =>
            {
                respond.trigger(
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

    //Part Main Config

    _readServerSettings()
    {
        // noinspection JSUnresolvedVariable
        if(ZATION_SERVER_SETTINGS !== undefined)
        {
            // noinspection JSUnresolvedVariable
            let zss = ZATION_SERVER_SETTINGS;

            if(zss['HOSTNAME'] !== undefined)
            {
                this._hostname = zss['HOSTNAME'];
            }

            if(zss['PORT'] !== undefined)
            {
                this._port = zss['PORT'];
            }

            if(zss['SECURE'] !== undefined)
            {
                this._secure = zss['SECURE'];
            }

            if(zss['POST_KEY_WORD'] !== undefined)
            {
                this._postKeyWord = zss['POST_KEY_WORD'];
            }
        }
    }

    _readSettings()
    {
        if (this._settings.debug !== undefined) {
            this._debug = this._settings.debug;
        }

        if (this._settings['autoReAuth'] !== undefined) {
            this._autoReAuth = this._settings['autoReAuth'];
        }

        if (this._settings._userChannelAutoRegistration !== undefined) {
            this._userChannelAutoRegistration = this._settings._userChannelAutoRegistration;
        }

        if (this._settings._authGroupChannelAutoRegistration !== undefined) {
            this._authGroupChannelAutoRegistration = this._settings._authGroupChannelAutoRegistration;
        }

        if (this._settings._defaultGroupChannelAutoRegistration !== undefined) {
            this._defaultGroupChannelAutoRegistration = this._settings._defaultGroupChannelAutoRegistration;
        }

        if (this._settings._allChannelAutoRegistration !== undefined) {
            this._allChannelAutoRegistration = this._settings._allChannelAutoRegistration;
        }

        if (this._settings['system'] !== undefined) {
            this._system = this._settings['system'];
        }

        if (this._settings.version !== undefined) {
            this._version = this._settings.version;
        }

        if (this._settings.hostname !== undefined)
        {
            this._hostname = this._settings.hostname;
        }

        if (this._settings['authData'] !== undefined)
        {
            this._authData = this._settings['authData'] ;
        }

        if (this._settings.path !== undefined) {
            this._path = this._settings.path;
        }

        if (this._settings.port !== undefined) {
            this._port = this._settings.port;
        }

        if (this._settings._postKeyWord !== undefined) {
            this._postKeyWord = this._settings._postKeyWord;
        }

        if (this._settings.secure !== undefined) {
            this._secure = this._settings.secure;
        }

        if (this._settings.rejectUnauthorized !== undefined) {
            this._rejectUnauthorized = this._settings.rejectUnauthorized;
        }

    }

    // noinspection JSUnusedGlobalSymbols
    getRejectUnauthorized()
    {
        return this._rejectUnauthorized;
    }

    // noinspection JSUnusedGlobalSymbols
    getSystem()
    {
        return this._system;
    };

    // noinspection JSUnusedGlobalSymbols
    getVersion()
    {
        return this._version;
    };

    // noinspection JSUnusedGlobalSymbols
    getHostname()
    {
        return this._hostname;
    };

    // noinspection JSUnusedGlobalSymbols
    getPort()
    {
        return this._port;
    };

    // noinspection JSUnusedGlobalSymbols
    getSecure()
    {
        return this._secure;
    };

    // noinspection JSUnusedGlobalSymbols
    getServerAddress()
    {
        return this._hostname + ':' + this._settings.port;
    };

    // noinspection JSUnusedGlobalSymbols
    isAutoReAuth()
    {
        return this._autoReAuth;
    };

    // noinspection JSUnusedGlobalSymbols
    disableAutoReAuth()
    {
        this._autoReAuth = false;
    }

    // noinspection JSUnusedGlobalSymbols
    enableAutoReAuth()
    {
        this._autoReAuth = true;
    }

    //Part Connection

    // noinspection JSUnusedGlobalSymbols
    _refreshChannelRegistration()
    {
        this.registerAllChannel();
        this.registerDefaultGroupChannel();
        this.registerUserChannel();
        this.registerAuthGroupChannel();
    }

    _emitReady()
    {
        if(this._isFirstStart)
        {
            this._isFirstStart = false;
            this._emitEvent('ready',this._socket);
        }
    }

    _buildOptions()
    {
        let options =   {
            hostname: this._hostname,
            port: this._port,
            secure: this._secure,
            rejectUnauthorized: this._rejectUnauthorized,
            autoReconnect: true,
            authTokenName : this._authTokenName
        };

        if(this._path !== '')
        {
            options.path = this._path;
        }

        return options;
    }

    _buildConnection()
    {
        // noinspection JSUnresolvedVariable
        this._socket = SocketClusterClient.create(this._buildOptions());
        this._ConBackup = new ConBackup(this);

        this._socket.on('connect', async () => {

            this._emitEvent('connected',this._socket);

            if(this._reconnect)
            {
                await this._ConBackup.restoreBackup();
                this._reconnect = false;
            }
            else
            {
                if(this._allChannelAutoRegistration)
                {
                    this.registerAllChannel();
                }

                if(this._defaultGroupChannelAutoRegistration)
                {
                    this.registerDefaultGroupChannel();
                }

                if(this._autoStartAuth)
                {
                    this._socket.auth.loadToken(this._authTokenName,async (err,token) =>
                    {
                        if(token === undefined || token === null)
                        {
                            await this.authIn(this._authData);
                        }
                    });
                }
                else
                {
                    this._emitReady();
                }
            }
        });

        this._socket.on('authenticate',() => {

            this._emitEvent('authenticate',this._socket);
            this._updateAuthInfo(this._socket['authToken']);
            if(this._autoStartAuth)
            {
                this._emitReady();
            }

        });

        this._socket.on('deauthenticate',async () =>
        {
            this._socketIsAuthOut();
            if(!this._reconnect)
            {
                if(this._autoReAuth || this._isReAuth)
                {
                    this._isReAuth = false;

                    if(!this._isAuthOut)
                    {
                        await this.authIn();
                    }
                    else
                    {
                        this._isAuthOut = false;
                    }
                }
            }
        });

        this._socket.on('authTokenChange',() =>
        {
            this._updateAuthInfo(this._socket.authToken);
        });

        this._socket.on('zationBadAuthToken',async () =>
        {
            this._emitEvent('badAuthToken',this._socket);
        });

        this._socket.on('close',() =>
        {
            this._currentUserId =  undefined;
            this._currentUserAuthGroup = '';
            this._reconnect = true;
            this._emitEvent('close',{});
        });

        this._socket.on('connectAbort',() =>
        {
            this._emitEvent('connectAbort',this._socket);
        });

        this._socket.on('disconnect',() =>
        {
            this._emitEvent('disconnect',this._socket);
        });

        this._socket.on('kickOut',(message, channelName) =>
        {
            if(channelName.indexOf(ZationConst.CHANNEL_SPECIAL_CHANNEL_PREFIX) !== -1)
            {
                this._emitEvent('kickOutFromSpecialChannel',channelName);
            }
        });
    }

    async send(request,reaction)
    {
        let data = await ZationTools._buildRequestData(request, this._system, this._version);
        return await this._emitZationRequest(data,reaction);
    };

    _emitZationRequest(data,reaction)
    {
        return new Promise((resolve, reject)=>
        {
            this._socket.emit('zationRequest',data,(err,res) =>
            {
                if(res !== undefined)
                {
                    let result = new Result(res);

                    if(typeof reaction === 'function')
                    {
                        reaction(result);
                    }
                    else if(reaction instanceof RequestRespond)
                    {
                        reaction.trigger(result);
                    }

                    resolve(result);
                    this._triggerRequestResponds(result);
                }
                else
                {
                    let err = new Event('No Result!');
                    reject(err);
                }
            });
        });
    }

    _sendHttpZationRequest(data,reaction)
    {
        return new Promise((resolve, reject) =>
        {
            let request = new XMLHttpRequest();
            let sendObj = {};
            sendObj[this._postKeyWord] = data;

            request.addEventListener("load", () =>
            {
                if(request.status >= 200
                    && request.status < 300
                    && request.responseText !== '')
                {
                    let result = new Result(request.responseText);
                    if(typeof reaction === 'function')
                    {
                        reaction(result);
                    }
                    else if(reaction instanceof RequestRespond)
                    {
                        reaction.trigger(result);
                    }

                    resolve(result);
                    this._triggerRequestResponds(result);
                }
                else
                {
                    let err = new Event('No Result!');
                    reject(err);
                }
            });

            request.addEventListener("error", (e) => {reject(e);});

            request.open('POST',this._hostname + this._path + ':' + this._port, true);
            request.setRequestHeader("Content-type", "applization/x-www-form-urlencoded");
            request.send(sendObj);
        });
    }
}

module.exports = Zation;