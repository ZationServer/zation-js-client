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
import Const              = require("../constants/constWrapper");
import MissingUserIdError = require("../error/missingUserIdError");
import MissingAuthUserGroupError   = require("../error/missingAuthUserGroupError");
import NotAuthenticatedNeededError = require("../error/NotAuthenticatedNeededError");

class AuthEngine
{
    private currentUserId : number | string | undefined = undefined;
    private currentUserAuthGroup : string | undefined = undefined;

    private signToken : string | null = null;
    private plainToken : object | null = null;

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
        this.zation.getSocket().on('close',()=> {
            this.currentUserId = undefined;
            this.currentUserAuthGroup = undefined;
        });

        //reset on disconnection
        this.zation.getSocket().on('authenticate',()=> {
            const authToken = this.zation.getSocket().getAuthToken();
            const signToken = this.zation.getSocket().getSignedAuthToken();
            this.refreshToken(authToken,signToken);
        });

        //update token on change
        this.zation.getSocket().on('deauthenticate',()=> {
            this.refreshToken(null,null);
        });
    }


    refreshToken(plainToken : null | object,signToken : null | string)
    {
        this.plainToken = plainToken;
        this.signToken = signToken;
        this.updateToken(plainToken);
    }

    async authenticate(authData ?: object, protocolType : ProtocolType = ProtocolType.WebSocket) : Promise<Response>
    {
        let loginData = {};
        if(typeof authData === 'object') {
            loginData = authData;
            this.authData = authData;
        }
        else if(typeof this.authData === 'object') {
            loginData = this.authData;
        }

        const authReq = new AuthRequest(loginData,protocolType);
        return await this.zation.send(authReq)
    }

    deauthenticate() : Promise<void> {
        return new Promise<void>((resolve, reject) =>
        {
            this.zation.getSocket().deauthenticate((e => {
                if(e){
                    reject(e);
                } else {
                    resolve();
                }
            }));
        });
    }

    updateUserId(id)
    {
        //check if id is changed
        if (this.currentUserId !== id) {
            //unregsiter old user channel
            if(!!this.currentUserId) {
                this.chEngine.unsubUserChannel(this.currentUserId);
            }

            this.currentUserId = id;

            //register new user channel
            if(this.zation.isAutoUserChSub()) {
                this.subUserCh();
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
                    this.chEngine.unsubAuthUserGroupChannel(this.currentUserAuthGroup);
                }
                else {
                    this.chEngine.unsubDefaultUserGroupChannel();
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
                    this.chEngine.unsubAuthUserGroupChannel(this.currentUserAuthGroup);
                }

                this.currentUserAuthGroup = authGroup;
                this.subDefaultUserGroupCh();
            }
        }
    }

    async subUserCh() : Promise<void>
    {
        if(!!this.currentUserId) {
            await this.chEngine.subUserChannel(this.currentUserId);
        }
        else{
            throw new MissingUserIdError('To subscribe user channel.');
        }
    }

    isSubUserCh() : boolean
    {
        if(!!this.currentUserId) {
            return this.chEngine.isSubUserChannel(this.currentUserId)
        }
        else{
            throw new MissingUserIdError('To check if socket is subscribe user channel.');
        }
    }

    unsubUserCh(andDestroy : boolean) : void
    {
        if(!!this.currentUserId) {
            this.chEngine.unsubUserChannel(this.currentUserId,andDestroy);
        }
    }

    async subAuthUserGroupCh() : Promise<void> {
        if(!!this.currentUserAuthGroup) {
            await this.chEngine.subAuthUserGroupChannel(this.currentUserAuthGroup);
        }
        else{
            throw new MissingAuthUserGroupError('To subscribe the auth user group channel.');
        }
    }

    isSubAuthUserGroupCh() : boolean {
        if(!!this.currentUserAuthGroup) {
            return this.chEngine.isSubAuthUserGroupChannel(this.currentUserAuthGroup);
        }
        else{
            throw new MissingAuthUserGroupError('To check if socket is subscribe the auth user group channel.');
        }
    }

    unsubAuthUserGroupCh(andDestroy : boolean) : void {
        if(!!this.currentUserAuthGroup) {
            this.chEngine.unsubAuthUserGroupChannel(this.currentUserAuthGroup,andDestroy);
        }
    }

    async subDefaultUserGroupCh() : Promise<void> {
        if(!this.currentUserAuthGroup) {
            await this.chEngine.subDefaultUserGroupChannel();
        }
        else{
            throw new NotAuthenticatedNeededError('To subscribe the default user group channel');
        }
    }

    unsubDefaultUserGroupCh(andDestroy : boolean) : void {
        this.chEngine.unsubDefaultUserGroupChannel(andDestroy);
    }

    updateToken(token : object = {}) {
        this.updateUserId(token[Const.Settings.CLIENT.USER_ID]);
        this.updateAuthGroup(token[Const.Settings.CLIENT.AUTH_USER_GROUP]);
    }

    getSignToken() : string | null {
        return this.signToken;
    }

    getPlainToken() : object | null {
        return this.plainToken;
    }

    hasSignToken() : boolean {
        return this.signToken !== null;
    }

    isAuthIn() : boolean {
        return this.currentUserAuthGroup !== undefined;
    }

}

export = AuthEngine;

