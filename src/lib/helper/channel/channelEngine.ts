/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import Const = require("../constants/constWrapper");
import Zation = require("../../api/zation");
import ChannelReactionBox = require("../../api/channelReactionBox");
import {ChannelType} from "./channelType";
import ConnectionNeededError = require("../error/connectionNeededError");
import SubscribeFailError = require("../error/subscribeFailError");

class ChannelEngine
{
    private readonly zation : Zation;

    constructor(zation : Zation)
    {
        this.zation = zation;
    }

    // noinspection JSUnusedGlobalSymbols
    async subUserChannel(userId : string | number) {
        await this.subZationChannel(Const.Settings.CHANNEL.USER_CHANNEL_PREFIX + userId,ChannelType.USER);
    }

    // noinspection JSUnusedGlobalSymbols
    isSubUserChannel(userId : string | number) : boolean  {
        return this.isSubChannel(Const.Settings.CHANNEL.USER_CHANNEL_PREFIX + userId);
    }

    // noinspection JSUnusedGlobalSymbols
    unsubUserChannel(userId : string | number,andDestroy : boolean = true) {
       this.unsubChannel(Const.Settings.CHANNEL.USER_CHANNEL_PREFIX + userId,andDestroy);
    }

    // noinspection JSUnusedGlobalSymbols
    async subAuthUserGroupChannel(authGroup : string) {
        await this.subZationChannel(Const.Settings.CHANNEL.AUTH_USER_GROUP_PREFIX + authGroup,ChannelType.AUTH_USER_GROUP);
    }

    // noinspection JSUnusedGlobalSymbols
    isSubAuthUserGroupChannel(authGroup : string) : boolean  {
        return this.isSubChannel(Const.Settings.CHANNEL.AUTH_USER_GROUP_PREFIX + authGroup);
    }

    // noinspection JSUnusedGlobalSymbols
    unsubAuthUserGroupChannel(authGroup : string,andDestroy : boolean = true) {
        this.unsubChannel(Const.Settings.CHANNEL.AUTH_USER_GROUP_PREFIX + authGroup,andDestroy);
    }

    // noinspection JSUnusedGlobalSymbols
    async subDefaultUserGroupChannel() {
        await this.subZationChannel(Const.Settings.CHANNEL.DEFAULT_USER_GROUP,ChannelType.DEFAULT_USER_GROUP);
    }

    // noinspection JSUnusedGlobalSymbols
    isSubDefaultUserGroupChannel() : boolean {
        return this.isSubChannel(Const.Settings.CHANNEL.DEFAULT_USER_GROUP);
    }

    // noinspection JSUnusedGlobalSymbols
    unsubDefaultUserGroupChannel(andDestroy : boolean = true) {
        this.unsubChannel(Const.Settings.CHANNEL.DEFAULT_USER_GROUP,andDestroy);
    }

    // noinspection JSUnusedGlobalSymbols
    async subAllChannel() {
        await this.subZationChannel(Const.Settings.CHANNEL.ALL,ChannelType.ALL);
    }

    // noinspection JSUnusedGlobalSymbols
    isSubAllChannel() : boolean {
        return this.isSubChannel(Const.Settings.CHANNEL.ALL);
    }

    // noinspection JSUnusedGlobalSymbols
    unsubAllChannel(andDestroy : boolean = true) {
        this.unsubChannel(Const.Settings.CHANNEL.ALL,andDestroy);
    }

    subChannel(channel : string, watcher : Function) : Promise<void>
    {
        return new Promise((resolve, reject) => {
            const socket = this.zation.getSocket();
            if(!!socket && this.zation.isSocketConnected())
            {
                const ch = socket.channel(channel);

                //register
                ch.on('subscribe',() => {
                    //watcher
                    ch.unwatch();
                    ch.watch(watcher);
                    resolve();
                });

                //register
                ch.on('subscribeFail',(err) => {
                    reject(new SubscribeFailError(err));
                });
            }
            else {
                reject(new ConnectionNeededError());
            }
        });
    }


    async subZationChannel(channel : string, type : ChannelType) : Promise<void>
    {
       await this.subChannel(channel,async (input : any) =>
       {
           const promises : Promise<void>[] = [];
           promises.push(this.zation._getChannelReactionMainBox().forEach(async (channelReactionBox : ChannelReactionBox) =>
           {
               const event : string = input['e'];
               const data : any = input['d'];
               await channelReactionBox._triggerZationCh(type,event,data);
           }));
           await Promise.all(promises);
       });
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
            }
        }
    }

    isSubChannel(channel) : boolean
    {
        const socket : any = this.zation.getSocket();
        return !!(!!socket && socket.isSubscribed(channel));
    }

    //Part Custom Channel

    // noinspection JSUnusedGlobalSymbols
    async registerCustomCh(channel : string) : Promise<void>
    {
        await this.subChannel(Const.Settings.CHANNEL.CUSTOM_CHANNEL_PREFIX + channel,async (input : any) => {
            let promises : Promise<void>[] = [];
            promises.push(this.zation._getChannelReactionMainBox().forEach(async (channelReactionBox : ChannelReactionBox) =>
            {
                const event : string = input['e'];
                const data : any = input['d'];
                await channelReactionBox._triggerCustomCh(channel,event,data);
            }));
            await Promise.all(promises);
        });
    }

    // noinspection JSUnusedGlobalSymbols
    async registerCustomIdCh(channel : string, id : string) : Promise<void>
    {
        await this.subChannel
        (Const.Settings.CHANNEL.CUSTOM_ID_CHANNEL_PREFIX + channel + Const.Settings.CHANNEL.CUSTOM_CHANNEL_ID + id,
            async (input : any) => {
                let promises : Promise<void>[] = [];
                promises.push(this.zation._getChannelReactionMainBox().forEach(async (channelReactionBox : ChannelReactionBox) =>
                {
                    const event : string = input['e'];
                    const data : any = input['d'];
                    await channelReactionBox._triggerCustomIdCh(channel,id,event,data);
                }));
                await Promise.all(promises);
        });
    }

    // noinspection JSUnusedGlobalSymbols
    static getCustomIdChName(channel ?: string, id ?: string) : string
    {
        let res = Const.Settings.CHANNEL.CUSTOM_ID_CHANNEL_PREFIX;
        if(channel !== undefined) {
            res += channel;
            if(id !== undefined) {
                res += Const.Settings.CHANNEL.CUSTOM_CHANNEL_ID;
                res += id;
            }
        }
        return res;
    }

    // noinspection JSUnusedGlobalSymbols
    static getCustomChName(channel ?: string) : string
    {
        let res = Const.Settings.CHANNEL.CUSTOM_CHANNEL_PREFIX;
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

    isSubCustomIdCh(channel ?: string,id ?: string) : boolean
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

    isSubCustomCh(channel ?: string) : boolean
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

}

export = ChannelEngine;

