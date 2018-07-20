/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import Const = require("../constants/constWrapper");
import Zation = require("../../api/zation");

class ChannelEngine
{
    private readonly zation : Zation;

    constructor(zation : Zation)
    {
        this.zation = zation;
    }

    // noinspection JSUnusedGlobalSymbols
    registerUserChannel(userId : string | number) {
        this.registerChannel(Const.Settings.CHANNEL.USER_CHANNEL_PREFIX + userId);
    }

    // noinspection JSUnusedGlobalSymbols
    unregisterUserChannel(userId : string | number) {
       this.destroyChannel(Const.Settings.CHANNEL.USER_CHANNEL_PREFIX + userId);
    }

    // noinspection JSUnusedGlobalSymbols
    registerAuthGroupChannel(authGroup : string) {
        this.registerChannel(Const.Settings.CHANNEL.AUTH_USER_GROUP_PREFIX + authGroup);
    }

    // noinspection JSUnusedGlobalSymbols
    unregisterAuthGroupChannel(authGroup : string) {
        this.destroyChannel(Const.Settings.CHANNEL.AUTH_USER_GROUP_PREFIX + authGroup);
    }

    // noinspection JSUnusedGlobalSymbols
    registerDefaultGroupChannel() {
        this.registerChannel(Const.Settings.CHANNEL.DEFAULT_USER_GROUP);
    }

    // noinspection JSUnusedGlobalSymbols
    unregisterDefaultGroupChannel() {
        this.destroyChannel(Const.Settings.CHANNEL.DEFAULT_USER_GROUP);
    }

    // noinspection JSUnusedGlobalSymbols
    registerAllChannel() {
        this.registerChannel(Const.Settings.CHANNEL.ALL);
    }

    // noinspection JSUnusedGlobalSymbols
    unregisterAllChannel() {
        this.destroyChannel(Const.Settings.CHANNEL.ALL);
    }

    registerChannel(channel : string)
    {
        const socket = this.zation.getSocket();
        if(!!socket)
        {
            socket.subscribe(channel);
            socket.unwatch(channel);
            socket.watch(channel,(data) =>
            {
                this.channelReactionMainBox.forEach((respond) =>
                {
                    respond._trigger(
                        {
                            channel : channel,
                            isSpecial : false,
                            event : input['e'],
                            data : input['d']
                        });
                });
            });
        }
    }

    destroyChannel(channel)
    {
        const socket = this.zation.getSocket();
        if(!!socket && socket.isSubscribed(channel))
        {
            socket.destroyChannel(channel);
        }
    }

    //Part Custom Channel

    // noinspection JSUnusedGlobalSymbols
    subscribeSpecialCh(channel,id)
    {
        let channelName = ZationConst.CHANNEL_SPECIAL_CHANNEL_PREFIX + channel + ZationConst.CHANNEL_SPECIAL_CHANNEL_ID + id;
        this._socket.subscribe(channelName);

        let watcher = (input) =>
        {
            this.channelReactionMainBox.forEach((respond) =>
            {
                respond._trigger(
                    {
                        channel : channel,
                        id : id,
                        isSpecial : true,
                        event : input['e'],
                        data : input['d']
                    });
            });
        };
        this._socket.unwatch(channelName);
        this._socket.watch(channelName,watcher);
    }

    // noinspection JSUnusedGlobalSymbols
    subscribeNewSpecialChannelId(channel,id)
    {
        this.unsubscribeSpecialCh(channel);
        this.subscribeSpecialCh(channel,id);
    }

    // noinspection JSUnusedGlobalSymbols
    isSubscribeSpecialCh(channel,id)
    {
        let channelName = ZationTools.getSpecialChannelName(channel,id);
        let subs = this._socket.subscriptions();
        let found = false;

        for(let i = 0; i < subs.length; i++)
        {
            if(subs[i].indexOf(channelName) !== -1)
            {
                found = true;
            }
        }
        return found;
    }

    // noinspection JSUnusedGlobalSymbols
    static getSpecialChannelName(channel,id)
    {
        let channelName = ZationConst.CHANNEL_SPECIAL_CHANNEL_PREFIX;

        if(channel !== undefined)
        {
            channelName+= id;
            if(id !== undefined)
            {
                channelName += ZationConst.CHANNEL_SPECIAL_CHANNEL_ID + id;
            }
        }

        return channelName;
    }

    // noinspection JSUnusedGlobalSymbols
    unsubscribeSpecialCh(channel,id)
    {
        let channelName = ZationTools.getSpecialChannelName(channel,id);

        let subs = this._socket.subscriptions();
        let isUnsubscribeAChannel = false;

        for(let i = 0; i < subs.length; i++)
        {
            if(subs[i].indexOf(channelName) !== -1)
            {
                this._socket.destroyChannel(subs[i]);
                isUnsubscribeAChannel = true;
            }
        }
        return isUnsubscribeAChannel;
    }

}

export = ChannelEngine;

