/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {ChannelEngine}                         from "./channelEngine";
import ConnectionUtils, {ConnectTimeoutOption} from "../utils/connectionUtils";
// noinspection ES6PreferShortImport
import {ZationClient}                          from "../../core/zationClient";
import {FullReaction}                          from "../react/fullReaction";
import {ListMap}                               from "../container/listMap";
import {List}                                  from "../container/list";
import {stringifyMember}                       from '../utils/memberStringify';
import {DeepReadonly, Writable}                from '../utils/typeUtils';
import {deepClone}                             from '../utils/cloneUtils';
import {deepFreeze}                            from '../utils/deepFreeze';

export const enum ChannelSubscribeState {
    Unsubscribed,
    Subscribed,
    Pending
}

export type ChannelReactionOnPublish<M,D>   = (data: D) => void | Promise<void>;
export type ChannelReactionOnSubscribe<M>   = () => void | Promise<void>;
export type ChannelReactionOnUnsubscribe<M> = (reason: UnsubscribeReason) => void | Promise<void>;
export type ChannelReactionOnKickOut<M>     = (code?: number | string | undefined,data?: any) => void | Promise<void>;
export type ChannelReactionOnClose<M>       = (code?: number | string | undefined,data?: any) => void | Promise<void>;

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

export default class Channel<M = any, PEvents = Record<string,any>> {

    private readonly _client: ZationClient;
    private readonly _channelEngine: ChannelEngine;

    /**
     * @internal
     */
    readonly _chId?: string;

    protected _state: ChannelSubscribeState = ChannelSubscribeState.Unsubscribed;
    public readonly member: DeepReadonly<M> | undefined;
    private _memberStr: string | undefined;

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
     * Subscribe to this channel.
     * If you access a ChannelFamily you need to provide a member as a first parameter.
     * If the subscription was successful the method will not throw an error.
     * Notice that if the channel is already subscribed and you provide a different member,
     * the previously subscribed member will be unsubscribed first.
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
        if(member !== undefined) {
            member = deepFreeze(deepClone(member));
            memberStr = stringifyMember(member);
        }

        await ConnectionUtils.checkConnection(this._client,connectTimeout);

        if(memberStr !== this._memberStr) await this.unsubscribe();
        if(this._state === ChannelSubscribeState.Subscribed) return;

        (this as Writable<Channel<M>>).member = member as DeepReadonly<M> | undefined;
        this._memberStr = memberStr;

        await this._channelEngine.trySubscribe(this._identifier,this._apiLevel,member,this);
        this._state = ChannelSubscribeState.Subscribed;
        this._triggerEvent<ChannelReactionOnSubscribe<M>>(ChannelEvent.Subscribe);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns if the channel is subscribed.
     * @param includePendingState
     */
    isSubscribed(includePendingState: boolean = false): boolean {
        return this._state === ChannelSubscribeState.Subscribed ||
            (includePendingState && this._state === ChannelSubscribeState.Pending);
    }

    /**
     * Unsubscribe this channel.
     * This is important to clear resources and avoid the trying of
     * resubscribing in case of reconnections or kick-outs.
     */
    unsubscribe() {
        if(this._state !== ChannelSubscribeState.Unsubscribed && this._chId != null) {
            this._channelEngine.unsubscribe(this._chId,this);
            (this as Writable<Channel<M>>).member = undefined;
            this._memberStr = undefined;
            this._state = ChannelSubscribeState.Unsubscribed;
            this._triggerEvent<ChannelReactionOnUnsubscribe<M>>(ChannelEvent.Unsubscribe,UnsubscribeReason.Client);
        }
    }

    /**
     * @internal
     * @private
     */
    _triggerResubscription() {
        const oldState = this._state;
        this._state = ChannelSubscribeState.Subscribed;
        if(oldState !== ChannelSubscribeState.Subscribed)
            this._triggerEvent<ChannelReactionOnSubscribe<M>>(ChannelEvent.Subscribe);
    }


    /**
     * @internal
     * @private
     */
    _triggerPublish(event: string,data: any) {
        if(this._state !== ChannelSubscribeState.Subscribed) return;

        const list = this._reactionMap.tryGet(ChannelEvent.Publish);
        if(!list) return;
        (async () => {
            try {
                await this._triggerReactionsList<ChannelReactionOnPublish<M,any>>(list,
                    (filter: ChFilter): boolean => filter.event === event,data);
            }
            catch (e) {}
        })();
    }

    /**
     * @internal
     * @private
     */
    _triggerKickOut(code: number | string | undefined,data: any) {
        const oldState = this._state;
        this._state = ChannelSubscribeState.Pending;
        this._triggerEvent<ChannelReactionOnKickOut<M>>(ChannelEvent.KickOut,code,data);
        if(oldState === ChannelSubscribeState.Subscribed){
            this._triggerEvent<ChannelReactionOnUnsubscribe<M>>
                (ChannelEvent.Unsubscribe,UnsubscribeReason.KickOut);
        }
    }

    /**
     * @internal
     * @private
     */
    _triggerClose(code: number | string | undefined,data: any) {
        const oldState = this._state;
        this._state = ChannelSubscribeState.Unsubscribed;
        this._triggerEvent<ChannelReactionOnClose<M>>(ChannelEvent.Close,code,data);
        if(oldState === ChannelSubscribeState.Subscribed){
            this._triggerEvent<ChannelReactionOnUnsubscribe<M>>
            (ChannelEvent.Unsubscribe,UnsubscribeReason.Close);
        }
    }

    /**
     * @internal
     * @private
     */
    _triggerConnectionLost() {
        const oldState = this._state;
        this._state = ChannelSubscribeState.Pending;
        if(oldState === ChannelSubscribeState.Subscribed){
            this._triggerEvent<ChannelReactionOnUnsubscribe<M>>
            (ChannelEvent.Unsubscribe,UnsubscribeReason.Disconnect);
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
    onPublish<E extends keyof PEvents>(event: E,reaction: ChannelReactionOnPublish<M,PEvents[E]>): FullReaction<ChannelReactionOnPublish<M,PEvents[E]>> {
        const fullReaction = new FullReaction<ChannelReactionOnPublish<M,PEvents[E]>>(reaction,{event} as ChFilter)
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
    oncePublish<E extends keyof PEvents>(event: E,reaction: ChannelReactionOnPublish<M,PEvents[E]>): FullReaction<ChannelReactionOnPublish<M,PEvents[E]>> {
        const fullReaction = new FullReaction<ChannelReactionOnPublish<M,PEvents[E]>>(reaction,{event} as ChFilter,true)
        this._reactionMap.add(ChannelEvent.Publish, fullReaction);
        return fullReaction;
    }

    /**
     * @description
     * Removes on/once publish reaction/s.
     * @param fullReaction
     * If no specific FullReaction is provided, all will be removed.
     */
    offPublish(fullReaction?: FullReaction<ChannelReactionOnPublish<M,any>>): void {
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