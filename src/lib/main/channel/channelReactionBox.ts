/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {ReactionBox} from '../react/reactionBox';
import {ListMap} from '../container/listMap';
import {FullReaction} from '../react/fullReaction';
import {List} from '../container/list';
import {ChannelEvent, ChannelTarget} from './channelDefinitions';

export type ChannelReactionOnPublish<A>        = (data: any, socketSrcSid: undefined | string, eventName: string,chInfo: A) => void | Promise<void>;
export type ChannelReactionOnKickOut<A>        = (message: string | undefined,chInfo: A) => void | Promise<void>;
export type ChannelReactionOnSubscribeFail<A>  = (err: object,chInfo: A) => void | Promise<void>;
export type ChannelReactionOnSubscribe<A>      = (chInfo: A) => void | Promise<void>;
export type ChannelReactionOnUnsubscribe<A>    = (fromClient: boolean,chInfo: A) => void | Promise<void>;

type Filter = (filter: object) => boolean;
interface ChFilter {
    identifier?: string | string[],
    member?: string | string[],
    event?: string | string[] | null
}

class ChannelReactionsBase<A = undefined> {

    private readonly _channelReactionBox: ChannelReactionBox;
    protected readonly _map: ListMap<FullReaction<any>> = new ListMap<FullReaction<any>>();
    protected lastReactionTmp: any;

    constructor(channelReactionBox: ChannelReactionBox) {
        this._channelReactionBox = channelReactionBox;
    }

    /**
     * @internal
     * Used internally.
     */
    get map(): ListMap<FullReaction<any>> {
        return this._map;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Removes publish reaction/s for this channel type.
     * @param fullReaction
     * If no specific reaction is provided, all will be removed.
     */
    offPublish(fullReaction?: FullReaction<ChannelReactionOnPublish<A>,ChFilter>): void {
        this._map.remove(ChannelEvent.Publish, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Removes kickOut reaction/s for this channel type.
     * @param fullReaction
     * If no specific reaction is provided, all will be removed.
     */
    offKickOut(fullReaction?: FullReaction<ChannelReactionOnKickOut<A>,ChFilter>): void {
        this._map.remove(ChannelEvent.KickOut, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Removes subscribe fail reaction/s for this channel type.
     * @param fullReaction
     * If no specific reaction is provided, all will be removed.
     */
    offSubscribeFail(fullReaction?: FullReaction<ChannelReactionOnSubscribeFail<A>,ChFilter>): void {
        this._map.remove(ChannelEvent.SubscribeFail, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Removes subscribe reaction/s for this channel type.
     * @param fullReaction
     * If no specific reaction is provided, all will be removed.
     */
    offSubscribe(fullReaction?: FullReaction<ChannelReactionOnSubscribe<A>,ChFilter>): void {
        this._map.remove(ChannelEvent.Subscribe, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Removes unsubscribe reaction/s for this channel type.
     * @param fullReaction
     * If no specific reaction is provided, all will be removed.
     */
    offUnsubscribe(fullReaction?: FullReaction<ChannelReactionOnUnsubscribe<A>,ChFilter>): void {
        this._map.remove(ChannelEvent.Unsubscribe, fullReaction);
    }

    /**
     * Ends the ChannelFilterReactionManager
     * and returns the ChannelReactionBox.
     */
    end(): ChannelReactionBox {
        return this._channelReactionBox;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the last added Reaction, you can use it to remove the reaction from the box
     * by calling the specific off method.
     * @return
     * It returns the last added Reaction.
     */
    getLastReaction(): any {
        return this.lastReactionTmp;
    }
}


class ZationChannelReactions<A = undefined> extends ChannelReactionsBase<A> {

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on publish.
     * To remove the reaction later, you can use the getLastReaction method which returns
     * the last added reaction and then call the specific off method with this reaction.
     * @example
     * onPublish('myEvent',(data,socketSrcSid,eventName) => {});
     * @param event
     * You can also respond to multiple events by giving an event array.
     * Or to all events if you pass as parameter null.
     * @param reaction
     * @param once
     * Indicates if this reaction should only trigger once.
     */
    onPublish(event: string | string[] | null, reaction: ChannelReactionOnPublish<A>,once: boolean = false): ZationChannelReactions<A> {
        const fullReaction = new FullReaction<ChannelReactionOnPublish<A>>(reaction, {event}, once);
        this._map.add(ChannelEvent.Publish, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on kickOut.
     * To remove the reaction later, you can use the getLastReaction method which returns
     * the last added reaction and then call the specific off method with this reaction.
     * @example
     * onKickOut((message) => {});
     * @param reaction
     * @param once
     * Indicates if this reaction should only trigger once.
     */
    onKickOut(reaction: ChannelReactionOnKickOut<A>,once: boolean = false): ZationChannelReactions<A> {
        const fullReaction = new FullReaction<ChannelReactionOnKickOut<A>>(reaction, {}, once);
        this._map.add(ChannelEvent.KickOut, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    /**
     * @description
     * React on subscribe fail.
     * To remove the reaction later, you can use the getLastReaction method which returns
     * the last added reaction and then call the specific off method with this reaction.
     * @example
     * onSubscribeFail((err) => {});
     * @param reaction
     * @param once
     * Indicates if this reaction should only trigger once.
     */
    onSubscribeFail(reaction: ChannelReactionOnSubscribeFail<A>,once: boolean = false): ZationChannelReactions<A> {
        const fullReaction = new FullReaction<ChannelReactionOnSubscribeFail<A>>(reaction, {}, once);
        this._map.add(ChannelEvent.SubscribeFail, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    /**
     * @description
     * React on subscribe.
     * To remove the reaction later, you can use the getLastReaction method which returns
     * the last added reaction and then call the specific off method with this reaction.
     * @example
     * onSubscribe(() => {});
     * @param reaction
     * @param once
     * Indicates if this reaction should only trigger once.
     */
    onSubscribe(reaction: ChannelReactionOnSubscribe<A>,once: boolean = false): ZationChannelReactions<A> {
        const fullReaction = new FullReaction<ChannelReactionOnSubscribe<A>>(reaction, {}, once);
        this._map.add(ChannelEvent.Subscribe, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    /**
     * @description
     * React on unsubscribe.
     * To remove the reaction later, you can use the getLastReaction method which returns
     * the last added reaction and then call the specific off method with this reaction.
     * @example
     * onUnsubscribe((fromClient) => {});
     * @param reaction
     * @param once
     * Indicates if this reaction should only trigger once.
     */
    onUnsubscribe(reaction: ChannelReactionOnUnsubscribe<A>,once: boolean = false): ZationChannelReactions<A> {
        const fullReaction = new FullReaction<ChannelReactionOnUnsubscribe<A>>(reaction, {}, once);
        this._map.add(ChannelEvent.Unsubscribe, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }
}

class CustomChannelReactions<A = {identifier: string,member: string}> extends ChannelReactionsBase<A> {

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on publish.
     * To remove the reaction later, you can use the getLastReaction method which returns
     * the last added reaction and then call the specific off method with this reaction.
     * @example
     * onPublish({identifier: 'publicChat',member: '342'},'myEvent',(data,socketSrcSid,eventName,chInfo) => {});
     * onPublish({identifier: 'publicChat'},'myEvent',(data,socketSrcSid,eventName,chInfo) => {});
     * @param identifier
     * You can also respond to multiple custom channel identifiers by passing an array of identifiers.
     * Or to all custom channels by providing no specific value.
     * @param member
     * You can also respond to multiple members by passing an array of members.
     * Or to all members by providing no specific value.
     * @param event
     * You can also respond to multiple events by giving an event array.
     * Or to all events if you pass as parameter null.
     * @param reaction
     * @param once
     * Indicates if this reaction should only trigger once.
     */
    onPublish({identifier,member}: {identifier?: string | string[], member?: string | string[]},
              event: string | string[] | null,
              reaction: ChannelReactionOnPublish<A>,
              once: boolean = false): CustomChannelReactions<A>
    {
        const fullReaction = new FullReaction<ChannelReactionOnPublish<A>>(reaction, {identifier,member,event},once);
        this._map.add(ChannelEvent.Publish, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on kickOut.
     * To remove the reaction later, you can use the getLastReaction method which returns
     * the last added reaction and then call the specific off method with this reaction.
     * @example
     * onKickOut({identifier: 'publicChat',member: '342'},(message,chInfo) => {});
     * onKickOut({identifier: 'publicChat'},(message,chInfo) => {});
     * @param identifier
     * You can also respond to multiple custom channel identifiers by passing an array of identifiers.
     * Or to all custom channels by providing no specific value.
     * @param member
     * You can also respond to multiple members by passing an array of members.
     * Or to all members by providing no specific value.
     * @param reaction
     * @param once
     * Indicates if this reaction should only trigger once.
     */
    onKickOut({identifier,member}: {identifier?: string | string[], member?: string | string[]},
              reaction: ChannelReactionOnKickOut<A>,
              once: boolean = false): CustomChannelReactions<A>
    {
        const fullReaction = new FullReaction<ChannelReactionOnKickOut<A>>(reaction, {identifier,member}, once);
        this._map.add(ChannelEvent.KickOut, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    /**
     * @description
     * React on subscribe fail.
     * To remove the reaction later, you can use the getLastReaction method which returns
     * the last added reaction and then call the specific off method with this reaction.
     * @example
     * onSubscribeFail({identifier: 'publicChat',member: '342'},(err,chInfo) => {});
     * onSubscribeFail({identifier: 'publicChat'},(err,chInfo) => {});
     * @param identifier
     * You can also respond to multiple custom channel identifiers by passing an array of identifiers.
     * Or to all custom channels by providing no specific value.
     * @param member
     * You can also respond to multiple members by passing an array of members.
     * Or to all members by providing no specific value.
     * @param reaction
     * @param once
     * Indicates if this reaction should only trigger once.
     */
    onSubscribeFail({identifier,member}: {identifier?: string | string[], member?: string | string[]},
                    reaction: ChannelReactionOnSubscribeFail<A>,
                    once: boolean = false): CustomChannelReactions<A>
    {
        const fullReaction = new FullReaction<ChannelReactionOnSubscribeFail<A>>(reaction, {identifier,member}, once);
        this._map.add(ChannelEvent.SubscribeFail, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    /**
     * @description
     * React on subscribe.
     * To remove the reaction later, you can use the getLastReaction method which returns
     * the last added reaction and then call the specific off method with this reaction.
     * @example
     * onSubscribe({identifier: 'publicChat',member: '342'},(chInfo) => {});
     * onSubscribe({identifier: 'publicChat'},(chInfo) => {});
     * @param identifier
     * You can also respond to multiple custom channel identifiers by passing an array of identifiers.
     * Or to all custom channels by providing no specific value.
     * @param member
     * You can also respond to multiple members by passing an array of members.
     * Or to all members by providing no specific value.
     * @param reaction
     * @param once
     * Indicates if this reaction should only trigger once.
     */
    onSubscribe({identifier,member}: {identifier?: string | string[], member?: string | string[]},
                reaction: ChannelReactionOnSubscribe<A>,
                once: boolean = false): CustomChannelReactions<A>
    {
        const fullReaction = new FullReaction<ChannelReactionOnSubscribe<A>>(reaction, {identifier,member}, once);
        this._map.add(ChannelEvent.Subscribe, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    /**
     * @description
     * React on unsubscribe.
     * To remove the reaction later, you can use the getLastReaction method which returns
     * the last added reaction and then call the specific off method with this reaction.
     * @example
     * onUnsubscribe({identifier: 'publicChat',member: '342'},(fromClient,chInfo) => {});
     * onUnsubscribe({identifier: 'publicChat'},(fromClient,chInfo) => {});
     * @param identifier
     * You can also respond to multiple custom channel identifiers by passing an array of identifiers.
     * Or to all custom channels by providing no specific value.
     * @param member
     * You can also respond to multiple members by passing an array of members.
     * Or to all members by providing no specific value.
     * @param reaction
     * @param once
     * Indicates if this reaction should only trigger once.
     */
    onUnsubscribe({identifier,member}: {identifier?: string | string[], member?: string | string[]},
                  reaction: ChannelReactionOnUnsubscribe<A>,
                  once: boolean = false): CustomChannelReactions<A>
    {
        const fullReaction = new FullReaction<ChannelReactionOnUnsubscribe<A>>(reaction, {identifier,member}, once);
        this._map.add(ChannelEvent.Unsubscribe, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }
}

export class ChannelReactionBox extends ReactionBox<ChannelReactionBox>
{
    private readonly _userChReactions: ZationChannelReactions = new ZationChannelReactions(this);
    private readonly _authUserGroupChReactions: ZationChannelReactions = new ZationChannelReactions(this);
    private readonly _defaultUserGroupChReactions: ZationChannelReactions = new ZationChannelReactions(this);
    private readonly _allChReactions: ZationChannelReactions = new ZationChannelReactions(this);
    private readonly _panelChReactions: ZationChannelReactions = new ZationChannelReactions(this);
    private readonly _customChReactions: CustomChannelReactions = new CustomChannelReactions(this);

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Creates a new ChannelReactionBox.
     * This box can be linked to the zation client.
     */
    constructor() {
        super();
        this.self = this;
    }

    /**
     * Add reactions to user channel.
     */
    get userCh(): ZationChannelReactions {
        return this._userChReactions;
    }

    /**
     * Add reactions to auth user group channel.
     */
    get authUserGroupCh(): ZationChannelReactions {
        return this._authUserGroupChReactions;
    }

    /**
     * Add reactions to default user group channel.
     */
    get defaultUserGroupCh(): ZationChannelReactions {
        return this._defaultUserGroupChReactions;
    }

    /**
     * Add reactions to all channel.
     */
    get allCh(): ZationChannelReactions {
        return this._allChReactions;
    }

    /**
     * Add reactions to panel channel.
     */
    get panelCh(): ZationChannelReactions {
        return this._panelChReactions;
    }

    /**
     * Add reactions to a custom channel/s.
     */
    get customCh(): CustomChannelReactions {
        return this._customChReactions;
    }

    private async _triggerReactions(list: List<any>, filter: Filter, ...data: any[]) {
        await list.forEachParallel(async (reaction: FullReaction<any>) => {
            if (filter(reaction.getFilter())) {
                if(reaction.isOnce()){
                    list.removeItem(reaction);
                }
                await reaction.getReactionHandler()(...data);
            }
        });
    }

    private async _triggerAllReactions(box: List<any>, ...data: any[]) {
        await box.forEachParallel(async (reaction: FullReaction<any>) => {
            if(reaction.isOnce()){
                box.removeItem(reaction);
            }
            await reaction.getReactionHandler()(...data);
        });
    }

    private static _multiFilter(definition, value): boolean {
        if (definition == undefined) {
            return true;
        } else if (Array.isArray(definition)) {
            return definition.indexOf(value) !== -1;
        } else {
            return definition === value;
        }
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @internal
     * @description
     * Used internally.
     * Only use this method carefully.
     */
    async _triggerPub(target: ChannelTarget, event: string, data: any,
                      {identifier,member,chName}: {identifier?: string,member?: string,chName?: string},
                      sSid?: string): Promise<void>
    {
        if(this.active) {
            const list = this._tryGetReactionList(target,ChannelEvent.Publish);
            if(list) {
                if (target === ChannelTarget.Custom) {
                    const filter: Filter = (filter: ChFilter): boolean => ChannelReactionBox._multiFilter(filter.event,event) &&
                        ChannelReactionBox._multiFilter(filter.identifier,identifier) && ChannelReactionBox._multiFilter(filter.member,member);
                    await this._triggerReactions(list,filter,data,sSid,event,{identifier,member});
                } else {
                    const filter: Filter = (filter: ChFilter): boolean =>
                        ChannelReactionBox._multiFilter(filter.event,event);
                    await this._triggerAllReactions(list,filter,data,sSid,event);
                }
            }
        }
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @internal
     * @description
     * Used internally.
     * Only use this method carefully.
     */
    async _triggerEvent(target: ChannelTarget, event: ChannelEvent,
                        {identifier,member,chName}: {identifier?: string,member?: string,chName?: string},
                        ...args: any[]): Promise<void>
    {
        if(this.active) {
            const list = this._tryGetReactionList(target,event);
            if(list) {
                if (target === ChannelTarget.Custom) {
                    const filter: Filter = (filter: ChFilter): boolean => {
                        return ChannelReactionBox._multiFilter(filter.identifier,identifier) &&
                            ChannelReactionBox._multiFilter(filter.member,member);
                    };
                    await this._triggerReactions(list,filter,...args,{identifier,member});
                } else {
                    await this._triggerAllReactions(list,...args);
                }
            }
        }
    }

    private _tryGetReactionList(target: ChannelTarget, event: ChannelEvent): List<FullReaction<any>> | undefined {
        switch (target) {
            case ChannelTarget.Custom:
                return this._customChReactions.map.tryGet(event);
            case ChannelTarget.User:
                return this._userChReactions.map.tryGet(event);
            case ChannelTarget.Aug:
                return this._authUserGroupChReactions.map.tryGet(event);
            case ChannelTarget.Dug:
                return this._defaultUserGroupChReactions.map.tryGet(event);
            case ChannelTarget.All:
                return this._allChReactions.map.tryGet(event);
            case ChannelTarget.Panel:
                return this._panelChReactions.map.tryGet(event);
        }
    }
}