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
    async registerUserChannel(userId : string | number) {
        await this.registerZationChannel(Const.Settings.CHANNEL.USER_CHANNEL_PREFIX + userId,ChannelType.USER);
    }

    // noinspection JSUnusedGlobalSymbols
    unregisterUserChannel(userId : string | number) {
       this.unregisterChannel(Const.Settings.CHANNEL.USER_CHANNEL_PREFIX + userId);
    }

    // noinspection JSUnusedGlobalSymbols
    async registerAuthUserGroupChannel(authGroup : string) {
        await this.registerZationChannel(Const.Settings.CHANNEL.AUTH_USER_GROUP_PREFIX + authGroup,ChannelType.AUTH_USER_GROUP);
    }

    // noinspection JSUnusedGlobalSymbols
    unregisterAuthUserGroupChannel(authGroup : string) {
        this.unregisterChannel(Const.Settings.CHANNEL.AUTH_USER_GROUP_PREFIX + authGroup);
    }

    // noinspection JSUnusedGlobalSymbols
    async registerDefaultUserGroupChannel() {
        await this.registerZationChannel(Const.Settings.CHANNEL.DEFAULT_USER_GROUP,ChannelType.DEFAULT_USER_GROUP);
    }

    // noinspection JSUnusedGlobalSymbols
    unregisterDefaultUserGroupChannel() {
        this.unregisterChannel(Const.Settings.CHANNEL.DEFAULT_USER_GROUP);
    }

    // noinspection JSUnusedGlobalSymbols
    async registerAllChannel() {
        await this.registerZationChannel(Const.Settings.CHANNEL.ALL,ChannelType.ALL);
    }

    // noinspection JSUnusedGlobalSymbols
    unregisterAllChannel() {
        this.unregisterChannel(Const.Settings.CHANNEL.ALL);
    }

    registerChannel(channel : string, watcher : Function) : Promise<void>
    {
        return new Promise((resolve, reject) => {
            const socket : any = this.zation.getSocket();
            if(!!socket && this.zation.isSocketConnected())
            {
                // noinspection TypeScriptValidateJSTypes
                const ch = socket.channel(channel);

                //register
                ch.on('subscribe',() => {
                    //watcher
                    ch.unwatch();
                    // noinspection TypeScriptValidateJSTypes
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


    async registerZationChannel(channel : string, type : ChannelType) : Promise<void>
    {
       await this.registerChannel(channel,async (input : any) =>
       {
           let promises : Promise<void>[] = [];
           promises.push(this.zation._getChannelReactionMainBox().forEach(async (channelReactionBox : ChannelReactionBox) =>
           {
               const event : string = input['e'];
               const data : any = input['d'];
               await channelReactionBox._triggerZationCh(type,event,data);
           }));
           await Promise.all(promises);
       });
    }

    unregisterChannel(channel) : void
    {
        const socket : any = this.zation.getSocket();
        if(!!socket && socket.isSubscribed(channel)) {
            socket.destroyChannel(channel);
        }
    }

    //Part Custom Channel

    // noinspection JSUnusedGlobalSymbols
    async registerCustomCh(channel : string) : Promise<void>
    {
        await this.registerChannel(Const.Settings.CHANNEL.CUSTOM_CHANNEL_PREFIX + channel,async (input : any) => {
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
        await this.registerChannel
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
    unsubscribeCustomIdCh(channel ?: string,id ?: string) : string[]
    {
        return this.unsubscribeWithIndex(ChannelEngine.getCustomIdChName(channel,id));
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
    unsubscribeCustomCh(channel ?: string) : string[]
    {
        return this.unsubscribeWithIndex(ChannelEngine.getCustomChName(channel));
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
    unsubscribeWithIndex(channelName : string) : string[]
    {
        const socket = this.zation.getSocket();
        let unsubscribedChannels : string[] = [];
        if(!!socket) {
            const subs = socket.subscriptions();
            for(let i = 0; i < subs.length; i++) {
                if(subs[i].indexOf(channelName) !== -1) {
                    this.unregisterChannel(subs[i]);
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
            const subs = socket.subscriptions();
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

