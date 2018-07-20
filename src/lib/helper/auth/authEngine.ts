/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import Zation         = require("../../api/zation");
import Response       = require("../../api/response");
import AuthRequest    = require("../../api/authRequest");
import {ProtocolType}   from "../constants/protocolType";
import ChannelEngine  = require("../channel/channelEngine");
import Logger         = require("../Logger/logger");
import Const          = require("../constants/constWrapper");

class AuthEngine
{
    private currentUserId : number | string | undefined = undefined;
    private currentUserAuthGroup : string | undefined = undefined;

    private signToken : string | undefined = undefined;
    private plainToken : object | undefined = undefined;

    private readonly zation : Zation;
    private readonly chEngine : ChannelEngine;

    private authData : object;

    constructor(zation : Zation,channelEngine : ChannelEngine)
    {
        this.zation = zation;
        this.chEngine = channelEngine;

        this.currentUserId = undefined;
        this.currentUserAuthGroup = undefined;

        //reset on disconnection
        this.zation.getSocket().on('close',()=>
        {
           this.currentUserId = undefined;
           this.currentUserAuthGroup = undefined;
        });

        //reset on disconnection
        this.zation.getSocket().on('authenticate',()=>
        {
            const authToken = this.zation.getSocket().getAuthToken();
            const signToken = this.zation.getSocket().getSignedAuthToken();
            this.refreshToken(authToken,signToken);
        });

        //update token on change
        this.zation.getSocket().on('deauthenticate',()=>
        {
            this.refreshToken(undefined,undefined);
        });
    }

    refreshToken(plainToken : undefined | object,signToken : undefined | string)
    {
        this.plainToken = plainToken;
        this.signToken = signToken;
        this.updateToken(plainToken);
    }

    async authIn(authData ?: object,protocolType : ProtocolType = ProtocolType.WebSocket) : Promise<Response>
    {
        let loginData = {};
        if(authData !== undefined) {
            loginData = authData;
            this.authData = authData;
        }
        else if(this.authData !== undefined) {
            loginData = this.authData;
        }

        const authReq = new AuthRequest(loginData,protocolType);
        return await this.zation.send(authReq)
    }

    updateUserId(id)
    {
        //check if id is changed
        if (this.currentUserId !== id) {
            //unregsiter old user channel
            if(!!this.currentUserId) {
                this.chEngine.unregisterUserChannel(this.currentUserId);
            }

            this.currentUserId = id;

            //register new user channel
            if(!!id) {
                this.chEngine.registerUserChannel(id);
            }
        }
    }

    updateAuthGroup(authGroup)
    {
        //check authGroup changed
        if (this.currentUserAuthGroup !== authGroup)
        {
            //checkIs really authGroup
            if (!!authGroup)
            {
                //unregister old channels
                if(!!this.currentUserAuthGroup) {
                    this.chEngine.unregisterAuthGroupChannel(this.currentUserAuthGroup);
                }
                else {
                    this.chEngine.unregisterDefaultGroupChannel();
                }

                this.currentUserAuthGroup = authGroup;

                this.chEngine.registerAuthGroupChannel(authGroup);


                if(this.zation.isDebug())
                {
                    Logger.printInfo
                    (`User is Login with userId: '${this.currentUserId}' in user group: '${this.currentUserAuthGroup}'.`)
                }
            }
            else {
                //unregister old channels
                if(!!this.currentUserAuthGroup) {
                    this.chEngine.unregisterAuthGroupChannel(this.currentUserAuthGroup);
                }

                this.currentUserAuthGroup = authGroup;
                this.chEngine.registerDefaultGroupChannel();
            }
        }
    }

    updateToken(token : object = {})
    {
        this.updateUserId(token[Const.Settings.CLIENT.USER_ID]);
        this.updateAuthGroup(token[Const.Settings.CLIENT.AUTH_USER_GROUP]);
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

    isAuthIn() : boolean
    {
        return this.currentUserAuthGroup !== undefined;
    }

}

export = AuthEngine;

