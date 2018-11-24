/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {ZationToken}                   from "../constants/internal";
import {Zation}                        from "../../api/zation";
import {ChannelEngine}                 from "../channel/channelEngine";
import {SignAuthenticationFailedError} from "../error/signAuthenticationFailedError";
import {ConnectionNeededError}         from "../error/connectionNeededError";
import {DeauthenticationFailedError}   from "../error/deauthenticationFailedError";
import {Logger}                        from "../logger/logger";
import {MissingUserIdError}            from "../error/missingUserIdError";
import {MissingAuthUserGroupError}     from "../error/missingAuthUserGroupError";
import {DeauthenticationNeededError}   from "../error/deauthenticationNeededError";
import {AuthenticationNeededError}     from "../error/authenticationNeededError";

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

    initAuthEngine()
    {
        //we have an socket!

        //reset on disconnection
        this.zation.getSocket().on('close',()=> {
            this.currentUserId = undefined;
            this.currentUserAuthGroup = undefined;
        });

        this.zation.getSocket().on('authenticate',async ()=> {
            const authToken = this.zation.getSocket().getAuthToken();
            const signToken = this.zation.getSocket().getSignedAuthToken();

            //try because they can be an subscribion error
            try {
                await this.refreshToken(authToken, signToken);
            }
            catch (e) {}
        });

        this.zation.getSocket().on('connect',async () =>{
            if(this.zation.getSocket().getSignedAuthToken() !== this.signToken &&
            this.signToken !== null) {
                try{await this.zation.signAuthenticate(this.signToken);}
                catch (e) {}
            }
        });

        //update token on change
        this.zation.getSocket().on('deauthenticate',async ()=> {
            await this.refreshToken(null,null);
        });
    }


    async refreshToken(plainToken : null | ZationToken,signToken : null | string)
    {
        this.plainToken = plainToken;
        this.signToken = signToken;
        await this.updateToken(plainToken);
    }

    signAuthenticate(signToken : string) : Promise<void>
    {
        return new Promise<void>((resolve, reject) => {
            if(this.zation.isSocketConnected()) {
                this.zation.getSocket().authenticate(signToken,(err,authState)=>
                {
                    if(err){
                        reject(new SignAuthenticationFailedError(err));
                    }
                    else if(authState.authError){
                        reject(new SignAuthenticationFailedError(authState.authError));
                    }
                    else {
                        resolve();
                    }
                });
            }
            else {
                reject(new ConnectionNeededError('To authenticate with sign token!'));
            }
        });
    }

    deauthenticate() : Promise<void> {
        return new Promise<void>(async (resolve, reject) =>
        {
            if(this.zation.hasSocket())
            {
                this.zation.getSocket().deauthenticate((e => {
                    if(e){
                        reject(new DeauthenticationFailedError(e));
                    } else {
                        resolve();
                    }}));
            }
            else {
                await this.refreshToken(null,null);
            }
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
            throw new DeauthenticationNeededError('To subscribe the default user group channel');
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
            throw new AuthenticationNeededError('To get access to token');
        }
    }

    getSecurePlainToken() : ZationToken {
        if(this.plainToken !== null) {
            return this.plainToken;
        }
        else {
            throw new AuthenticationNeededError('To get access to token');
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
            throw new AuthenticationNeededError('To get access to customTokenVar');
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


