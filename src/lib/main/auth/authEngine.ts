/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {ZationToken}                   from "../constants/internal";
import {Zation}                        from "../../core/zation";
import {ChannelEngine}                 from "../channel/channelEngine";
import {SignAuthenticationFailedError} from "../error/signAuthenticationFailedError";
import {DeauthenticationFailedError}   from "../error/deauthenticationFailedError";
import {Logger}                        from "../logger/logger";
import {UserIdRequiredError}           from "../error/userIdRequiredError";
import {AuthUserGroupRequiredError}    from "../error/authUserGroupRequiredError";
import {DeauthenticationRequiredError} from "../error/deauthenticationRequiredError";
import {AuthenticationRequiredError}   from "../error/authenticationRequiredError";
import {Socket}                        from "../sc/socket";
import {TimeoutError}                             from "../error/timeoutError.js";
import ConnectionUtils, {WaitForConnectionOption} from "../utils/connectionUtils";

export class AuthEngine
{
    private currentUserId : number | string | undefined = undefined;
    private currentUserAuthGroup : string | undefined = undefined;

    private signToken : string | null = null;
    private plainToken : ZationToken | null = null;

    private readonly zation : Zation;
    private readonly chEngine : ChannelEngine;

    constructor(zation : Zation,channelEngine : ChannelEngine)
    {
        this.zation = zation;
        this.chEngine = channelEngine;

        this.currentUserId = undefined;
        this.currentUserAuthGroup = undefined;
    }

    connectToSocket(socket : Socket)
    {
        //reset on disconnection
        socket.on('close',()=> {
            this.currentUserId = undefined;
            this.currentUserAuthGroup = undefined;
        });

        socket.on('authenticate',async ()=> {
            const authToken = this.zation.getSocket().getAuthToken();
            const signToken = this.zation.getSocket().getSignedAuthToken();

            //try because they can be an subscription error
            try {
                await this.refreshToken(authToken, signToken);
            }
            catch (e) {}
        });

        socket.on('connect',async (state) =>{
            if(!state.isAuthenticated && this.zation.getSocket().getSignedAuthToken() !== this.signToken &&
            this.signToken !== null) {
                try{await this.zation.signAuthenticate(this.signToken);}
                catch (e) {}
            }
        });

        //update token on change
        socket.on('deauthenticate',async ()=> {
            await this.refreshToken(null,null);
        });
    }


    async refreshToken(plainToken : null | ZationToken,signToken : null | string)
    {
        this.plainToken = plainToken;
        this.signToken = signToken;
        await this.updateToken(plainToken);
    }

    signAuthenticate(signToken : string,waitForConnection : WaitForConnectionOption) : Promise<void>
    {
        return new Promise<void>(async (resolve, reject) => {

            await ConnectionUtils.checkConnection
            (this.zation,waitForConnection,'To authenticate with sign token.');

            this.zation.getSocket().authenticate(signToken,(err,authState)=>
            {
                if(err){
                    if(err.name === 'TimeoutError'){
                        reject(new TimeoutError(err.message));
                    }
                    else {
                        reject(new SignAuthenticationFailedError(err));
                    }
                }
                else if(authState.authError){
                    reject(new SignAuthenticationFailedError(authState.authError));
                }
                else {
                    resolve();
                }
            });
        });
    }

    deauthenticate() : Promise<void> {
        return new Promise<void>(async (resolve, reject) =>
        {
            this.zation.getSocket().deauthenticate((e => {
                if(e){
                    reject(new DeauthenticationFailedError(e));
                } else {
                    resolve();
                }}));
        });
    }

    async updateUserId(id)
    {
        //check if id is changed
        if (this.currentUserId !== id) {
            //unregsiter old user channel
            if(!!this.currentUserId) {
                this.chEngine.unsubUserChannel(this.currentUserId);
            }

            this.currentUserId = id;

            //register new user channel
            if(this.zation.isAutoUserChSub() && !!id) {
                await this.subUserCh();
            }
        }
    }

    async updateAuthGroup(authGroup)
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

                if(this.zation.isAutoAuthUserGroupChSub()) {
                    await this.subAuthUserGroupCh();
                }
            }
            else {
                //unregister old channels
                if(!!this.currentUserAuthGroup) {
                    this.chEngine.unsubAuthUserGroupChannel(this.currentUserAuthGroup);
                }

                this.currentUserAuthGroup = authGroup;

                if(this.zation.isAutoDefaultUserGroupChSub()) {
                    await this.subDefaultUserGroupCh();
                }
            }
        }
    }

    async subUserCh() : Promise<void>
    {
        if(!!this.currentUserId) {
            await this.chEngine.subUserChannel(this.currentUserId);
        }
        else{
            throw new UserIdRequiredError('To subscribe user channel.');
        }
    }

    hasSubUserCh() : boolean
    {
        if(!!this.currentUserId) {
            return this.chEngine.hasSubUserChannel(this.currentUserId);
        }
        else{
            throw new UserIdRequiredError('To check if socket is subscribe user channel.');
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
            throw new AuthUserGroupRequiredError('To subscribe the auth user group channel.');
        }
    }

    hasSubAuthUserGroupCh() : boolean {
        if(!!this.currentUserAuthGroup) {
            return this.chEngine.hasSubAuthUserGroupChannel(this.currentUserAuthGroup);
        }
        else{
            throw new AuthUserGroupRequiredError('To check if socket is subscribe the auth user group channel.');
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
            throw new DeauthenticationRequiredError('To subscribe the default user group channel');
        }
    }

    unsubDefaultUserGroupCh(andDestroy : boolean) : void {
        this.chEngine.unsubDefaultUserGroupChannel(andDestroy);
    }

    async updateToken(token : ZationToken | null) {
        if(token === null) {token = {};}
        let promises : Promise<void>[] = [];
        promises.push(this.updateAuthGroup(token.zationAuthUserGroup));
        promises.push(this.updateUserId(token.zationUserId));

        //id and group is allready set
        if(this.zation.isDebug() && this.isAuthenticated()) {
            Logger.printInfo
            (`User is authenticated with userId: '${this.currentUserId}' and auth user group: '${this.currentUserAuthGroup}'.`)
        }
        await Promise.all(promises);
    }

    getSignToken() : string | null {
        return this.signToken;
    }

    // noinspection JSUnusedGlobalSymbols
    getPlainToken() : ZationToken | null {
        return this.plainToken;
    }

    getSecureSignToken() : string {
        if(this.signToken !== null) {
            return this.signToken;
        }
        else {
            throw new AuthenticationRequiredError('To get access to the token');
        }
    }

    getSecurePlainToken() : ZationToken {
        if(this.plainToken !== null) {
            return this.plainToken;
        }
        else {
            throw new AuthenticationRequiredError('To get access to the token');
        }
    }

    hasSignToken() : boolean {
        return this.signToken !== null;
    }

    // noinspection JSUnusedGlobalSymbols
    hasPlainToken() : boolean {
        return this.plainToken !== null;
    }

    isAuthenticated() : boolean {
        return this.currentUserAuthGroup !== undefined;
    }

    getCustomTokenVariable() : object
    {
        if(this.plainToken !== null) {
            return typeof this.plainToken.zationCustomVariables === 'object' ?
                this.plainToken.zationCustomVariables : {};
        }
        else {
            throw new AuthenticationRequiredError('To get access to token variables');
        }
    }

    getAuthUserGroup() : string | undefined
    {
        return this.currentUserAuthGroup;
    }

    getUserId() : number | string | undefined
    {
        return this.currentUserId;
    }

}


