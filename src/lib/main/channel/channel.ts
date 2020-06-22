/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {ChannelEngine}                         from "./channelEngine";
import ConnectionUtils, {ConnectTimeoutOption} from "../utils/connectionUtils";
// noinspection ES6PreferShortImport
import {ZationClient}                          from "../../core/zationClient";
import {buildFullChId}                         from "./channelUtils";
import {FullReaction}                          from "../react/fullReaction";
import {ListMap}                               from "../container/listMap";
import {List}                                  from "../container/list";

export const enum ChannelSubscribeState {
    Subscribed,
    Pending
}

export interface ChannelSubscribeInfo {
    state: ChannelSubscribeState,
    member: string | undefined
}

export type ChannelReactionOnPublish        = (data: any,member?: string) => void | Promise<void>;
export type ChannelReactionOnSubscribe      = (member?: string) => void | Promise<void>;
export type ChannelReactionOnUnsubscribe    = (reason: UnsubscribeReason,member?: string) => void | Promise<void>;
export type ChannelReactionOnKickOut        = (member?: string,code?: number | string | undefined,data?: any) => void | Promise<void>;

const enum ChannelEvent {
    Publish,
    Subscribe,
    Unsubscribe,
    KickOut
}
type ReactionFilter = (filter: object) => boolean;
interface ChFilter {
    event?: string
}

export enum UnsubscribeReason {
    Client,
    KickOut,
    Disconnect
}

export default class Channel {

    private readonly _client: ZationClient;
    private readonly _channelEngine: ChannelEngine;

    private _chId?: string = undefined;
    private readonly _states: Map<string,ChannelSubscribeInfo> = new Map();
    protected readonly _reactionMap: ListMap<FullReaction<any>> = new ListMap<FullReaction<any>>();

    private readonly _identifier: string;
    private readonly _apiLevel: number | undefined;

    constructor(zation: ZationClient, identifier: string, apiLevel?: number) {
        this._client = zation;
        this._channelEngine = zation._getChannelEngine();
        this._identifier = identifier;
        this._apiLevel = apiLevel;
    }

    /**
     * Subscribe this channel or a specific member of this channel.
     * If you access a ChannelFamily you need to provide a member as a first parameter.
     * If the subscription was successful the method will not throw an error.
     * Notice that your previous subscriptions are not cancelled,
     * if you want this you can use the subscribeNew method.
     * If the subscription is later on lost by a connection lost or kick out
     * the client will automatically try to resubscribe in case of reconnection
     * or change of the authentication state.
     * If you don't need the subscription anymore you need to unsubscribe it to clear resources.
     * @param member
     * @param connectTimeout
     * With the ConnectTimeout option, you can activate that the socket is
     * trying to connect when it is not connected. You have five possible choices:
     * Undefined: It will use the value from the default options.
     * False: The action will fail and throw a ConnectionRequiredError,
     * when the socket is not connected.
     * Null: The socket will try to connect (if it is not connected) and
     * waits until the connection is made, then it continues the action.
     * Number: Same as null, but now you can specify a timeout (in ms) of
     * maximum waiting time for the connection. If the timeout is reached,
     * it will throw a timeout error.
     * AbortTrigger: Same as null, but now you have the possibility to abort the wait later.
     * @throws ConnectionRequiredError, TimeoutError, Error,AbortSignal
     */
    async subscribe(member?: string | number,connectTimeout: ConnectTimeoutOption = undefined): Promise<void> {
        if(member !== undefined) member = member.toString();
        await ConnectionUtils.checkConnection(this._client,connectTimeout);
        const {chId,fullChId} = await this._channelEngine.trySubscribe(this._identifier,this._apiLevel,member,this);
        const newSub = this.hasSubscribed(member);
        this._states.set(fullChId,{member,state: ChannelSubscribeState.Subscribed});
        this._setChId(chId);
        if(newSub) {
            this._triggerEvent<ChannelReactionOnSubscribe>(ChannelEvent.Subscribe,member);
        }
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Subscribe this channel or a specific member of this channel and
     * unsubscribe the previous subscriptions.
     * If you access a ChannelFamily you need to provide a member as a first parameter.
     * If the subscription was successful the method will not throw an error.
     * If the subscription is later on lost by a connection lost or kick out
     * the client will automatically try to resubscribe in case of reconnection
     * or change of the authentication state.
     * If you don't need the subscription anymore you need to unsubscribe it to clear resources.
     * @param member
     * @param connectTimeout
     * With the ConnectTimeout option, you can activate that the socket is
     * trying to connect when it is not connected. You have five possible choices:
     * Undefined: It will use the value from the default options.
     * False: The action will fail and throw a ConnectionRequiredError,
     * when the socket is not connected.
     * Null: The socket will try to connect (if it is not connected) and
     * waits until the connection is made, then it continues the action.
     * Number: Same as null, but now you can specify a timeout (in ms) of
     * maximum waiting time for the connection. If the timeout is reached,
     * it will throw a timeout error.
     * AbortTrigger: Same as null, but now you have the possibility to abort the wait later.
     * @throws ConnectionRequiredError, TimeoutError, Error,AbortSignal
     */
    async subscribeNew(member?: string | number,connectTimeout: ConnectTimeoutOption = undefined): Promise<void> {
       this.unsubscribe();
       return this.subscribe(member,connectTimeout);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns if the channel has at least one subscription.
     */
    hasSubscription(includePending: boolean = false): boolean {
        if(includePending){
            return this._states.size > 0;
        }
        for(const info of this._states.values()){
            if(info.state === ChannelSubscribeState.Subscribed) return true;
        }
        return false;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns if a specific channel is subscribed.
     * @param member
     * @param includePending
     */
    hasSubscribed(member?: string | number,includePending: boolean = false): boolean {
        if(member !== undefined) member = member.toString();
        const info = this._states.get(buildFullChId(this._chId,member));
        return !!(info && info.state === ChannelSubscribeState.Subscribed);
    }

    /**
     * Unsubscribe this channel.
     * In case of a channel family all members or only a specific member.
     * This is important to clear resources and avoid the trying of
     * resubscribing in case of reconnections or kick-outs.
     * @param member
     */
    unsubscribe(member?: string | number) {
        if(member === undefined) {
            for(const [fullChId, info] of this._states){
                this._unsubscribe(fullChId,info.member);
            }
        }
        else {
            member = member.toString();
            for(const [fullChId, info] of this._states){
                if(info.member === member){this._unsubscribe(fullChId,member);}
            }
        }
        if(this._states.size === 0){
            this._deleteChId();
        }
    }

    private _unsubscribe(fullChId: string,member?: string) {
        this._channelEngine.unsubsribe(fullChId,this);
        this._states.delete(fullChId);
        this._triggerEvent<ChannelReactionOnUnsubscribe>(ChannelEvent.Unsubscribe,UnsubscribeReason.Client,member);
    }

    /**
     * @internal
     * @param fullChId
     * @private
     */
    _triggerSubscribtion(fullChId: string) {
        const info = this._states.get(fullChId);
        if(info) {
            const oldState = info.state;
            info.state = ChannelSubscribeState.Subscribed;
            if(oldState === ChannelSubscribeState.Pending) {
                this._triggerEvent<ChannelReactionOnSubscribe>(ChannelEvent.Subscribe,info.member);
            }
        }
    }

    /**
     * @internal
     * @private
     */
    _triggerPublish(member: string | undefined,event: string,data: any) {
        const list = this._reactionMap.tryGet(ChannelEvent.Publish);
        if(list) {
            (async () => {
                try {
                    await this._triggerReactionsList<ChannelReactionOnPublish>(list,
                        (filter: ChFilter): boolean => filter.event === event,data,member);
                }
                catch (e) {}
            })();
        }
    }

    /**
     * @internal
     * @private
     */
    _triggerKickOut(member: string | undefined,code: number | string | undefined,data: any) {
        const info = this._states.get(buildFullChId(this.chId,member));
        if(info){
            const oldState = info.state;
            info.state = ChannelSubscribeState.Pending;
            this._triggerEvent<ChannelReactionOnKickOut>(ChannelEvent.KickOut,member,code,data);
            if(oldState === ChannelSubscribeState.Subscribed){
                this._triggerEvent<ChannelReactionOnUnsubscribe>
                (ChannelEvent.Unsubscribe,UnsubscribeReason.KickOut,member);
            }
        }
    }

    /**
     * @internal
     * @private
     */
    _triggerConnectionLost() {
        for(const info of this._states.values()){
            const oldState = info.state;
            info.state = ChannelSubscribeState.Pending;
            if(oldState === ChannelSubscribeState.Subscribed){
                this._triggerEvent<ChannelReactionOnUnsubscribe>
                (ChannelEvent.Unsubscribe,UnsubscribeReason.Disconnect,info.member);
            }
        }
    }

    private _triggerEvent<E extends (...args: any[]) => any>(event: ChannelEvent,...args: Parameters<E>) {
        const list = this._reactionMap.tryGet(event);
        if(list) {
            (async () => {
                try {
                    await this._triggerReactionsList<E>(list, undefined,...args);
                }
                catch (e) {}
            })();
        }
    }

    private async _triggerReactionsList<E extends (...args: any[]) => any>(list: List<FullReaction<any>>,
                                                                           filter: ReactionFilter | undefined, ...args: Parameters<E>)
    {
        const noFilter = filter === undefined;
        await list.forEachParallel(async (reaction: FullReaction<any>) => {
            if (noFilter || filter!(reaction.getFilter())) {
                if(reaction.isOnce()){
                    list.removeItem(reaction);
                }
                try{await reaction.getReactionHandler()(...args);}
                catch (e) {}
            }
        });
    }

    private _setChId(id: string) {
        if(this._chId !== undefined) return;
        this._channelEngine.register(id,this);
        this._chId = id;
    }

    private _deleteChId() {
        if(this._chId !== undefined) {
            this._channelEngine.unregister(this._chId,this);
            this._chId = undefined;
        }
    }

    /**
     * @internal
     * @param fullChId
     * @private
     */
    _hasSub(fullChId: string) {
        return this._states.has(fullChId);
    }

    /**
     * Tries to subscribe to all pending channels that
     * don't have a ch full id that is in the passed set.
     * Adds all ids that have been tried to subscribe to the set.
     * @internal
     * @private
     */
    async _resubscribe(checkedFullChIds: Set<string>): Promise<void> {
        for(const [fullChId, info] of this._states){
            if((info.state !== ChannelSubscribeState.Pending) || checkedFullChIds.has(fullChId)) continue;
            try {
                await this._channelEngine.trySubscribe(this._identifier,this._apiLevel,info.member);
            }
            catch (e) {}
            checkedFullChIds.add(fullChId);
        }
    }

    /**
     * @internal
     */
    get chId() {
        return this._chId;
    }

    //Events

    /**
     * @description
     * React on publish.
     * To remove the reaction later, you can use the
     * specific off method with the returned FullReaction.
     * @example
     * onPublish((data: any,member?: string) => {});
     * @param event
     * @param reaction
     */
    onPublish(event: string,reaction: ChannelReactionOnPublish): FullReaction<ChannelReactionOnPublish> {
        const fullReaction = new FullReaction<ChannelReactionOnPublish>(reaction,{event} as ChFilter)
        this._reactionMap.add(ChannelEvent.Publish, fullReaction);
        return fullReaction;
    }

    /**
     * @description
     * React once publish.
     * To remove the reaction later, you can use the
     * specific off method with the returned FullReaction.
     * @example
     * onPublish((data: any,member?: string) => {});
     * @param event
     * @param reaction
     */
    oncePublish(event: string,reaction: ChannelReactionOnPublish): FullReaction<ChannelReactionOnPublish> {
        const fullReaction = new FullReaction<ChannelReactionOnPublish>(reaction,{event} as ChFilter,true)
        this._reactionMap.add(ChannelEvent.Publish, fullReaction);
        return fullReaction;
    }

    /**
     * @description
     * Removes on/once publish reaction/s.
     * @param fullReaction
     * If no specific FullReaction is provided, all will be removed.
     */
    offPublish(fullReaction?: FullReaction<ChannelReactionOnPublish>): void {
        this._reactionMap.remove(ChannelEvent.Publish, fullReaction);
    }

    /**
     * @description
     * React on subscribe.
     * To remove the reaction later, you can use the
     * specific off method with the returned FullReaction.
     * @example
     * onSubscribe((member?: string) => {});
     * @param reaction
     */
    onSubscribe(reaction: ChannelReactionOnSubscribe): FullReaction<ChannelReactionOnSubscribe> {
        const fullReaction = new FullReaction<ChannelReactionOnSubscribe>(reaction,{})
        this._reactionMap.add(ChannelEvent.Subscribe, fullReaction);
        return fullReaction;
    }

    /**
     * @description
     * React once subscribe.
     * To remove the reaction later, you can use the
     * specific off method with the returned FullReaction.
     * @example
     * onSubscribe((member?: string) => {});
     * @param reaction
     */
    onceSubscribe(reaction: ChannelReactionOnSubscribe): FullReaction<ChannelReactionOnSubscribe> {
        const fullReaction = new FullReaction<ChannelReactionOnSubscribe>(reaction,{},true)
        this._reactionMap.add(ChannelEvent.Subscribe, fullReaction);
        return fullReaction;
    }

    /**
     * @description
     * Removes on/once subscribe reaction/s.
     * @param fullReaction
     * If no specific FullReaction is provided, all will be removed.
     */
    offSubscribe(fullReaction?: FullReaction<ChannelReactionOnSubscribe>): void {
        this._reactionMap.remove(ChannelEvent.Subscribe, fullReaction);
    }

    /**
     * @description
     * React on unsubscribe.
     * To remove the reaction later, you can use the
     * specific off method with the returned FullReaction.
     * @example
     * onUnsubscribe((member?: string) => {});
     * @param reaction
     */
    onUnsubscribe(reaction: ChannelReactionOnUnsubscribe): FullReaction<ChannelReactionOnUnsubscribe> {
        const fullReaction = new FullReaction<ChannelReactionOnUnsubscribe>(reaction,{})
        this._reactionMap.add(ChannelEvent.Unsubscribe, fullReaction);
        return fullReaction;
    }

    /**
     * @description
     * React once unsubscribe.
     * To remove the reaction later, you can use the
     * specific off method with the returned FullReaction.
     * @example
     * onUnsubscribe((member?: string) => {});
     * @param reaction
     */
    onceUnsubscribe(reaction: ChannelReactionOnUnsubscribe): FullReaction<ChannelReactionOnUnsubscribe> {
        const fullReaction = new FullReaction<ChannelReactionOnUnsubscribe>(reaction,{},true)
        this._reactionMap.add(ChannelEvent.Unsubscribe, fullReaction);
        return fullReaction;
    }

    /**
     * @description
     * Removes on/once unsubscribe reaction/s.
     * @param fullReaction
     * If no specific FullReaction is provided, all will be removed.
     */
    offUnsubscribe(fullReaction?: FullReaction<ChannelReactionOnUnsubscribe>): void {
        this._reactionMap.remove(ChannelEvent.Unsubscribe, fullReaction);
    }

    /**
     * @description
     * React on kick out.
     * To remove the reaction later, you can use the
     * specific off method with the returned FullReaction.
     * @example
     * onKickOut((member?: string,code?: number | string,data?: any) => {});
     * @param reaction
     */
    onKickOut(reaction: ChannelReactionOnKickOut): FullReaction<ChannelReactionOnKickOut> {
        const fullReaction = new FullReaction<ChannelReactionOnKickOut>(reaction,{})
        this._reactionMap.add(ChannelEvent.KickOut, fullReaction);
        return fullReaction;
    }

    /**
     * @description
     * React once kick out.
     * To remove the reaction later, you can use the
     * specific off method with the returned FullReaction.
     * @example
     * onKickOut((member?: string,code?: number | string,data?: any) => {});
     * @param reaction
     */
    onceKickOut(reaction: ChannelReactionOnKickOut): FullReaction<ChannelReactionOnKickOut> {
        const fullReaction = new FullReaction<ChannelReactionOnKickOut>(reaction,{},true)
        this._reactionMap.add(ChannelEvent.KickOut, fullReaction);
        return fullReaction;
    }

    /**
     * @description
     * Removes on/once kick out reaction/s.
     * @param fullReaction
     * If no specific FullReaction is provided, all will be removed.
     */
    offKickOut(fullReaction?: FullReaction<ChannelReactionOnKickOut>): void {
        this._reactionMap.remove(ChannelEvent.KickOut, fullReaction);
    }
}