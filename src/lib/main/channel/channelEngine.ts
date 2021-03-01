/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import Channel  from "./channel";
import {
    CH_CLIENT_OUTPUT_CLOSE,
    CH_CLIENT_OUTPUT_KICK_OUT,
    CH_CLIENT_OUTPUT_PUBLISH, CHANNEL_START_INDICATOR, ChannelSubscribeRequest,
    ChClientInputAction,
    ChClientInputPackage, ChClientOutputClosePackage, ChClientOutputKickOutPackage,
    ChClientOutputPublishPackage
} from './channelDefinitions';
import {buildFullChId}      from "./channelUtils";
import {Socket}             from "../sc/socket";
import {Logger}             from "../logger/logger";
// noinspection ES6PreferShortImport
import {RawError}           from "../../main/error/rawError";
import {ZationClientConfig} from "../config/zationClientConfig";

export class ChannelEngine
{
    private readonly _channels: Map<string,Set<Channel<any>>> = new Map();
    private readonly _zc: ZationClientConfig;
    private _socket: Socket;

    constructor(zc: ZationClientConfig) {
        this._zc = zc;
    }

    connectToSocket(socket: Socket)
    {
        this._socket = socket;
        this._socket.on(CH_CLIENT_OUTPUT_PUBLISH,(data: ChClientOutputPublishPackage) => {
            const channelSet = this._channels.get(data.i);
            if(channelSet) for(const channel of channelSet) channel._triggerPublish(data.m,data.e,data.d);
        });

        this._socket.on(CH_CLIENT_OUTPUT_KICK_OUT,(data: ChClientOutputKickOutPackage) => {
            const channelSet = this._channels.get(data.i);
            if(channelSet) for(const channel of channelSet) channel._triggerKickOut(data.m,data.c,data.d);
        });

        this._socket.on(CH_CLIENT_OUTPUT_CLOSE,(data: ChClientOutputClosePackage) => {
            const channelSet = this._channels.get(data.i);
            if(channelSet) for(const channel of channelSet) channel._triggerClose(data.m,data.c,data.d);
        });

        this._socket.on('disconnect',() => {
            for(const channelSet of this._channels.values()) {
                for(const channel of channelSet){
                    channel._triggerConnectionLost();
                }
            }
        });

        const trySubscribePendingHandler = async () => {
            const promises: Promise<void>[] = [];
            const checkedChs = new Set<string>();
            for(const channelSet of this._channels.values()) {
                for(const channel of channelSet){
                    promises.push(channel._resubscribe(checkedChs));
                }
            }
            await Promise.all(promises);
        };
        this._socket.on('connect', trySubscribePendingHandler);
        this._socket.on('authenticate', trySubscribePendingHandler);
    }

    /**
     * Tries to subscribe to a channel.
     * If the subscription is successful it returns the chId and fullChId.
     * @param identifier
     * @param apiLevel
     * @param chMember
     * @param notTriggerChannel
     */
    trySubscribe<M>(identifier: string,apiLevel?: number, chMember?: {member: M, memberStr: string},
                 notTriggerChannel?: Channel<M>): Promise<{chId: string, fullChId: string}>
    {
        const {memberStr, member} = chMember || {};
        return new Promise((resolve, reject) => {
            this._socket.emit(CHANNEL_START_INDICATOR,{
                c: identifier,
                ...(member !== undefined ? {m: member} : {}),
                ...(apiLevel !== undefined ? {a: apiLevel} : {}),
            } as ChannelSubscribeRequest,(err,chId: string) => {
                if(err){
                    reject(new RawError('Subscription failed.', err));
                }
                else {
                    //tell others.
                    const fullChId = buildFullChId(chId,memberStr);
                    const channelSet = this._channels.get(chId);
                    if(channelSet){
                        for(const channel of channelSet){
                            if(channel === notTriggerChannel) continue;
                            channel._triggerSubscription(fullChId);
                        }
                    }
                    if(this._zc.isDebug()) {
                        Logger.printInfo(`Client subscribed to channel: '${identifier}'${
                            memberStr !== undefined ? ` with member: '${memberStr}'` : ''}.`);
                    }
                    resolve({chId,fullChId});
                }
            })
        });
    }

    register(chId: string,channel: Channel<any>) {
        let channelSet = this._channels.get(chId);
        if(!channelSet) {
            channelSet = new Set<Channel>();
            this._channels.set(chId,channelSet);
        }
        channelSet.add(channel);
    }

    unregister(chId: string,channel: Channel<any>) {
        const channelSet = this._channels.get(chId);
        if(channelSet){
            channelSet.delete(channel);
            if(channelSet.size === 0) {
                this._channels.delete(chId);
            }
        }
    }

    unsubscribe(fullChId: string, sourceChannel: Channel<any>) {
        for(const channelSet of this._channels.values()) {
            for(const channel of channelSet){
                if(channel !== sourceChannel && channel._hasSub(fullChId)) return;
            }
        }
        this._socket.emit(fullChId,[ChClientInputAction.Unsubscribe] as ChClientInputPackage);
    }

    /**
     * Unsubscribes all channels.
     */
    unsubscribeAllChannels(identifier?: string) {
        if(identifier != undefined) {
            const searchId = CHANNEL_START_INDICATOR + identifier;
            for(const [chId,channelSet] of this._channels.entries()) {
                if(!chId.startsWith(searchId)) continue;
                for(const channel of channelSet){
                    channel.unsubscribe();
                }
            }
        }
        else {
            for(const channelSet of this._channels.values()) {
                for(const channel of channelSet){channel.unsubscribe();}
            }
        }
    }
}