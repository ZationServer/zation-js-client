/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {ChannelTarget}         from "./channelTarget";
import {ZationChannel}         from "../constants/internal";
import {Zation}                from "../../core/zation";
import {SubscribeFailedError}  from "../error/subscribeFailedError";
import {ChannelReactionBox}    from "../react/reactionBoxes/channelReactionBox";
import {PublishFailedError}    from "../error/publishFailedError";
import {TimeoutError}          from "../error/timeoutError";
import ConnectionUtils, {WaitForConnectionOption} from "../utils/connectionUtils";

export class ChannelEngine
{
    private readonly zation : Zation;

    constructor(zation : Zation)
    {
        this.zation = zation;
    }

    // noinspection JSUnusedGlobalSymbols
    async subUserChannel(userId : string | number,retrySubForever  : boolean = true) {
        await this.subZationChannel(ZationChannel.USER_CHANNEL_PREFIX + userId,ChannelTarget.USER,retrySubForever);
    }

    // noinspection JSUnusedGlobalSymbols
    hasSubUserChannel(userId : string | number) : boolean  {
        return this.hasSubChannel(ZationChannel.USER_CHANNEL_PREFIX + userId);
    }

    // noinspection JSUnusedGlobalSymbols
    unsubUserChannel(userId : string | number,andDestroy : boolean = true) {
       this.unsubChannel(ZationChannel.USER_CHANNEL_PREFIX + userId,andDestroy);
    }

    // noinspection JSUnusedGlobalSymbols
    async subAuthUserGroupChannel(authGroup : string,retrySubForever  : boolean = true) {
        await this.subZationChannel(ZationChannel.AUTH_USER_GROUP_PREFIX + authGroup,ChannelTarget.AUG,retrySubForever);
    }

    // noinspection JSUnusedGlobalSymbols
    hasSubAuthUserGroupChannel(authGroup : string) : boolean  {
        return this.hasSubChannel(ZationChannel.AUTH_USER_GROUP_PREFIX + authGroup);
    }

    // noinspection JSUnusedGlobalSymbols
    unsubAuthUserGroupChannel(authGroup : string,andDestroy : boolean = true) {
        this.unsubChannel(ZationChannel.AUTH_USER_GROUP_PREFIX + authGroup,andDestroy);
    }

    // noinspection JSUnusedGlobalSymbols
    async subDefaultUserGroupChannel(retrySubForever  : boolean = true) {
        await this.subZationChannel(ZationChannel.DEFAULT_USER_GROUP,ChannelTarget.DUG,retrySubForever);
    }

    // noinspection JSUnusedGlobalSymbols
    hasSubDefaultUserGroupChannel() : boolean {
        return this.hasSubChannel(ZationChannel.DEFAULT_USER_GROUP);
    }

    // noinspection JSUnusedGlobalSymbols
    unsubDefaultUserGroupChannel(andDestroy : boolean = true) {
        this.unsubChannel(ZationChannel.DEFAULT_USER_GROUP,andDestroy);
    }

    // noinspection JSUnusedGlobalSymbols
    async subAllChannel(retrySubForever  : boolean = true) {
        await this.subZationChannel(ZationChannel.ALL,ChannelTarget.ALL,retrySubForever);
    }

    // noinspection JSUnusedGlobalSymbols
    hasSubAllChannel() : boolean {
        return this.hasSubChannel(ZationChannel.ALL);
    }

    // noinspection JSUnusedGlobalSymbols
    unsubAllChannel(andDestroy : boolean = true) {
        this.unsubChannel(ZationChannel.ALL,andDestroy);
    }

    // noinspection JSUnusedGlobalSymbols
    async subPanelOutChannel(retrySubForever  : boolean =  true) {
        await this.subZationChannel(ZationChannel.PANEL_OUT,ChannelTarget.PANEL,retrySubForever);
    }

    // noinspection JSUnusedGlobalSymbols
    hasSubPanelOutChannel() : boolean {
        return this.hasSubChannel(ZationChannel.PANEL_OUT);
    }

    // noinspection JSUnusedGlobalSymbols
    unsubPanelOutChannel(andDestroy : boolean = true) {
        this.unsubChannel(ZationChannel.PANEL_OUT,andDestroy);
    }

    async subChannel(channel : string,chTarget : ChannelTarget,chInfoObj, watcher : Function,retrySubForever : boolean, subOptions ?: object) : Promise<void>
    {
        await new Promise<void>(((resolve, reject) => {
            const ch = this.zation.getSocket().channel(channel);

            if(retrySubForever){
                ch['retrySubForever'] = true;
            }

            //register
            ch.on('subscribe',() => {
                //watcher
                ch.watch(watcher);
                resolve();
            });

            ch.on('subscribeFail',async (err) => {
                reject(new SubscribeFailedError(err));
            });

            ch.on('kickOut',async (msg) => {
                await this.zation._getChannelReactionMainBox().forEachAll(async (chReactionBox : ChannelReactionBox) => {
                    await chReactionBox._triggerEvent(chReactionBox.mapKick,chTarget,chInfoObj,msg);
                });
            });

            ch.on('subscribeFail',async (err) => {
                await this.zation._getChannelReactionMainBox().forEachAll(async (chReactionBox : ChannelReactionBox) => {
                    await chReactionBox._triggerEvent(chReactionBox.mapSubFail,chTarget,chInfoObj,err);
                });
            });

            ch.on('subscribe',async () => {
                await this.zation._getChannelReactionMainBox().forEachAll(async (chReactionBox : ChannelReactionBox) => {
                    await chReactionBox._triggerEvent(chReactionBox.mapSub,chTarget,chInfoObj);
                });
            });

            ch.on('subscribe',async () => {
                await this.zation._getChannelReactionMainBox().forEachAll(async (chReactionBox : ChannelReactionBox) => {
                    await chReactionBox._triggerEvent(chReactionBox.mapSub,chTarget,chInfoObj);
                });
            });

            ch.on('unsubscribe',async (name,fromClient) => {
                if(fromClient) {
                    await this.zation._getChannelReactionMainBox().forEachAll(async (chReactionBox : ChannelReactionBox) => {
                        await chReactionBox._triggerEvent(chReactionBox.mapClientUnsub,chTarget,chInfoObj);
                    });
                }

                await this.zation._getChannelReactionMainBox().forEachAll(async (chReactionBox : ChannelReactionBox) => {
                    await chReactionBox._triggerEvent(chReactionBox.mapUnsub,chTarget,chInfoObj,fromClient);
                });
            });

            //sub
            ch.subscribe(subOptions);
        }));
    }


    async subZationChannel(channel : string, target : ChannelTarget,retrySubForever  : boolean) : Promise<void>
    {
       const infoObj = {};
       await this.subChannel(channel,target,infoObj,async (input : any) =>
       {
           if(typeof input === 'object') {

               const event : string = input['e'];
               const data : any = input['d'];
               const ssid : string | undefined = input['ssi'];

               const promises : Promise<void>[] = [];
               promises.push(this.zation._getChannelReactionMainBox().forEachAll(async (channelReactionBox : ChannelReactionBox) => {
                   await channelReactionBox._triggerPub(target,event,data,infoObj,ssid);
               }));

               promises.push(this.zation._getChannelReactionMainBox().forEachAll(async (channelReactionBox : ChannelReactionBox) => {
                   await channelReactionBox._triggerPub(ChannelTarget.ANY,event,data,{chFullName : channel},ssid);
               }));
               await Promise.all(promises);
           }
       },retrySubForever);
    }

    unsubChannel(channel : string,andDestroy : boolean = true) : void
    {
        const socket = this.zation.getSocket();
        if(!!socket) {
            if(andDestroy) {
                socket.destroyChannel(channel);
            }
            else {
                socket.unsubscribe(channel);
                socket.unwatch(channel);
            }
        }
    }

    hasSubChannel(channel) : boolean
    {
        const socket : any = this.zation.getSocket();
        return !!(!!socket && socket.isSubscribed(channel));
    }

    //Part Custom Channel
    // noinspection JSUnusedGlobalSymbols
    async subCustomCh(name : string, id ?: string,retrySubForever  : boolean = true) : Promise<void>
    {
        let chFullName = ZationChannel.CUSTOM_CHANNEL_PREFIX + name;
        if(id !== undefined){
            chFullName +=  ZationChannel.CUSTOM_CHANNEL_ID_SEPARATOR + id
        }

        const infoObj = {name,id};
        await this.subChannel
        (
            chFullName, ChannelTarget.C, infoObj,
            async (input : any) => {
                if(typeof input === 'object') {

                    const event : string = input['e'];
                    const data : any = input['d'];
                    const ssid : string | undefined = input['ssi'];

                    await this.zation._getChannelReactionMainBox().forEachAll(async (channelReactionBox : ChannelReactionBox) => {
                        await channelReactionBox._triggerPub
                        (
                            ChannelTarget.C,
                            event,
                            data,
                            infoObj,
                            ssid
                        );
                    });

                    await this.zation._getChannelReactionMainBox().forEachAll(async (channelReactionBox : ChannelReactionBox) => {
                        await channelReactionBox._triggerPub(ChannelTarget.ANY,event,data,{chFullName : chFullName},ssid);
                    });
                }
        },retrySubForever);
    }

    // noinspection JSUnusedGlobalSymbols
    static getCustomChName(name ?: string, id ?: string) : string {
        if(name !== undefined) {
            if(id !== undefined){
                return ZationChannel.CUSTOM_CHANNEL_PREFIX + name +
                    ZationChannel.CUSTOM_CHANNEL_ID_SEPARATOR + id;
            }
            else {
                return ZationChannel.CUSTOM_CHANNEL_PREFIX + name;
            }
        }
        else {
            return ZationChannel.CUSTOM_CHANNEL_PREFIX;
        }
    }

    // noinspection JSUnusedGlobalSymbols
    unsubscribeCustomCh(name ?: string,id ?: string,andDestroy : boolean = true) : string[] {
        return this.unsubscribeWithIndex(ChannelEngine.getCustomChName(name,id),andDestroy);
    }

    getSubCustomCh(name ?: string,id ?: string) : string[] {
        return this.getSubsWithIndex(ChannelEngine.getCustomChName(name,id));
    }

    // noinspection JSUnusedGlobalSymbols
    hasSubCustomCh(name ?: string,id ?: string) : boolean {
        return this.getSubCustomCh(name,id).length > 0;
    }

    // noinspection JSUnusedGlobalSymbols
    unsubscribeWithIndex(channelName : string, andDestroy : boolean) : string[]
    {
        const socket = this.zation.getSocket();
        let unsubscribedChannels : string[] = [];
        if(!!socket) {
            const subs = socket.subscriptions(false);
            for(let i = 0; i < subs.length; i++) {
                if(subs[i].indexOf(channelName) !== -1) {
                    this.unsubChannel(subs[i],andDestroy);
                    unsubscribedChannels.push(subs[i]);
                }
            }
        }
        return unsubscribedChannels;
    }

    getSubsWithIndex(channelName : string) : string[]
    {
        const socket = this.zation.getSocket();
        let foundSubs : string[] = [];
        if(!!socket) {
            const subs = socket.subscriptions(false);
            for(let i = 0; i < subs.length; i++) {
                if(subs[i].indexOf(channelName) !== -1) {
                    foundSubs.push(subs[i]);
                }
            }
        }
        return foundSubs;
    }

    static buildPubData(eventName : string,data : any) : object
    {
        return {
            e : eventName,
            d : data
        };
    }

    async publish(channelName : string,eventName : string,data : any,waitForConnection : WaitForConnectionOption) : Promise<void>
    {
        await ConnectionUtils.checkConnection
        (this.zation,waitForConnection,'To publish data.');

        return new Promise<void>(async (resolve, reject) => {
            this.zation.getSocket().publish(channelName,ChannelEngine.buildPubData(eventName,data),(err) =>
            {
                if(err){
                    if(err.name === 'TimeoutError'){
                        reject(new TimeoutError(err.message));
                    }
                    else {
                        reject(new PublishFailedError(err));
                    }
                }
                else{
                    resolve();
                }
            });
        });
    }

    pubUserCh(userId : string | number,event : string, data : any,waitForConnection : WaitForConnectionOption) : Promise<void> {
        return this.publish(ZationChannel.USER_CHANNEL_PREFIX + userId,event,data,waitForConnection);
    }

    pubAuthUserGroupCh(authUserGroup : string,event : string, data : any,waitForConnection : WaitForConnectionOption) : Promise<void> {
        return this.publish(ZationChannel.AUTH_USER_GROUP_PREFIX + authUserGroup,event,data,waitForConnection);
    }

    pubDefaultUserGroupCh(event : string, data : any,waitForConnection : WaitForConnectionOption) : Promise<void> {
        return this.publish(ZationChannel.DEFAULT_USER_GROUP,event,data,waitForConnection);
    }

    pubAllCh(event : string, data : any,waitForConnection : WaitForConnectionOption) : Promise<void> {
        return this.publish(ZationChannel.ALL,event,data,waitForConnection);
    }

    pubPanelInCh(event : string, data : any,waitForConnection : WaitForConnectionOption) : Promise<void> {
        return this.publish(ZationChannel.PANEL_IN,event,data,waitForConnection);
    }

    pubCustomCh({name,id} : {name : string,id ?: string},event : string, data : any,
                      waitForConnection : WaitForConnectionOption) : Promise<void>
    {
        return this.publish(ChannelEngine.getCustomChName(name,id),event,data,waitForConnection);
    }
}