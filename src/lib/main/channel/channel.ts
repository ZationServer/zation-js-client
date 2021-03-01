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
import {stringifyMember}                       from '../utils/memberParser';
import {DeepReadonly}                          from '../utils/typeUtils';
import {deepClone}                             from '../utils/cloneUtils';
import {deepFreeze}                            from '../utils/deepFreeze';

export const enum ChannelSubscribeState {
    Subscribed,
    Pending
}

export interface ChannelSubscribeInfo<M> {
    state: ChannelSubscribeState,
    memberStr?: string,
    member?: DeepReadonly<M>
}

export type ChannelReactionOnPublish<M>     = (data: any,member?: DeepReadonly<M>) => void | Promise<void>;
export type ChannelReactionOnSubscribe<M>   = (member?: DeepReadonly<M>) => void | Promise<void>;
export type ChannelReactionOnUnsubscribe<M> = (reason: UnsubscribeReason,member?: DeepReadonly<M>) => void | Promise<void>;
export type ChannelReactionOnKickOut<M>     = (member?: DeepReadonly<M>,code?: number | string | undefined,data?: any) => void | Promise<void>;
export type ChannelReactionOnClose<M>       = (member?: DeepReadonly<M>,code?: number | string | undefined,data?: any) => void | Promise<void>;

const enum ChannelEvent {
    Publish,
    Subscribe,
    Unsubscribe,
    KickOut,
    Close
}
type ReactionFilter = (filter: object) => boolean;
interface ChFilter {
    event?: string
}

export enum UnsubscribeReason {
    Client,
    KickOut,
    Disconnect,
    Close
}

export default class Channel<M = string> {

    private readonly _client: ZationClient;
    private readonly _channelEngine: ChannelEngine;

    private _chId?: string = undefined;
    private readonly _states: Map<string,ChannelSubscribeInfo<M>> = new Map();
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
     * If the channel is closed from the server-side, the client will
     * remove the specific channel and not resubscribe it again.
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
    async subscribe(member?: M,connectTimeout: ConnectTimeoutOption = undefined): Promise<void> {
        let memberStr: string | undefined = undefined;
        let chMember: {member: M, memberStr: string} | undefined = undefined;
        if(member !== undefined) {
            member = deepFreeze(deepClone(member));
            memberStr = stringifyMember(member);
            chMember = {member,memberStr};
        }

        await ConnectionUtils.checkConnection(this._client,connectTimeout);

        const {chId,fullChId} = await this._channelEngine.trySubscribe
            (this._identifier,this._apiLevel,chMember,this);

        const newSub = !this._hasSubscribed(memberStr,false);
        this._states.set(fullChId,{member: member as DeepReadonly<M> | undefined,
            memberStr,state: ChannelSubscribeState.Subscribed});
        this._setChId(chId);

        if(newSub) this._triggerEvent<ChannelReactionOnSubscribe<M>>
            (ChannelEvent.Subscribe,member as DeepReadonly<M> | undefined);
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
    async subscribeNew(member?: M,connectTimeout: ConnectTimeoutOption = undefined): Promise<void> {
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
    hasSubscribed(member?: M, includePending: boolean = false): boolean {
        return this._hasSubscribed(member !== undefined ? stringifyMember(member) : undefined);
    }

    /**
     * Returns if a specific channel is subscribed.
     * @internal
     * @param memberStr
     * @param includePending
     * @private
     */
    private _hasSubscribed(memberStr?: string,includePending: boolean = false): boolean {
        const info = this._states.get(buildFullChId(this._chId,memberStr));
        return !!info && (info.state === ChannelSubscribeState.Subscribed);
    }

    /**
     * Unsubscribe this channel.
     * In case of a channel family all members or only a specific member.
     * This is important to clear resources and avoid the trying of
     * resubscribing in case of reconnections or kick-outs.
     * @param member
     */
    unsubscribe(member?: M) {
        if(member === undefined) {
            for(const [fullChId, info] of this._states){
                this._unsubscribe(fullChId,info.member);
            }
        }
        else {
            const memberStr = stringifyMember(member);
            for(const [fullChId, info] of this._states){
                if(info.memberStr === memberStr) this._unsubscribe(fullChId,info.member);
            }
        }
        if(this._states.size <= 0) this._deleteChId();
    }

    private _unsubscribe(fullChId: string,member?: DeepReadonly<M>) {
        this._channelEngine.unsubscribe(fullChId,this);
        this._states.delete(fullChId);
        this._triggerEvent<ChannelReactionOnUnsubscribe<M>>(ChannelEvent.Unsubscribe,UnsubscribeReason.Client,member);
    }

    /**
     * @internal
     * @param fullChId
     * @private
     */
    _triggerSubscription(fullChId: string) {
        const info = this._states.get(fullChId);
        if(info) {
            const oldState = info.state;
            info.state = ChannelSubscribeState.Subscribed;
            if(oldState === ChannelSubscribeState.Pending)
                this._triggerEvent<ChannelReactionOnSubscribe<M>>(ChannelEvent.Subscribe,info.member);
        }
    }

    /**
     * @internal
     * @private
     */
    _triggerPublish(memberStr: string | undefined,event: string,data: any) {
        //check has subscribed
        const info = this._states.get(buildFullChId(this.chId,memberStr));
        if(!info) return;

        const list = this._reactionMap.tryGet(ChannelEvent.Publish);
        if(!list) return;
        (async () => {
            try {
                await this._triggerReactionsList<ChannelReactionOnPublish<M>>(list,
                    (filter: ChFilter): boolean => filter.event === event,data,info.member);
            }
            catch (e) {}
        })();
    }

    /**
     * @internal
     * @private
     */
    _triggerKickOut(memberStr: string | undefined,code: number | string | undefined,data: any) {
        const info = this._states.get(buildFullChId(this.chId,memberStr));
        if(info){
            const oldState = info.state;
            info.state = ChannelSubscribeState.Pending;
            this._triggerEvent<ChannelReactionOnKickOut<M>>(ChannelEvent.KickOut,info.member,code,data);
            if(oldState === ChannelSubscribeState.Subscribed){
                this._triggerEvent<ChannelReactionOnUnsubscribe<M>>
                    (ChannelEvent.Unsubscribe,UnsubscribeReason.KickOut,info.member);
            }
        }
    }

    /**
     * @internal
     * @private
     */
    _triggerClose(memberStr: string | undefined,code: number | string | undefined,data: any) {
        const fullChId = buildFullChId(this.chId,memberStr);
        const info = this._states.get(fullChId);
        if(info){
            const oldState = info.state;
            this._states.delete(fullChId);
            if(this._states.size <= 0) this._deleteChId();

            this._triggerEvent<ChannelReactionOnClose<M>>(ChannelEvent.Close,info.member,code,data);
            if(oldState === ChannelSubscribeState.Subscribed){
                this._triggerEvent<ChannelReactionOnUnsubscribe<M>>
                    (ChannelEvent.Unsubscribe,UnsubscribeReason.Close,info.member);
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
                this._triggerEvent<ChannelReactionOnUnsubscribe<M>>
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
            try {await this._channelEngine.trySubscribe(this._identifier,this._apiLevel,(info.member !== undefined ? {
                memberStr: info.memberStr!,
                member: info.member!
            } : undefined));}
            catch (_) {}
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
     * onPublish((data: any,member?: DeepReadonly<M>) => {});
     * @param event
     * @param reaction
     */
    onPublish(event: string,reaction: ChannelReactionOnPublish<M>): FullReaction<ChannelReactionOnPublish<M>> {
        const fullReaction = new FullReaction<ChannelReactionOnPublish<M>>(reaction,{event} as ChFilter)
        this._reactionMap.add(ChannelEvent.Publish, fullReaction);
        return fullReaction;
    }

    /**
     * @description
     * React once publish.
     * To remove the reaction later, you can use the
     * specific off method with the returned FullReaction.
     * @example
     * oncePublish((data: any,member?: DeepReadonly<M>) => {});
     * @param event
     * @param reaction
     */
    oncePublish(event: string,reaction: ChannelReactionOnPublish<M>): FullReaction<ChannelReactionOnPublish<M>> {
        const fullReaction = new FullReaction<ChannelReactionOnPublish<M>>(reaction,{event} as ChFilter,true)
        this._reactionMap.add(ChannelEvent.Publish, fullReaction);
        return fullReaction;
    }

    /**
     * @description
     * Removes on/once publish reaction/s.
     * @param fullReaction
     * If no specific FullReaction is provided, all will be removed.
     */
    offPublish(fullReaction?: FullReaction<ChannelReactionOnPublish<M>>): void {
        this._reactionMap.remove(ChannelEvent.Publish, fullReaction);
    }

    /**
     * @description
     * React on subscribe.
     * To remove the reaction later, you can use the
     * specific off method with the returned FullReaction.
     * @example
     * onSubscribe((member?: DeepReadonly<M>) => {});
     * @param reaction
     */
    onSubscribe(reaction: ChannelReactionOnSubscribe<M>): FullReaction<ChannelReactionOnSubscribe<M>> {
        const fullReaction = new FullReaction<ChannelReactionOnSubscribe<M>>(reaction,{})
        this._reactionMap.add(ChannelEvent.Subscribe, fullReaction);
        return fullReaction;
    }

    /**
     * @description
     * React once subscribe.
     * To remove the reaction later, you can use the
     * specific off method with the returned FullReaction.
     * @example
     * onceSubscribe((member?: DeepReadonly<M>) => {});
     * @param reaction
     */
    onceSubscribe(reaction: ChannelReactionOnSubscribe<M>): FullReaction<ChannelReactionOnSubscribe<M>> {
        const fullReaction = new FullReaction<ChannelReactionOnSubscribe<M>>(reaction,{},true)
        this._reactionMap.add(ChannelEvent.Subscribe, fullReaction);
        return fullReaction;
    }

    /**
     * @description
     * Removes on/once subscribe reaction/s.
     * @param fullReaction
     * If no specific FullReaction is provided, all will be removed.
     */
    offSubscribe(fullReaction?: FullReaction<ChannelReactionOnSubscribe<M>>): void {
        this._reactionMap.remove(ChannelEvent.Subscribe, fullReaction);
    }

    /**
     * @description
     * React on unsubscribe.
     * To remove the reaction later, you can use the
     * specific off method with the returned FullReaction.
     * @example
     * onUnsubscribe((member?: DeepReadonly<M>) => {});
     * @param reaction
     */
    onUnsubscribe(reaction: ChannelReactionOnUnsubscribe<M>): FullReaction<ChannelReactionOnUnsubscribe<M>> {
        const fullReaction = new FullReaction<ChannelReactionOnUnsubscribe<M>>(reaction,{})
        this._reactionMap.add(ChannelEvent.Unsubscribe, fullReaction);
        return fullReaction;
    }

    /**
     * @description
     * React once unsubscribe.
     * To remove the reaction later, you can use the
     * specific off method with the returned FullReaction.
     * @example
     * onceUnsubscribe((member?: DeepReadonly<M>) => {});
     * @param reaction
     */
    onceUnsubscribe(reaction: ChannelReactionOnUnsubscribe<M>): FullReaction<ChannelReactionOnUnsubscribe<M>> {
        const fullReaction = new FullReaction<ChannelReactionOnUnsubscribe<M>>(reaction,{},true)
        this._reactionMap.add(ChannelEvent.Unsubscribe, fullReaction);
        return fullReaction;
    }

    /**
     * @description
     * Removes on/once unsubscribe reaction/s.
     * @param fullReaction
     * If no specific FullReaction is provided, all will be removed.
     */
    offUnsubscribe(fullReaction?: FullReaction<ChannelReactionOnUnsubscribe<M>>): void {
        this._reactionMap.remove(ChannelEvent.Unsubscribe, fullReaction);
    }

    /**
     * @description
     * React on kick out.
     * To remove the reaction later, you can use the
     * specific off method with the returned FullReaction.
     * @example
     * onKickOut((member?: DeepReadonly<M>,code?: number | string,data?: any) => {});
     * @param reaction
     */
    onKickOut(reaction: ChannelReactionOnKickOut<M>): FullReaction<ChannelReactionOnKickOut<M>> {
        const fullReaction = new FullReaction<ChannelReactionOnKickOut<M>>(reaction,{})
        this._reactionMap.add(ChannelEvent.KickOut, fullReaction);
        return fullReaction;
    }

    /**
     * @description
     * React once kick out.
     * To remove the reaction later, you can use the
     * specific off method with the returned FullReaction.
     * @example
     * onceKickOut((member?: DeepReadonly<M>,code?: number | string,data?: any) => {});
     * @param reaction
     */
    onceKickOut(reaction: ChannelReactionOnKickOut<M>): FullReaction<ChannelReactionOnKickOut<M>> {
        const fullReaction = new FullReaction<ChannelReactionOnKickOut<M>>(reaction,{},true)
        this._reactionMap.add(ChannelEvent.KickOut, fullReaction);
        return fullReaction;
    }

    /**
     * @description
     * Removes on/once kick out reaction/s.
     * @param fullReaction
     * If no specific FullReaction is provided, all will be removed.
     */
    offKickOut(fullReaction?: FullReaction<ChannelReactionOnKickOut<M>>): void {
        this._reactionMap.remove(ChannelEvent.KickOut, fullReaction);
    }

    /**
     * @description
     * React on close.
     * To remove the reaction later, you can use the
     * specific off method with the returned FullReaction.
     * @example
     * onClose((member?: DeepReadonly<M>,code?: number | string,data?: any) => {});
     * @param reaction
     */
    onClose(reaction: ChannelReactionOnClose<M>): FullReaction<ChannelReactionOnClose<M>> {
        const fullReaction = new FullReaction<ChannelReactionOnClose<M>>(reaction,{})
        this._reactionMap.add(ChannelEvent.Close, fullReaction);
        return fullReaction;
    }

    /**
     * @description
     * React once close.
     * To remove the reaction later, you can use the
     * specific off method with the returned FullReaction.
     * @example
     * onceClose((member?: DeepReadonly<M>,code?: number | string,data?: any) => {});
     * @param reaction
     */
    onceClose(reaction: ChannelReactionOnClose<M>): FullReaction<ChannelReactionOnClose<M>> {
        const fullReaction = new FullReaction<ChannelReactionOnClose<M>>(reaction,{},true)
        this._reactionMap.add(ChannelEvent.Close, fullReaction);
        return fullReaction;
    }

    /**
     * @description
     * Removes on/once close reaction/s.
     * @param fullReaction
     * If no specific FullReaction is provided, all will be removed.
     */
    offClose(fullReaction?: FullReaction<ChannelReactionOnClose<M>>): void {
        this._reactionMap.remove(ChannelEvent.Close, fullReaction);
    }
}