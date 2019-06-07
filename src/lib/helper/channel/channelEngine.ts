/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {ChannelTarget}         from "./channelTarget";
import {ZationChannel}         from "../constants/internal";
import {Zation}                from "../../mainApi/zation";
import {SubscribeFailedError}  from "../error/subscribeFailedError";
import {ChannelReactionBox}    from "../../react/reactionBoxes/channelReactionBox";
import {PublishFailedError}    from "../error/publishFailedError";
import {ConnectionNeededError} from "../error/connectionNeededError";

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
    async subCustomCh(channel : string,retrySubForever  : boolean) : Promise<void>
    {
        const infoObj = {chName : channel};
        const chFullName = ZationChannel.CUSTOM_CHANNEL_PREFIX + channel;
        await this.subChannel(chFullName,ChannelTarget.C, infoObj,
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
    async subCustomIdCh(channel : string, id : string,retrySubForever  : boolean) : Promise<void>
    {
        const chFullName = ZationChannel.CUSTOM_ID_CHANNEL_PREFIX + channel + ZationChannel.CUSTOM_CHANNEL_ID + id;
        const infoObj = {chName : channel,chId : id};
        await this.subChannel
        (
            chFullName, ChannelTarget.CID, infoObj,
            async (input : any) => {
                if(typeof input === 'object') {

                    const event : string = input['e'];
                    const data : any = input['d'];
                    const ssid : string | undefined = input['ssi'];

                    await this.zation._getChannelReactionMainBox().forEachAll(async (channelReactionBox : ChannelReactionBox) => {
                        await channelReactionBox._triggerPub
                        (
                            ChannelTarget.CID,
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
    static getCustomIdChName(channel : string | undefined, id : string = '') : string
    {
        if(name !== undefined) {
            return ZationChannel.CUSTOM_ID_CHANNEL_PREFIX + name
                + ZationChannel.CUSTOM_CHANNEL_ID + id;
        }
        else {
            return ZationChannel.CUSTOM_ID_CHANNEL_PREFIX;
        }
    }

    // noinspection JSUnusedGlobalSymbols
    static getCustomChName(channel ?: string) : string
    {
        let res : string = ZationChannel.CUSTOM_CHANNEL_PREFIX;
        if(channel !== undefined) {
            res += channel;
        }
        return res;
    }

    // noinspection JSUnusedGlobalSymbols
    unsubscribeCustomIdCh(channel ?: string,id ?: string,andDestroy : boolean = true) : string[]
    {
        return this.unsubscribeWithIndex(ChannelEngine.getCustomIdChName(channel,id),andDestroy);
    }

    getSubCustomIdCh(channel ?: string,id ?: string) : string[]
    {
        return this.getSubsWithIndex(ChannelEngine.getCustomIdChName(channel,id));
    }

    hasSubCustomIdCh(channel ?: string,id ?: string) : boolean
    {
        return this.getSubCustomIdCh(channel,id).length > 0;
    }

    // noinspection JSUnusedGlobalSymbols
    unsubscribeCustomCh(channel ?: string,andDestroy : boolean = true) : string[]
    {
        return this.unsubscribeWithIndex(ChannelEngine.getCustomChName(channel),andDestroy);
    }

    getSubCustomCh(channel ?: string) : string[]
    {
        return this.getSubsWithIndex(ChannelEngine.getCustomChName(channel));
    }

    hasSubCustomCh(channel ?: string) : boolean
    {
        return this.getSubCustomCh(channel).length > 0;
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

    publish(channelName : string,eventName : string,data : any) : Promise<void>
    {
        return new Promise<void>((resolve, reject) => {
            if(this.zation.isConnected())
            {
                this.zation.getSocket().publish(channelName,ChannelEngine.buildPubData(eventName,data),(err) =>
                {
                    if(err){
                        reject(new PublishFailedError(err));
                    }
                    else{
                        resolve();
                    }
                });
            }
            else {
                reject(new ConnectionNeededError('To publish data!'));
            }
        });
    }

    async pubUserCh(userId : string | number,event : string, data : any) : Promise<void> {
        await this.publish(ZationChannel.USER_CHANNEL_PREFIX + userId,event,data);
    }

    async pubAuthUserGroupCh(authUserGroup : string,event : string, data : any) : Promise<void> {
        await this.publish(ZationChannel.AUTH_USER_GROUP_PREFIX + authUserGroup,event,data);
    }

    async pubDefaultUserGroupCh(event : string, data : any) : Promise<void> {
        await this.publish(ZationChannel.DEFAULT_USER_GROUP,event,data);
    }

    async pubAllCh(event : string, data : any) : Promise<void> {
        await this.publish(ZationChannel.ALL,event,data);
    }

    async pubPanelInCh(event : string, data : any) : Promise<void> {
        await this.publish(ZationChannel.PANEL_IN,event,data);
    }

    async pubCustomCh(chName : string,event : string, data : any) : Promise<void> {
        await this.publish(ZationChannel.CUSTOM_CHANNEL_PREFIX + chName,event,data);
    }

    async pubCustomIdCh(chName : string, id : string, event : string, data : any) : Promise<void> {
        await this.publish
        (
            ZationChannel.CUSTOM_ID_CHANNEL_PREFIX + chName + ZationChannel.CUSTOM_CHANNEL_ID + id,
            event,
            data
        );
    }
}


