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
import MissingUserIdError = require("../error/missingUserIdError");
import MissingAuthUserGroupError = require("../error/missingAuthUserGroupError");
import NotAuthenticatedNeededError = require("../error/NotAuthenticatedNeededError");

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

        /*
        this.zation.('firstConnection', () =>
        {

        });
        */
    }

    initAuthEngine()
    {
        //we have an socket!
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
            if(this.zation.isAutoUserChSub()) {
                this.subUserCh();
            }
        }
    }

    async subUserCh() : Promise<void>
    {
        if(!!this.currentUserId) {
            await this.chEngine.registerUserChannel(this.currentUserId);
        }
        else{
            throw new MissingUserIdError('To subscribe an user channel.');
        }
    }

    unsubUserCh() : void
    {
        if(!!this.currentUserId) {
            this.chEngine.unregisterUserChannel(this.currentUserId);
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
                    this.chEngine.unregisterAuthUserGroupChannel(this.currentUserAuthGroup);
                }
                else {
                    this.chEngine.unregisterDefaultUserGroupChannel();
                }

                this.currentUserAuthGroup = authGroup;

                this.subAuthUserGroupCh();

                if(this.zation.isDebug())
                {
                    Logger.printInfo
                    (`User is Login with userId: '${this.currentUserId}' in user group: '${this.currentUserAuthGroup}'.`)
                }
            }
            else {
                //unregister old channels
                if(!!this.currentUserAuthGroup) {
                    this.chEngine.unregisterAuthUserGroupChannel(this.currentUserAuthGroup);
                }

                this.currentUserAuthGroup = authGroup;
                this.subDefaultUserGroupCh();
            }
        }
    }

    async subAuthUserGroupCh() : Promise<void>
    {
        if(!!this.currentUserAuthGroup) {
            await this.chEngine.registerAuthUserGroupChannel(this.currentUserAuthGroup);
        }
        else{
            throw new MissingAuthUserGroupError('To subscribe the auth user group channel.');
        }
    }

    unsubAuthUserGroupCh() : void
    {
        if(!!this.currentUserAuthGroup) {
            this.chEngine.unregisterAuthUserGroupChannel(this.currentUserAuthGroup);
        }
    }

    async subDefaultUserGroupCh() : Promise<void>
    {
        if(!this.currentUserAuthGroup) {
            await this.chEngine.registerDefaultUserGroupChannel();
        }
        else{
            throw new NotAuthenticatedNeededError('To subscribe the default user group channel');
        }
    }

    unsubDefaultUserGroupCh() : void
    {
        this.chEngine.unregisterDefaultUserGroupChannel();
    }

    updateToken(token : object = {})
    {
        this.updateUserId(token[Const.Settings.CLIENT.USER_ID]);
        this.updateAuthGroup(token[Const.Settings.CLIENT.AUTH_USER_GROUP]);
    }

    getSignToken() : string | undefined {
        return this.signToken;
    }

    getPlainToken() : object | undefined {
        return this.plainToken;
    }

    hasSignToken() : boolean {
        return this.signToken !== undefined;
    }

    isAuthIn() : boolean
    {
        return this.currentUserAuthGroup !== undefined;
    }

}

export = AuthEngine;

