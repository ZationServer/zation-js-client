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
import {Socket}             from "../sc/socket";
import {Logger}             from "../logger/logger";
// noinspection ES6PreferShortImport
import {RawError}           from "../../main/error/rawError";
import {ClientConfig}       from "../config/clientConfig";
import {DeepReadonly, Writable} from '../utils/typeUtils';

const enum ChannelSetSubscribeState {
    Subscribed,
    Pending
}

interface ChSet<M> {
    instances: Set<Channel<M>>;
    identifier: string;
    apiLevel: number | undefined;
    member: DeepReadonly<M> | undefined;
    state: ChannelSetSubscribeState;
}

export class ChannelEngine
{
    private readonly _channels: Map<string,ChSet<any>> = new Map();
    private readonly _zc: ClientConfig;
    private _socket: Socket;

    constructor(zc: ClientConfig) {
        this._zc = zc;
    }

    connectToSocket(socket: Socket)
    {
        this._socket = socket;
        this._socket.on(CH_CLIENT_OUTPUT_PUBLISH,(data: ChClientOutputPublishPackage) => {
            const chSet = this._channels.get(data.i);
            if(chSet) for(const channel of chSet.instances) channel._triggerPublish(data.e,data.d);
        });

        this._socket.on(CH_CLIENT_OUTPUT_KICK_OUT,(data: ChClientOutputKickOutPackage) => {
            const chSet = this._channels.get(data.i);
            if(chSet) {
                chSet.state = ChannelSetSubscribeState.Pending;
                for(const channel of chSet.instances) channel._triggerKickOut(data.c,data.d);
            }
        });

        this._socket.on(CH_CLIENT_OUTPUT_CLOSE,(data: ChClientOutputClosePackage) => {
            const chSet = this._channels.get(data.i);
            if(chSet) {
                this._channels.delete(data.i);
                for(const channel of chSet.instances) channel._triggerClose(data.c,data.d);
            }
        });

        this._socket.on('disconnect',() => {
            for(const chSet of this._channels.values()) {
                chSet.state = ChannelSetSubscribeState.Pending;
                for(const channel of chSet.instances){
                    channel._triggerConnectionLost();
                }
            }
        });

        const trySubscribePendingHandler = async () => {
            const promises: Promise<void>[] = [];
            for(let [chId,chSet] of this._channels.entries()) {
                if(chSet.state !== ChannelSetSubscribeState.Subscribed) {
                    promises.push((async () => {
                        const newChId = await this.trySubscribe(chSet.identifier,chSet.apiLevel,chSet.member);
                        chSet.state = ChannelSetSubscribeState.Subscribed;
                        if(chId !== newChId) {
                            //reorder..
                            this._channels.delete(chId);
                            for(const channel of chSet.instances) (channel as Writable<Channel<any>>)._chId = newChId;
                            const newChSet = this._channels.get(newChId);
                            if(newChSet) {
                                chSet = {...chSet};
                                chSet.instances = new Set([...chSet.instances,...newChSet.instances]);
                            }
                            this._channels.set(newChId,chSet);
                        }
                        for(const channel of chSet.instances) channel._triggerResubscription();
                    })())
                }
            }
            await Promise.all(promises);
        };
        this._socket.on('connect', trySubscribePendingHandler);
        this._socket.on('authenticate', trySubscribePendingHandler);
    }

    /**
     * Tries to subscribe to a channel.
     * If the subscription is successful it returns the chId.
     * @param identifier
     * @param apiLevel
     * @param member
     * @param sourceCh
     */
    trySubscribe<M>(identifier: string,apiLevel?: number, member?: M,
                 sourceCh?: Channel<M>): Promise<string>
    {
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
                    let channelInfo = this._channels.get(chId);
                    if(!channelInfo) {
                        channelInfo = {
                            identifier,
                            apiLevel,
                            member,
                            instances: new Set<Channel<any>>(),
                            state: ChannelSetSubscribeState.Subscribed
                        };
                        this._channels.set(chId,channelInfo);
                    }
                    if(sourceCh) {
                        channelInfo.instances.add(sourceCh);
                        (sourceCh as Writable<Channel<any>>)._chId = chId;
                    }
                    if(this._zc.isDebug()) Logger.printInfo(`Client subscribed to channel: '${chId}'.`);
                    resolve(chId);
                }
            })
        });
    }

    unsubscribe(chId: string, sourceChannel: Channel<any,any>) {
        const chSet = this._channels.get(chId);
        if(chSet) {
            chSet.instances.delete(sourceChannel);
            (sourceChannel as Writable<Channel<any>>)._chId = undefined;
            if(chSet.instances.size <= 0) {
                this._channels.delete(chId);
                this._socket.emit(chId,[ChClientInputAction.Unsubscribe] as ChClientInputPackage);
            }
        }
    }

    /**
     * Unsubscribes all channels.
     */
    unsubscribeAllChannels(identifier?: string) {
        if(identifier != undefined) {
            const searchId = CHANNEL_START_INDICATOR + identifier;
            for(const [chId,chSet] of this._channels.entries()) {
                if(!chId.startsWith(searchId)) continue;
                for(const channel of chSet.instances) channel.unsubscribe();
            }
        }
        else {
            for(const chSet of this._channels.values()) {
                for(const channel of chSet.instances) channel.unsubscribe();
            }
        }
    }
}