/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {ZationToken}                   from "../constants/internal";
import {ZationClient}                  from "../../core/zationClient";
import {SignAuthenticationFailedError} from "../error/signAuthenticationFailedError";
import {DeauthenticationFailedError}   from "../error/deauthenticationFailedError";
import {Logger}                        from "../logger/logger";
import {AuthenticationRequiredError}   from "../error/authenticationRequiredError";
import {Socket}                        from "../sc/socket";
import {TimeoutError}                  from "../error/timeoutError";
import ConnectionUtils, {ConnectTimeoutOption} from "../utils/connectionUtils";

export class AuthEngine
{
    private currentUserId: number | string | undefined = undefined;
    private currentUserAuthGroup: string | undefined = undefined;

    private signToken: string | null = null;
    private plainToken: ZationToken | null = null;

    private readonly client: ZationClient;

    constructor(client: ZationClient)
    {
        this.client = client;

        this.currentUserId = undefined;
        this.currentUserAuthGroup = undefined;
    }

    connectToSocket(socket: Socket)
    {
        //reset on disconnection
        socket.on('close',()=> {
            this.currentUserId = undefined;
            this.currentUserAuthGroup = undefined;
        });

        socket.on('authenticate',()=> {
            const authToken = socket.getAuthToken();
            const signToken = socket.getSignedAuthToken();

            //try because they can be an subscription error
            try {
                this.refreshToken(authToken, signToken);
            }
            catch (e) {}
        });

        socket.on('connect',async (state) =>{
            if(!state.isAuthenticated && socket.getSignedAuthToken() !== this.signToken &&
            this.signToken !== null) {
                try{await this.client.signAuthenticate(this.signToken);}
                catch (e) {}
            }
        });

        //update token on change
        socket.on('deauthenticate',async ()=> {
            this.refreshToken(null,null);
        });
    }


    refreshToken(plainToken: null | ZationToken,signToken: null | string)
    {
        this.plainToken = plainToken;
        this.signToken = signToken;
        this.updateToken(plainToken);
    }

    async signAuthenticate(signToken: string,connectTimeout: ConnectTimeoutOption): Promise<void>
    {
        await ConnectionUtils.checkConnection(this.client,connectTimeout);

        return new Promise<void>(async (resolve, reject) => {
            this.client.socket.authenticate(signToken,(err,authState)=>
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

    deauthenticate(): Promise<void> {
        return new Promise<void>(async (resolve, reject) =>
        {
            this.client.socket.deauthenticate((e => {
                if(e){
                    reject(new DeauthenticationFailedError(e));
                } else {
                    resolve();
                }}));
        });
    }

    updateToken(token: ZationToken | null) {
        if(token === null) {token = {};}
        this.currentUserAuthGroup = token.authUserGroup;
        this.currentUserId = token.userId;

        //id and group is allready set
        if(this.client.isDebug() && this.isAuthenticated()) {
            Logger.printInfo
            (`User is authenticated with userId: '${this.currentUserId}' and auth user group: '${this.currentUserAuthGroup}'.`)
        }
    }

    getSignToken(): string | null {
        return this.signToken;
    }

    // noinspection JSUnusedGlobalSymbols
    getPlainToken(): ZationToken | null {
        return this.plainToken;
    }

    getSecurePlainToken(): ZationToken {
        if(this.plainToken !== null) {
            return this.plainToken;
        }
        else {
            throw new AuthenticationRequiredError('To get access to the token');
        }
    }

    hasSignToken(): boolean {
        return this.signToken !== null;
    }

    // noinspection JSUnusedGlobalSymbols
    hasPlainToken(): boolean {
        return this.plainToken !== null;
    }

    isAuthenticated(): boolean {
        return this.currentUserAuthGroup !== undefined;
    }

    getTokenVariables(): object
    {
        if(this.plainToken !== null) {
            return typeof this.plainToken.variables === 'object' ?
                this.plainToken.variables: {};
        }
        else {
            throw new AuthenticationRequiredError('To get access to token variables');
        }
    }

    getAuthUserGroup(): string | undefined {
        return this.currentUserAuthGroup;
    }

    getUserId(): number | string | undefined {
        return this.currentUserId;
    }
}