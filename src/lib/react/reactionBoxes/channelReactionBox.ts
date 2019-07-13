/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {
    ChannelReactionOnClientUnsubAnyCh,
    ChannelReactionOnClientUnsubCustomCh,
    ChannelReactionOnClientUnsubZationCh,
    ChannelReactionOnKickOutAnyCh,
    ChannelReactionOnKickOutCustomCh,
    ChannelReactionOnKickOutZationCh,
    ChannelReactionOnPubAnyCh,
    ChannelReactionOnPubCustomCh,
    ChannelReactionOnPubZationCh,
    ChannelReactionOnSubAnyCh,
    ChannelReactionOnSubCustomCh,
    ChannelReactionOnSubFailAnyCh,
    ChannelReactionOnSubFailCustomCh,
    ChannelReactionOnSubFailZationCh,
    ChannelReactionOnSubZationCh,
    ChannelReactionOnUnsubAnyCh,
    ChannelReactionOnUnsubCustomCh,
    ChannelReactionOnUnsubZationCh
} from "../reaction/reactionHandler";
import {ChannelTarget} from "../../helper/channel/channelTarget";
import {ReactionBox}   from "./reactionBox";
import {SBoxMapper}    from "../../helper/box/sBoxMapper";
import {FullReaction}  from "../reaction/fullReaction";
import {SBox}          from "../../helper/box/sBox";

type ValidChecker = (filter : object) => boolean;

interface ChFilter {
    id ?: string,
    name ?: string,
    event ?: string
}

export class ChannelReactionBox extends ReactionBox<ChannelReactionBox>
{

    private readonly _mapPub: SBoxMapper<FullReaction<any>> = new SBoxMapper<FullReaction<any>>();
    private readonly _mapKick: SBoxMapper<FullReaction<any>> = new SBoxMapper<FullReaction<any>>();
    private readonly _mapSubFail: SBoxMapper<FullReaction<any>> = new SBoxMapper<FullReaction<any>>();
    private readonly _mapSub: SBoxMapper<FullReaction<any>> = new SBoxMapper<FullReaction<any>>();
    private readonly _mapClientUnsub: SBoxMapper<FullReaction<any>> = new SBoxMapper<FullReaction<any>>();
    private readonly _mapUnsub: SBoxMapper<FullReaction<any>> = new SBoxMapper<FullReaction<any>>();

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

    //OnPub Handler
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on publish for any channel.
     * @example
     * onPubAnyCh('myEvent',(data,socketSrcSid,eventName,fullChName) => {});
     * @param event
     * You can also respond to multiple events by giving an event array.
     * Or to all events if you pass as parameter null.
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onPubAnyCh(event: string | string[] | null, reaction: ChannelReactionOnPubAnyCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnPubAnyCh>(reaction, {event: event});
        this._mapPub.add(ChannelTarget.ANY, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on publish for any channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * oncePubAnyCh('myEvent',(data,socketSrcSid,eventName,fullChName) => {});
     * @param event
     * You can also respond to multiple events by giving an event array.
     * Or to all events if you pass as parameter null.
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    oncePubAnyCh(event: string | string[] | null, reaction: ChannelReactionOnPubAnyCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnPubAnyCh>(reaction, {event: event},true);
        this._mapPub.add(ChannelTarget.ANY, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on publish reaction for any channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offPubAnyCh(fullReaction ?: FullReaction<any>): void {
        this._mapPub.remove(ChannelTarget.ANY, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on publish for the user channel.
     * @example
     * onPubUserCh('myEvent',(data,socketSrcSid,event) => {});
     * @param event
     * You can also respond to multiple events by giving an event array.
     * Or to all events if you pass as parameter null.
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onPubUserCh(event: string | string[] | null, reaction: ChannelReactionOnPubZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnPubZationCh>(reaction, {event: event});
        this._mapPub.add(ChannelTarget.USER, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on publish for the user channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * oncePubUserCh('myEvent',(data,socketSrcSid,event) => {});
     * @param event
     * You can also respond to multiple events by giving an event array.
     * Or to all events if you pass as parameter null.
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    oncePubUserCh(event: string | string[] | null, reaction: ChannelReactionOnPubZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnPubZationCh>(reaction, {event: event},true);
        this._mapPub.add(ChannelTarget.USER, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on publish reaction for user channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offPubUserCh(fullReaction ?: FullReaction<any>): void {
        this._mapPub.remove(ChannelTarget.USER, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on publish for the auth user group channel.
     * @example
     * onPubAuthUserGroupCh('myEvent',(data,socketSrcSid,event) => {});
     * @param event
     * You can also respond to multiple events by giving an event array.
     * Or to all events if you pass as parameter null.
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onPubAuthUserGroupCh(event: string | string[] | null, reaction: ChannelReactionOnPubZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnPubZationCh>(reaction, {event: event});
        this._mapPub.add(ChannelTarget.AUG, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on publish for the auth user group channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * oncePubAuthUserGroupCh('myEvent',(data,socketSrcSid,event) => {});
     * @param event
     * You can also respond to multiple events by giving an event array.
     * Or to all events if you pass as parameter null.
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    oncePubAuthUserGroupCh(event: string | string[] | null, reaction: ChannelReactionOnPubZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnPubZationCh>(reaction, {event: event},true);
        this._mapPub.add(ChannelTarget.AUG, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on publish reaction for auth user group channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offPubAuthUserGroupCh(fullReaction ?: FullReaction<any>): void {
        this._mapPub.remove(ChannelTarget.AUG, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on publish for the default user group channel.
     * @example
     * onPubDefaultUserGroupCh('myEvent',(data,socketSrcSid,event) => {});
     * @param event
     * You can also respond to multiple events by giving an event array.
     * Or to all events if you pass as parameter null.
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onPubDefaultUserGroupCh(event: string | string[] | null, reaction: ChannelReactionOnPubZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnPubZationCh>(reaction, {event: event});
        this._mapPub.add(ChannelTarget.DUG, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on publish for the default user group channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * oncePubDefaultUserGroupCh('myEvent',(data,socketSrcSid,event) => {});
     * @param event
     * You can also respond to multiple events by giving an event array.
     * Or to all events if you pass as parameter null.
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    oncePubDefaultUserGroupCh(event: string | string[] | null, reaction: ChannelReactionOnPubZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnPubZationCh>(reaction, {event: event},true);
        this._mapPub.add(ChannelTarget.DUG, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on publish reaction for default user group channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offPubDefaultUserGroupCh(fullReaction ?: FullReaction<any>): void {
        this._mapPub.remove(ChannelTarget.DUG, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on publish for the all channel.
     * @example
     * onPubAllCh('myEvent',(data,socketSrcSid,event) => {});
     * @param event
     * You can also respond to multiple events by giving an event array.
     * Or to all events if you pass as parameter null.
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onPubAllCh(event: string | string[] | null, reaction: ChannelReactionOnPubZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnPubZationCh>(reaction, {event: event});
        this._mapPub.add(ChannelTarget.ALL, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on publish for the all channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * oncePubAllCh('myEvent',(data,socketSrcSid,event) => {});
     * @param event
     * You can also respond to multiple events by giving an event array.
     * Or to all events if you pass as parameter null.
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    oncePubAllCh(event: string | string[] | null, reaction: ChannelReactionOnPubZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnPubZationCh>(reaction, {event: event},true);
        this._mapPub.add(ChannelTarget.ALL, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on publish reaction for all channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offPubAllCh(fullReaction ?: FullReaction<any>): void {
        this._mapPub.remove(ChannelTarget.ALL, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on publish for an custom channel.
     * @example
     * onPubCustomCh({name : 'name',id : 'id'},'myEvent',(data,socketSrcSid,event,name,id) => {});
     * onPubCustomCh({name : 'name'},'myEvent',(data,socketSrcSid,event,name,id) => {});
     * @param name
     * You can also respond to multiple channel names by giving an channel name array.
     * Or to all channel names by providing no specific name.
     * @param id
     * You can also respond to multiple channel ids by giving an channel id array.
     * Or to all channel ids by providing no specific id.
     * @param event
     * You can also respond to multiple events by giving an event array.
     * Or to all events if you pass as parameter null.
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onPubCustomCh({name,id} : {name ?: string | string[], id ?: string | string[]},event: string | string[] | null,reaction: ChannelReactionOnPubCustomCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnPubCustomCh>(reaction, {name, event, id});
        this._mapPub.add(ChannelTarget.C, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on publish for an custom channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * oncePubCustomCh({name : 'name',id : 'id'},'myEvent',(data,socketSrcSid,event,name,id) => {});
     * oncePubCustomCh({name : 'name'},'myEvent',(data,socketSrcSid,event,name,id) => {});
     * @param name
     * You can also respond to multiple channel names by giving an channel name array.
     * Or to all channel names by providing no specific name.
     * @param id
     * You can also respond to multiple channel ids by giving an channel id array.
     * Or to all channel ids by providing no specific id.
     * @param event
     * You can also respond to multiple events by giving an event array.
     * Or to all events if you pass as parameter null.
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    oncePubCustomCh({name,id} : {name ?: string | string[], id ?: string | string[]},event: string | string[] | null,reaction: ChannelReactionOnPubCustomCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnPubCustomCh>(reaction, {name, event, id},true);
        this._mapPub.add(ChannelTarget.C, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on publish reaction for an custom channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offPubCustomCh(fullReaction ?: FullReaction<any>): void {
        this._mapPub.remove(ChannelTarget.C, fullReaction);
    }


    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on publish for the panel out channel.
     * @example
     * onPubPanelOutCh('myEvent',(data,socketSrcSid,event) => {});
     * @param event
     * You can also respond to multiple events by giving an event array.
     * Or to all events if you pass as parameter null.
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onPubPanelOutCh(event: string | string[] | null, reaction: ChannelReactionOnPubZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnPubZationCh>(reaction, {event: event});
        this._mapPub.add(ChannelTarget.PANEL, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on publish for the panel out channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * oncePubPanelOutCh('myEvent',(data,socketSrcSid,event) => {});
     * @param event
     * You can also respond to multiple events by giving an event array.
     * Or to all events if you pass as parameter null.
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    oncePubPanelOutCh(event: string | string[] | null, reaction: ChannelReactionOnPubZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnPubZationCh>(reaction, {event: event},true);
        this._mapPub.add(ChannelTarget.PANEL, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on publish reaction for panel out channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offPubPanelOutCh(fullReaction ?: FullReaction<any>): void {
        this._mapPub.remove(ChannelTarget.PANEL, fullReaction);
    }

    //OnKickOut Handler
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on kick out for any channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceKickOutAnyCh((message,fullChName) => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceKickOutAnyCh(reaction: ChannelReactionOnKickOutAnyCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnKickOutAnyCh>(reaction,{},true);
        this._mapKick.add(ChannelTarget.ANY, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on kick out for any channel.
     * @example
     * onKickOutAnyCh((message,fullChName) => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onKickOutAnyCh(reaction: ChannelReactionOnKickOutAnyCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnKickOutAnyCh>(reaction);
        this._mapKick.add(ChannelTarget.ANY, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on kick out reaction for any channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offKickOutAnyCh(fullReaction ?: FullReaction<any>): void {
        this._mapKick.remove(ChannelTarget.ANY, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on kick out for the user channel.
     * @example
     * onKickOutUserCh((message) => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onKickOutUserCh(reaction: ChannelReactionOnKickOutZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnKickOutZationCh>(reaction);
        this._mapKick.add(ChannelTarget.USER, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on kick out for the user channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceKickOutUserCh((message) => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceKickOutUserCh(reaction: ChannelReactionOnKickOutZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnKickOutZationCh>(reaction,{},true);
        this._mapKick.add(ChannelTarget.USER, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on kick out reaction for user channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offKickOutUserCh(fullReaction ?: FullReaction<any>): void {
        this._mapKick.remove(ChannelTarget.USER, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on kick out for the auth user group channel.
     * @example
     * onKickOutAuthUserGroupCh((message) => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onKickOutAuthUserGroupCh(reaction: ChannelReactionOnKickOutZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnKickOutZationCh>(reaction);
        this._mapKick.add(ChannelTarget.AUG, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on kick out for the auth user group channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceKickOutAuthUserGroupCh((message) => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceKickOutAuthUserGroupCh(reaction: ChannelReactionOnKickOutZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnKickOutZationCh>(reaction,{},true);
        this._mapKick.add(ChannelTarget.AUG, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on kick out reaction for auth user group channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offKickOutAuthUserGroupCh(fullReaction ?: FullReaction<any>): void {
        this._mapKick.remove(ChannelTarget.AUG, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on kick out for the default user group channel.
     * @example
     * onKickOutDefaultUserGroupCh((message) => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onKickOutDefaultUserGroupCh(reaction: ChannelReactionOnKickOutZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnKickOutZationCh>(reaction);
        this._mapKick.add(ChannelTarget.DUG, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on kick out for the default user group channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceKickOutDefaultUserGroupCh((message) => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceKickOutDefaultUserGroupCh(reaction: ChannelReactionOnKickOutZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnKickOutZationCh>(reaction,{},true);
        this._mapKick.add(ChannelTarget.DUG, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on kick out reaction for default user group channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offKickOutDefaultUserGroupCh(fullReaction ?: FullReaction<any>): void {
        this._mapKick.remove(ChannelTarget.DUG, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on kick out for the all channel.
     * @example
     * onKickOutAllCh((message) => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onKickOutAllCh(reaction: ChannelReactionOnKickOutZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnKickOutZationCh>(reaction);
        this._mapKick.add(ChannelTarget.ALL, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on kick out for the all channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceKickOutAllCh((message) => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceKickOutAllCh(reaction: ChannelReactionOnKickOutZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnKickOutZationCh>(reaction,{},true);
        this._mapKick.add(ChannelTarget.ALL, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on kick out reaction for all channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offKickOutAllCh(fullReaction ?: FullReaction<any>): void {
        this._mapKick.remove(ChannelTarget.ALL, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on kick out for an custom channel.
     * @example
     * onKickOutCustomCh({name : 'name',id : 'id'},(message,name,id) => {});
     * onKickOutCustomCh({name : 'name'},(message,name,id) => {});
     * @param name
     * You can also respond to multiple channel names by giving an channel name array.
     * Or to all channel names by providing no specific name.
     * @param id
     * You can also respond to multiple channel ids by giving an channel id array.
     * Or to all channel ids by providing no specific id.
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onKickOutCustomCh({name,id} : {name ?: string | string[], id ?: string | string[]},reaction: ChannelReactionOnKickOutCustomCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnKickOutCustomCh>(reaction, {name,id});
        this._mapKick.add(ChannelTarget.C, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on kick out for an custom channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceKickOutCustomCh({name : 'name',id : 'id'},(message,name,id) => {});
     * onceKickOutCustomCh({name : 'name'},(message,name,id) => {});
     * @param name
     * You can also respond to multiple channel names by giving an channel name array.
     * Or to all channel names by providing no specific name.
     * @param id
     * You can also respond to multiple channel ids by giving an channel id array.
     * Or to all channel ids by providing no specific id.
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceKickOutCustomCh({name,id} : {name ?: string | string[], id ?: string | string[]},reaction: ChannelReactionOnKickOutCustomCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnKickOutCustomCh>(reaction, {name,id},true);
        this._mapKick.add(ChannelTarget.C, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on kick out reaction for an custom channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offKickOutCustomCh(fullReaction ?: FullReaction<any>): void {
        this._mapKick.remove(ChannelTarget.C, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on kick out for the panel out channel.
     * @example
     * onKickOutPanelOutCh((message) => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onKickOutPanelOutCh(reaction: ChannelReactionOnKickOutZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnKickOutZationCh>(reaction);
        this._mapKick.add(ChannelTarget.PANEL, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on kick out for the panel out channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceKickOutPanelOutCh((message) => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceKickOutPanelOutCh(reaction: ChannelReactionOnKickOutZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnKickOutZationCh>(reaction,{},true);
        this._mapKick.add(ChannelTarget.PANEL, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on kick out reaction for panel out channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offKickOutPanelOutCh(fullReaction ?: FullReaction<any>): void {
        this._mapKick.remove(ChannelTarget.PANEL, fullReaction);
    }

    //OnSubFail Handler
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on sub fail for any channel.
     * @example
     * onSubFailAnyCh((error,fullChName) => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onSubFailAnyCh(reaction: ChannelReactionOnSubFailAnyCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnSubFailAnyCh>(reaction);
        this._mapSubFail.add(ChannelTarget.ANY, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on sub fail for any channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceSubFailAnyCh((error,fullChName) => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceSubFailAnyCh(reaction: ChannelReactionOnSubFailAnyCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnSubFailAnyCh>(reaction,{},true);
        this._mapSubFail.add(ChannelTarget.ANY, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on sub fail reaction for any channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offSubFailAnyCh(fullReaction ?: FullReaction<any>): void {
        this._mapSubFail.remove(ChannelTarget.ANY, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on sub fail for the user channel.
     * @example
     * onSubFailUserCh((error) => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onSubFailUserCh(reaction: ChannelReactionOnSubFailZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnSubFailZationCh>(reaction);
        this._mapSubFail.add(ChannelTarget.USER, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on sub fail for the user channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceSubFailUserCh((error) => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceSubFailUserCh(reaction: ChannelReactionOnSubFailZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnSubFailZationCh>(reaction,{},true);
        this._mapSubFail.add(ChannelTarget.USER, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on sub fail reaction for user channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offSubFailUserCh(fullReaction ?: FullReaction<any>): void {
        this._mapSubFail.remove(ChannelTarget.USER, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on sub fail for the auth user group channel.
     * @example
     * onSubFailAuthUserGroupCh((error) => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onSubFailAuthUserGroupCh(reaction: ChannelReactionOnSubFailZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnSubFailZationCh>(reaction);
        this._mapSubFail.add(ChannelTarget.AUG, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on sub fail for the auth user group channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceSubFailAuthUserGroupCh((error) => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceSubFailAuthUserGroupCh(reaction: ChannelReactionOnSubFailZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnSubFailZationCh>(reaction,{},true);
        this._mapSubFail.add(ChannelTarget.AUG, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on sub fail reaction for auth user group channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offSubFailAuthUserGroupCh(fullReaction ?: FullReaction<any>): void {
        this._mapSubFail.remove(ChannelTarget.AUG, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on sub fail for the default user group channel.
     * @example
     * onSubFailDefaultUserGroupCh((error) => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onSubFailDefaultUserGroupCh(reaction: ChannelReactionOnSubFailZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnSubFailZationCh>(reaction);
        this._mapSubFail.add(ChannelTarget.DUG, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on sub fail for the default user group channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceSubFailDefaultUserGroupCh((error) => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceSubFailDefaultUserGroupCh(reaction: ChannelReactionOnSubFailZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnSubFailZationCh>(reaction,{},true);
        this._mapSubFail.add(ChannelTarget.DUG, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on sub fail reaction for default user group channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offSubFailDefaultUserGroupCh(fullReaction ?: FullReaction<any>): void {
        this._mapSubFail.remove(ChannelTarget.DUG, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on sub fail for the all channel.
     * @example
     * onSubFailAllCh((error) => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onSubFailAllCh(reaction: ChannelReactionOnSubFailZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnSubFailZationCh>(reaction);
        this._mapSubFail.add(ChannelTarget.ALL, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on sub fail for the all channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceSubFailAllCh((error) => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceSubFailAllCh(reaction: ChannelReactionOnSubFailZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnSubFailZationCh>(reaction,{},true);
        this._mapSubFail.add(ChannelTarget.ALL, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on sub fail reaction for all channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offSubFailAllCh(fullReaction ?: FullReaction<any>): void {
        this._mapSubFail.remove(ChannelTarget.ALL, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on sub fail for an custom channel.
     * @example
     * onSubFailCustomCh({name : 'name',id : 'id'},(error,name,id) => {});
     * onSubFailCustomCh({name : 'name'},(error,name,id) => {});
     * @param name
     * You can also respond to multiple channel names by giving an channel name array.
     * Or to all channel names by providing no specific name.
     * @param id
     * You can also respond to multiple channel ids by giving an channel id array.
     * Or to all channel ids by providing no specific id.
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onSubFailCustomCh({name,id} : {name ?: string | string[], id ?: string | string[]}, reaction: ChannelReactionOnSubFailCustomCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnSubFailCustomCh>(reaction, {name,id});
        this._mapSubFail.add(ChannelTarget.C, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on sub fail for an custom channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceSubFailCustomCh({name : 'name',id : 'id'},(error,name,id) => {});
     * onceSubFailCustomCh({name : 'name'},(error,name,id) => {});
     * @param name
     * You can also respond to multiple channel names by giving an channel name array.
     * Or to all channel names by providing no specific name.
     * @param id
     * You can also respond to multiple channel ids by giving an channel id array.
     * Or to all channel ids by providing no specific id.
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceSubFailCustomCh({name,id} : {name ?: string | string[], id ?: string | string[]}, reaction: ChannelReactionOnSubFailCustomCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnSubFailCustomCh>(reaction, {name,id},true);
        this._mapSubFail.add(ChannelTarget.C, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on sub fail reaction for an custom channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offSubFailCustomCh(fullReaction ?: FullReaction<any>): void {
        this._mapSubFail.remove(ChannelTarget.C, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on sub fail for the panel out channel.
     * @example
     * onSubFailPanelOutCh((error) => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onSubFailPanelOutCh(reaction: ChannelReactionOnSubFailZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnSubFailZationCh>(reaction);
        this._mapSubFail.add(ChannelTarget.PANEL, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on sub fail for the panel out channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceSubFailPanelOutCh((error) => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceSubFailPanelOutCh(reaction: ChannelReactionOnSubFailZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnSubFailZationCh>(reaction,{},true);
        this._mapSubFail.add(ChannelTarget.PANEL, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on sub fail reaction for panel out channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offSubFailPanelOutCh(fullReaction ?: FullReaction<any>): void {
        this._mapSubFail.remove(ChannelTarget.PANEL, fullReaction);
    }

    //OnSub Handler
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on sub for any channel.
     * @example
     * onSubAnyCh((fullChName) => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onSubAnyCh(reaction: ChannelReactionOnSubAnyCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnSubAnyCh>(reaction);
        this._mapSub.add(ChannelTarget.ANY, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on sub for any channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceSubAnyCh((fullChName) => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceSubAnyCh(reaction: ChannelReactionOnSubAnyCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnSubAnyCh>(reaction,{},true);
        this._mapSub.add(ChannelTarget.ANY, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on sub reaction for any channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offSubAnyCh(fullReaction ?: FullReaction<any>): void {
        this._mapSub.remove(ChannelTarget.ANY, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on sub for the user channel.
     * @example
     * onSubUserCh(() => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onSubUserCh(reaction: ChannelReactionOnSubZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnSubZationCh>(reaction);
        this._mapSub.add(ChannelTarget.USER, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on sub for the user channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceSubUserCh(() => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceSubUserCh(reaction: ChannelReactionOnSubZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnSubZationCh>(reaction,{},true);
        this._mapSub.add(ChannelTarget.USER, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on sub reaction for user channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offSubUserCh(fullReaction ?: FullReaction<any>): void {
        this._mapSub.remove(ChannelTarget.USER, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on sub for the auth user group channel.
     * @example
     * onSubAuthUserGroupCh(() => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onSubAuthUserGroupCh(reaction: ChannelReactionOnSubZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnSubZationCh>(reaction);
        this._mapSub.add(ChannelTarget.AUG, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on sub for the auth user group channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceSubAuthUserGroupCh(() => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceSubAuthUserGroupCh(reaction: ChannelReactionOnSubZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnSubZationCh>(reaction,{},true);
        this._mapSub.add(ChannelTarget.AUG, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on sub reaction for auth user group channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offSubAuthUserGroupCh(fullReaction ?: FullReaction<any>): void {
        this._mapSub.remove(ChannelTarget.AUG, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on sub for the default user group channel.
     * @example
     * onSubDefaultUserGroupCh(() => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onSubDefaultUserGroupCh(reaction: ChannelReactionOnSubZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnSubZationCh>(reaction);
        this._mapSub.add(ChannelTarget.DUG, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on sub for the default user group channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceSubDefaultUserGroupCh(() => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceSubDefaultUserGroupCh(reaction: ChannelReactionOnSubZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnSubZationCh>(reaction,{},true);
        this._mapSub.add(ChannelTarget.DUG, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on sub reaction for default user group channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offSubDefaultUserGroupCh(fullReaction ?: FullReaction<any>): void {
        this._mapSub.remove(ChannelTarget.DUG, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on sub for the all channel.
     * @example
     * onSubAllCh(() => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onSubAllCh(reaction: ChannelReactionOnSubZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnSubZationCh>(reaction);
        this._mapSub.add(ChannelTarget.ALL, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on sub for the all channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceSubAllCh(() => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceSubAllCh(reaction: ChannelReactionOnSubZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnSubZationCh>(reaction,{},true);
        this._mapSub.add(ChannelTarget.ALL, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on sub reaction for all channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offSubAllCh(fullReaction ?: FullReaction<any>): void {
        this._mapSub.remove(ChannelTarget.ALL, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on sub for an custom channel.
     * @example
     * onSubCustomCh({name : 'name',id : 'id'},(name,id) => {});
     * onSubCustomCh({name : 'name'},(name,id) => {});
     * @param name
     * You can also respond to multiple channel names by giving an channel name array.
     * Or to all channel names by providing no specific name.
     * @param id
     * You can also respond to multiple channel ids by giving an channel id array.
     * Or to all channel ids by providing no specific id.
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onSubCustomCh({name,id} : {name ?: string | string[], id ?: string | string[]},reaction: ChannelReactionOnSubCustomCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnSubCustomCh>(reaction, {name,id});
        this._mapSub.add(ChannelTarget.C, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on sub for an custom channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceSubCustomCh({name : 'name',id : 'id'},(name,id) => {});
     * onceSubCustomCh({name : 'name'},(name,id) => {});
     * @param name
     * You can also respond to multiple channel names by giving an channel name array.
     * Or to all channel names by providing no specific name.
     * @param id
     * You can also respond to multiple channel ids by giving an channel id array.
     * Or to all channel ids by providing no specific id.
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceSubCustomCh({name,id} : {name ?: string | string[], id ?: string | string[]},reaction: ChannelReactionOnSubCustomCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnSubCustomCh>(reaction, {name,id},true);
        this._mapSub.add(ChannelTarget.C, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on sub reaction for an custom channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offSubCustomCh(fullReaction ?: FullReaction<any>): void {
        this._mapSub.remove(ChannelTarget.C, fullReaction);
    }


    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on sub for the panel out channel.
     * @example
     * onSubPanelOutCh(() => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onSubPanelOutCh(reaction: ChannelReactionOnSubZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnSubZationCh>(reaction);
        this._mapSub.add(ChannelTarget.PANEL, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on sub for the panel out channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceSubPanelOutCh(() => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceSubPanelOutCh(reaction: ChannelReactionOnSubZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnSubZationCh>(reaction,{},true);
        this._mapSub.add(ChannelTarget.PANEL, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on sub reaction for panel out channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offSubPanelOutCh(fullReaction ?: FullReaction<any>): void {
        this._mapSub.remove(ChannelTarget.PANEL, fullReaction);
    }

    //OnClientUnsub Handler
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on client unsub for any channel.
     * @example
     * onClientUnsubAnyCh((fullChName) => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onClientUnsubAnyCh(reaction: ChannelReactionOnClientUnsubAnyCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnClientUnsubAnyCh>(reaction);
        this._mapClientUnsub.add(ChannelTarget.ANY, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on client unsub for any channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceClientUnsubAnyCh((fullChName) => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceClientUnsubAnyCh(reaction: ChannelReactionOnClientUnsubAnyCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnClientUnsubAnyCh>(reaction,{},true);
        this._mapClientUnsub.add(ChannelTarget.ANY, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on client unsub reaction for any channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offClientUnsubAnyCh(fullReaction ?: FullReaction<any>): void {
        this._mapClientUnsub.remove(ChannelTarget.ANY, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on client unsub for the user channel.
     * @example
     * onClientUnsubUserCh(() => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onClientUnsubUserCh(reaction: ChannelReactionOnClientUnsubZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnClientUnsubZationCh>(reaction);
        this._mapClientUnsub.add(ChannelTarget.USER, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on client unsub for the user channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceClientUnsubUserCh(() => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceClientUnsubUserCh(reaction: ChannelReactionOnClientUnsubZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnClientUnsubZationCh>(reaction,{},true);
        this._mapClientUnsub.add(ChannelTarget.USER, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on client unsub reaction for user channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offClientUnsubUserCh(fullReaction ?: FullReaction<any>): void {
        this._mapClientUnsub.remove(ChannelTarget.USER, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on client unsub for the auth user group channel.
     * @example
     * onClientUnsubAuthUserGroupCh(() => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onClientUnsubAuthUserGroupCh(reaction: ChannelReactionOnClientUnsubZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnClientUnsubZationCh>(reaction);
        this._mapClientUnsub.add(ChannelTarget.AUG, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on client unsub for the auth user group channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceClientUnsubAuthUserGroupCh(() => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceClientUnsubAuthUserGroupCh(reaction: ChannelReactionOnClientUnsubZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnClientUnsubZationCh>(reaction,{},true);
        this._mapClientUnsub.add(ChannelTarget.AUG, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on client unsub reaction for auth user group channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offClientUnsubAuthUserGroupCh(fullReaction ?: FullReaction<any>): void {
        this._mapClientUnsub.remove(ChannelTarget.AUG, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on client unsub for the default user group channel.
     * @example
     * onClientUnsubDefaultUserGroupCh(() => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onClientUnsubDefaultUserGroupCh(reaction: ChannelReactionOnClientUnsubZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnClientUnsubZationCh>(reaction);
        this._mapClientUnsub.add(ChannelTarget.DUG, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on client unsub for the default user group channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceClientUnsubDefaultUserGroupCh(() => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceClientUnsubDefaultUserGroupCh(reaction: ChannelReactionOnClientUnsubZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnClientUnsubZationCh>(reaction,{},true);
        this._mapClientUnsub.add(ChannelTarget.DUG, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on client unsub reaction for default user group channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offClientUnsubDefaultUserGroupCh(fullReaction ?: FullReaction<any>): void {
        this._mapClientUnsub.remove(ChannelTarget.DUG, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on client unsub for the all channel.
     * @example
     * onClientUnsubAllCh(() => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onClientUnsubAllCh(reaction: ChannelReactionOnClientUnsubZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnClientUnsubZationCh>(reaction);
        this._mapClientUnsub.add(ChannelTarget.ALL, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on client unsub for the all channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceClientUnsubAllCh(() => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceClientUnsubAllCh(reaction: ChannelReactionOnClientUnsubZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnClientUnsubZationCh>(reaction,{},true);
        this._mapClientUnsub.add(ChannelTarget.ALL, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on client unsub reaction for all channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offClientUnsubAllCh(fullReaction ?: FullReaction<any>): void {
        this._mapClientUnsub.remove(ChannelTarget.ALL, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on client unsub for an custom channel.
     * @example
     * onClientUnsubCustomCh({name : 'name',id : 'id'},(name,id) => {});
     * onClientUnsubCustomCh({name : 'name'},(name,id) => {});
     * @param name
     * You can also respond to multiple channel names by giving an channel name array.
     * Or to all channel names by providing no specific name.
     * @param id
     * You can also respond to multiple channel ids by giving an channel id array.
     * Or to all channel ids by providing no specific id.
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onClientUnsubCustomCh({name,id} : {name ?: string | string[], id ?: string | string[]},reaction: ChannelReactionOnClientUnsubCustomCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnClientUnsubCustomCh>(reaction, {name,id});
        this._mapClientUnsub.add(ChannelTarget.C, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on client unsub for an custom channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceClientUnsubCustomCh({name : 'name',id : 'id'},(name,id) => {});
     * onceClientUnsubCustomCh({name : 'name'},(name,id) => {});
     * @param name
     * You can also respond to multiple channel names by giving an channel name array.
     * Or to all channel names by providing no specific name.
     * @param id
     * You can also respond to multiple channel ids by giving an channel id array.
     * Or to all channel ids by providing no specific id.
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceClientUnsubCustomCh({name,id} : {name ?: string | string[], id ?: string | string[]},reaction: ChannelReactionOnClientUnsubCustomCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnClientUnsubCustomCh>(reaction, {name,id},true);
        this._mapClientUnsub.add(ChannelTarget.C, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on client unsub reaction for an custom channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offClientUnsubCustomCh(fullReaction ?: FullReaction<any>): void {
        this._mapClientUnsub.remove(ChannelTarget.C, fullReaction);
    }


    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on client unsub for the panel out channel.
     * @example
     * onClientUnsubPanelOutCh(() => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onClientUnsubPanelOutCh(reaction: ChannelReactionOnClientUnsubZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnClientUnsubZationCh>(reaction);
        this._mapClientUnsub.add(ChannelTarget.PANEL, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on client unsub for the panel out channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceClientUnsubPanelOutCh(() => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceClientUnsubPanelOutCh(reaction: ChannelReactionOnClientUnsubZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnClientUnsubZationCh>(reaction,{},true);
        this._mapClientUnsub.add(ChannelTarget.PANEL, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on client unsub reaction for panel out channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offClientUnsubPanelOutCh(fullReaction ?: FullReaction<any>): void {
        this._mapClientUnsub.remove(ChannelTarget.PANEL, fullReaction);
    }

    //OnUnsub Handler
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on unsub for any channel.
     * @example
     * onUnsubAnyCh((fromClient,fullChName) => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onUnsubAnyCh(reaction: ChannelReactionOnUnsubAnyCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnUnsubAnyCh>(reaction);
        this._mapUnsub.add(ChannelTarget.ANY, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on unsub for any channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceUnsubAnyCh((fromClient,fullChName) => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceUnsubAnyCh(reaction: ChannelReactionOnUnsubAnyCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnUnsubAnyCh>(reaction,{},true);
        this._mapUnsub.add(ChannelTarget.ANY, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on unsub reaction for any channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offUnsubAnyCh(fullReaction ?: FullReaction<any>): void {
        this._mapUnsub.remove(ChannelTarget.ANY, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on unsub for the user channel.
     * @example
     * onUnsubUserCh((fromClient) => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onUnsubUserCh(reaction: ChannelReactionOnUnsubZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnUnsubZationCh>(reaction);
        this._mapUnsub.add(ChannelTarget.USER, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on unsub for the user channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceUnsubUserCh((fromClient) => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceUnsubUserCh(reaction: ChannelReactionOnUnsubZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnUnsubZationCh>(reaction,{},true);
        this._mapUnsub.add(ChannelTarget.USER, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on unsub reaction for user channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offUnsubUserCh(fullReaction ?: FullReaction<any>): void {
        this._mapUnsub.remove(ChannelTarget.USER, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on unsub for the auth user group channel.
     * @example
     * onUnsubAuthUserGroupCh((fromClient) => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onUnsubAuthUserGroupCh(reaction: ChannelReactionOnUnsubZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnUnsubZationCh>(reaction);
        this._mapUnsub.add(ChannelTarget.AUG, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on unsub for the auth user group channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceUnsubAuthUserGroupCh((fromClient) => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceUnsubAuthUserGroupCh(reaction: ChannelReactionOnUnsubZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnUnsubZationCh>(reaction,{},true);
        this._mapUnsub.add(ChannelTarget.AUG, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on unsub reaction for auth user group channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offUnsubAuthUserGroupCh(fullReaction ?: FullReaction<any>): void {
        this._mapUnsub.remove(ChannelTarget.AUG, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on unsub for the default user group channel.
     * @example
     * onUnsubDefaultUserGroupCh((fromClient) => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onUnsubDefaultUserGroupCh(reaction: ChannelReactionOnUnsubZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnUnsubZationCh>(reaction);
        this._mapUnsub.add(ChannelTarget.DUG, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on unsub for the default user group channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceUnsubDefaultUserGroupCh((fromClient) => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceUnsubDefaultUserGroupCh(reaction: ChannelReactionOnUnsubZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnUnsubZationCh>(reaction,{},true);
        this._mapUnsub.add(ChannelTarget.DUG, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on unsub reaction for default user group channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offUnsubDefaultUserGroupCh(fullReaction ?: FullReaction<any>): void {
        this._mapUnsub.remove(ChannelTarget.DUG, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on unsub for the all channel.
     * @example
     * onUnsubAllCh((fromClient) => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onUnsubAllCh(reaction: ChannelReactionOnUnsubZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnUnsubZationCh>(reaction);
        this._mapUnsub.add(ChannelTarget.ALL, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on unsub for the all channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceUnsubAllCh((fromClient) => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceUnsubAllCh(reaction: ChannelReactionOnUnsubZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnUnsubZationCh>(reaction,{},true);
        this._mapUnsub.add(ChannelTarget.ALL, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on unsub reaction for all channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offUnsubAllCh(fullReaction ?: FullReaction<any>): void {
        this._mapUnsub.remove(ChannelTarget.ALL, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on unsub for an custom channel.
     * @example
     * onUnsubCustomCh({name : 'name',id : 'id'},(fromClient,name,id) => {});
     * onUnsubCustomCh({name : 'name'},(fromClient,name,id) => {});
     * @param name
     * You can also respond to multiple channel names by giving an channel name array.
     * Or to all channel names by providing no specific name.
     * @param id
     * You can also respond to multiple channel ids by giving an channel id array.
     * Or to all channel ids by providing no specific id.
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onUnsubCustomCh({name,id} : {name ?: string | string[], id ?: string | string[]},reaction: ChannelReactionOnUnsubCustomCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnUnsubCustomCh>(reaction, {name,id});
        this._mapUnsub.add(ChannelTarget.C, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on unsub for an custom channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceUnsubCustomCh({name : 'name',id : 'id'},(fromClient,name,id) => {});
     * onceUnsubCustomCh({name : 'name'},(fromClient,name,id) => {});
     * @param name
     * You can also respond to multiple channel names by giving an channel name array.
     * Or to all channel names by providing no specific name.
     * @param id
     * You can also respond to multiple channel ids by giving an channel id array.
     * Or to all channel ids by providing no specific id.
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceUnsubCustomCh({name,id} : {name ?: string | string[], id ?: string | string[]},reaction: ChannelReactionOnUnsubCustomCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnUnsubCustomCh>(reaction, {name,id},true);
        this._mapUnsub.add(ChannelTarget.C, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on unsub reaction for an custom channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offUnsubCustomCh(fullReaction ?: FullReaction<any>): void {
        this._mapUnsub.remove(ChannelTarget.C, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on unsub for the panel out channel.
     * @example
     * onUnsubPanelOutCh((fromClient) => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onUnsubPanelOutCh(reaction: ChannelReactionOnUnsubZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnUnsubZationCh>(reaction);
        this._mapUnsub.add(ChannelTarget.PANEL, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on unsub for the panel out channel.
     * The reaction will trigger only one time.
     * It will automatically be removed from the reactions after invocation.
     * @example
     * onceUnsubPanelOutCh((fromClient) => {});
     * @param reaction
     * @return
     * It returns the channelReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onceUnsubPanelOutCh(reaction: ChannelReactionOnUnsubZationCh): ChannelReactionBox {
        const fullReaction = new FullReaction<ChannelReactionOnUnsubZationCh>(reaction,{},true);
        this._mapUnsub.add(ChannelTarget.PANEL, fullReaction);
        this.lastReactionTmp = fullReaction;
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on unsub reaction for panel out channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offUnsubPanelOutCh(fullReaction ?: FullReaction<any>): void {
        this._mapUnsub.remove(ChannelTarget.PANEL, fullReaction);
    }

    private async _triggerFilterDataEventBox(box: SBox<any> | undefined, valid: ValidChecker, ...data: any[]) {
        if (box) {
            await box.forEachAll(async (reaction: FullReaction<any>) => {
                if (valid(reaction.getFilter())) {
                    if(reaction.isOnce()){
                        box.removeItem(reaction);
                    }
                    await reaction.getReactionHandler()(...data);
                }
            });
        }
    }

    private async _triggerDataEventBox(box: SBox<any> | undefined, ...data: any[]) {
        if (box) {
            await box.forEachAll(async (reaction: FullReaction<any>) => {
                if(reaction.isOnce()){
                    box.removeItem(reaction);
                }
                await reaction.getReactionHandler()(...data);
            });
        }
    }

    private static _multiFilter(value, check): boolean {
        if (value === undefined || value === null) {
            return true;
        } else if (Array.isArray(value)) {
            return value.indexOf(check) !== -1;
        } else {
            return value === check;
        }
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Used internally.
     * Only use this method carefully.
     */
    async _triggerPub(target : ChannelTarget, event : string, data : any, {name,id,chFullName} : any, ssid ?: string) : Promise<void>
    {
        if(this.active) {
            await this._triggerWillProcess();
            if (target === ChannelTarget.C) {
                const sameEventAndChFilter : ValidChecker = (filter : ChFilter) : boolean => {
                    return ChannelReactionBox._multiFilter(filter.event,event) &&
                        ChannelReactionBox._multiFilter(filter.name,name) &&
                        ChannelReactionBox._multiFilter(filter.id,id);};
                await this._triggerFilterDataEventBox(this._mapPub.tryGet(ChannelTarget.C),sameEventAndChFilter,data,ssid,event,name,id);
            } else {
                const sameEventFilter : ValidChecker = (filter : ChFilter) : boolean => {
                    return ChannelReactionBox._multiFilter(filter.event,event);
                };
                switch (target) {
                    case ChannelTarget.ANY:
                        await this._triggerFilterDataEventBox(this._mapPub.tryGet(ChannelTarget.ANY),sameEventFilter,data,ssid,event,chFullName);
                        break;
                    case ChannelTarget.USER:
                        await this._triggerFilterDataEventBox(this._mapPub.tryGet(ChannelTarget.USER),sameEventFilter,data,ssid,event);
                        break;
                    case ChannelTarget.AUG:
                        await this._triggerFilterDataEventBox(this._mapPub.tryGet(ChannelTarget.AUG),sameEventFilter,data,ssid,event);
                        break;
                    case ChannelTarget.DUG:
                        await this._triggerFilterDataEventBox(this._mapPub.tryGet(ChannelTarget.DUG),sameEventFilter,data,ssid,event);
                        break;
                    case ChannelTarget.ALL:
                        await this._triggerFilterDataEventBox(this._mapPub.tryGet(ChannelTarget.ALL),sameEventFilter,data,ssid,event);
                        break;
                    case ChannelTarget.PANEL:
                        await this._triggerFilterDataEventBox(this._mapPub.tryGet(ChannelTarget.PANEL),sameEventFilter,data,ssid,event);
                        break;
                }
            }
            await this._triggerDidProcess();
        }
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Used internally.
     * Only use this method carefully.
     */
    async _triggerEvent(map : SBoxMapper<FullReaction<any>>, target : ChannelTarget, {name,id,chFullName} : any, ...arg : any[]) : Promise<void>
    {
        if(this.active) {
            await this._triggerWillProcess();
            if (target === ChannelTarget.C) {
                const sameEventAndChFilter : ValidChecker = (filter : object) : boolean => {
                    return ChannelReactionBox._multiFilter(filter['name'],name) &&
                        ChannelReactionBox._multiFilter(filter['id'],id);
                };
                await this._triggerFilterDataEventBox(map.tryGet(ChannelTarget.C),sameEventAndChFilter,...arg,name,id);
            } else {
                switch (target) {
                    case ChannelTarget.ANY:
                        await this._triggerDataEventBox(map.tryGet(ChannelTarget.ANY),...arg,chFullName);
                        break;
                    case ChannelTarget.USER:
                        await this._triggerDataEventBox(map.tryGet(ChannelTarget.USER),...arg);
                        break;
                    case ChannelTarget.AUG:
                        await this._triggerDataEventBox(map.tryGet(ChannelTarget.AUG),...arg);
                        break;
                    case ChannelTarget.DUG:
                        await this._triggerDataEventBox(map.tryGet(ChannelTarget.DUG),...arg);
                        break;
                    case ChannelTarget.ALL:
                        await this._triggerDataEventBox(map.tryGet(ChannelTarget.ALL),...arg);
                        break;
                    case ChannelTarget.PANEL:
                        await this._triggerDataEventBox(map.tryGet(ChannelTarget.PANEL),...arg);
                        break;
                }
            }
            await this._triggerDidProcess();
        }
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Used internally.
     * Only use this method carefully.
     */
    get mapPub(): SBoxMapper<FullReaction<any>> {
        return this._mapPub;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Used internally.
     * Only use this method carefully.
     */
    get mapKick(): SBoxMapper<FullReaction<any>> {
        return this._mapKick;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Used internally.
     * Only use this method carefully.
     */
    get mapSubFail(): SBoxMapper<FullReaction<any>> {
        return this._mapSubFail;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Used internally.
     * Only use this method carefully.
     */
    get mapSub(): SBoxMapper<FullReaction<any>> {
        return this._mapSub;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Used internally.
     * Only use this method carefully.
     */
    get mapClientUnsub(): SBoxMapper<FullReaction<any>> {
        return this._mapClientUnsub;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Used internally.
     * Only use this method carefully.
     */
    get mapUnsub(): SBoxMapper<FullReaction<any>> {
        return this._mapUnsub;
    }
}