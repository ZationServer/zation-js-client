/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import ReactionBox = require("../helper/react/box/reactionBox");
import SBox = require("../helper/box/sBox");
import FullReaction = require("../helper/react/reaction/fullReaction");
import SboxMapper = require("../helper/box/sboxMapper");
import {
    ChannelReactionOnClientUnsubAnyCh,
    ChannelReactionOnClientUnsubCustomCh,
    ChannelReactionOnClientUnsubCustomIdCh,
    ChannelReactionOnClientUnsubZationCh,
    ChannelReactionOnKickOutAnyCh,
    ChannelReactionOnKickOutCustomCh,
    ChannelReactionOnKickOutCustomIdCh,
    ChannelReactionOnKickOutZationCh,
    ChannelReactionOnPubAnyCh,
    ChannelReactionOnPubCustomCh,
    ChannelReactionOnPubCustomIdCh,
    ChannelReactionOnPubZationCh,
    ChannelReactionOnSubAnyCh,
    ChannelReactionOnSubCustomCh,
    ChannelReactionOnSubCustomIdCh,
    ChannelReactionOnSubFailAnyCh,
    ChannelReactionOnSubFailCustomCh,
    ChannelReactionOnSubFailCustomIdCh,
    ChannelReactionOnSubFailZationCh,
    ChannelReactionOnSubZationCh,
    ChannelReactionOnUnsubAnyCh,
    ChannelReactionOnUnsubCustomCh,
    ChannelReactionOnUnsubCustomIdCh,
    ChannelReactionOnUnsubZationCh
} from "../helper/react/reaction/reactionHandler";
import {ChannelTarget} from "../helper/channel/channelTarget";

type ValidChecker = (filter : object) => boolean;

class ChannelReactionBox extends ReactionBox
{

    private readonly _mapPub: SboxMapper<FullReaction<any>> = new SboxMapper<FullReaction<any>>();
    private readonly _mapKick: SboxMapper<FullReaction<any>> = new SboxMapper<FullReaction<any>>();
    private readonly _mapSubFail: SboxMapper<FullReaction<any>> = new SboxMapper<FullReaction<any>>();
    private readonly _mapSub: SboxMapper<FullReaction<any>> = new SboxMapper<FullReaction<any>>();
    private readonly _mapClientUnsub: SboxMapper<FullReaction<any>> = new SboxMapper<FullReaction<any>>();
    private readonly _mapUnsub: SboxMapper<FullReaction<any>> = new SboxMapper<FullReaction<any>>();

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Creates a new ChannelReactionBox.
     * This box can be linked to the zation client.
     */
    constructor() {
        super();
    }

    //OnPub Handler
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on publish for any channel.
     * @example
     * onPubAnyCh((data,socketSrcSid,eventName,fullChName) => {});
     * @param event
     * You can also respond to multiple events by giving an event array.
     * Or to all events if you pass as parameter null.
     * @param reaction
     * @return
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onPubAnyCh(event: string | string[] | null, reaction: ChannelReactionOnPubAnyCh): FullReaction<ChannelReactionOnPubAnyCh> {
        const fullReaction = new FullReaction<ChannelReactionOnPubAnyCh>(reaction, {event: event});
        this._mapPub.add(ChannelTarget.ANY, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on publish reaction for any channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offPubAnyCh(fullReaction ?: FullReaction<ChannelReactionOnPubAnyCh>): void {
        this._mapPub.remove(ChannelTarget.ANY, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on publish for the user channel.
     * @example
     * onPubUserCh((data,socketSrcSid,event) => {});
     * @param event
     * You can also respond to multiple events by giving an event array.
     * Or to all events if you pass as parameter null.
     * @param reaction
     * @return
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onPubUserCh(event: string | string[] | null, reaction: ChannelReactionOnPubZationCh): FullReaction<ChannelReactionOnPubZationCh> {
        const fullReaction = new FullReaction<ChannelReactionOnPubZationCh>(reaction, {event: event});
        this._mapPub.add(ChannelTarget.USER, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on publish reaction for user channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offPubUserCh(fullReaction ?: FullReaction<ChannelReactionOnPubZationCh>): void {
        this._mapPub.remove(ChannelTarget.USER, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on publish for the auth user group channel.
     * @example
     * onPubAuthUserGroupCh((data,socketSrcSid,event) => {});
     * @param event
     * You can also respond to multiple events by giving an event array.
     * Or to all events if you pass as parameter null.
     * @param reaction
     * @return
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onPubAuthUserGroupCh(event: string | string[] | null, reaction: ChannelReactionOnPubZationCh): FullReaction<ChannelReactionOnPubZationCh> {
        const fullReaction = new FullReaction<ChannelReactionOnPubZationCh>(reaction, {event: event});
        this._mapPub.add(ChannelTarget.AUG, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on publish reaction for auth user group channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offPubAuthUserGroupCh(fullReaction ?: FullReaction<ChannelReactionOnPubZationCh>): void {
        this._mapPub.remove(ChannelTarget.AUG, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on publish for the default user group channel.
     * @example
     * onPubDefaultUserGroupCh((data,socketSrcSid,event) => {});
     * @param event
     * You can also respond to multiple events by giving an event array.
     * Or to all events if you pass as parameter null.
     * @param reaction
     * @return
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onPubDefaultUserGroupCh(event: string | string[] | null, reaction: ChannelReactionOnPubZationCh): FullReaction<ChannelReactionOnPubZationCh> {
        const fullReaction = new FullReaction<ChannelReactionOnPubZationCh>(reaction, {event: event});
        this._mapPub.add(ChannelTarget.DUG, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on publish reaction for default user group channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offPubDefaultUserGroupCh(fullReaction ?: FullReaction<ChannelReactionOnPubZationCh>): void {
        this._mapPub.remove(ChannelTarget.DUG, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on publish for the all channel.
     * @example
     * onPubAllCh((data,socketSrcSid,event) => {});
     * @param event
     * You can also respond to multiple events by giving an event array.
     * Or to all events if you pass as parameter null.
     * @param reaction
     * @return
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onPubAllCh(event: string | string[] | null, reaction: ChannelReactionOnPubZationCh): FullReaction<ChannelReactionOnPubZationCh> {
        const fullReaction = new FullReaction<ChannelReactionOnPubZationCh>(reaction, {event: event});
        this._mapPub.add(ChannelTarget.ALL, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on publish reaction for all channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offPubAllCh(fullReaction ?: FullReaction<ChannelReactionOnPubZationCh>): void {
        this._mapPub.remove(ChannelTarget.ALL, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on publish for an custom channel.
     * @example
     * onPubCustomCh((data,socketSrcSid,event,chName) => {});
     * @param chName
     * You can also respond to multiple channel names by giving an channel name array.
     * Or to all channel names if you pass as parameter null.
     * @param event
     * You can also respond to multiple events by giving an event array.
     * Or to all events if you pass as parameter null.
     * @param reaction
     * @return
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onPubCustomCh(chName: string | string[] | null, event: string | string[] | null, reaction: ChannelReactionOnPubCustomCh): FullReaction<ChannelReactionOnPubCustomCh> {
        const fullReaction = new FullReaction<ChannelReactionOnPubCustomCh>(reaction, {chName: chName, event: event});
        this._mapPub.add(ChannelTarget.C, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on publish reaction for an custom channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offPubCustomCh(fullReaction ?: FullReaction<ChannelReactionOnPubCustomCh>): void {
        this._mapPub.remove(ChannelTarget.C, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on publish for an custom id channel.
     * @example
     * onPubCustomIdCh((data,socketSrcSid,event,chId,chName) => {});
     * @param chName
     * You can also respond to multiple channel names by giving an channel name array.
     * Or to all channel names if you pass as parameter null.
     * @param chId
     * You can also respond to multiple channel ids by giving an channel id array.
     * Or to all channel ids if you pass as parameter null.
     * @param event
     * You can also respond to multiple events by giving an event array.
     * Or to all events if you pass as parameter null.
     * @param reaction
     * @return
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onPubCustomIdCh(chName: string | string[] | null,chId: string | string[] | null,event: string | string[] | null,reaction: ChannelReactionOnPubCustomIdCh): FullReaction<ChannelReactionOnPubCustomIdCh> {
        const fullReaction = new FullReaction<ChannelReactionOnPubCustomIdCh>(reaction, {chName, event, chId});
        this._mapPub.add(ChannelTarget.CID, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on publish reaction for an custom id channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offPubCustomIdCh(fullReaction ?: FullReaction<ChannelReactionOnPubCustomIdCh>): void {
        this._mapPub.remove(ChannelTarget.CID, fullReaction);
    }


    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on publish for the panel out channel.
     * @example
     * onPubPanelOutCh((data,socketSrcSid,event) => {});
     * @param event
     * You can also respond to multiple events by giving an event array.
     * Or to all events if you pass as parameter null.
     * @param reaction
     * @return
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onPubPanelOutCh(event: string | string[] | null, reaction: ChannelReactionOnPubZationCh): FullReaction<ChannelReactionOnPubZationCh> {
        const fullReaction = new FullReaction<ChannelReactionOnPubZationCh>(reaction, {event: event});
        this._mapPub.add(ChannelTarget.PANEL, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on publish reaction for panel out channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offPubPanelOutCh(fullReaction ?: FullReaction<ChannelReactionOnPubZationCh>): void {
        this._mapPub.remove(ChannelTarget.PANEL, fullReaction);
    }

    //OnKickOut Handler
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on kick out for any channel.
     * @example
     * onKickOutAnyCh((message,fullChName) => {});
     * @param reaction
     * @return
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onKickOutAnyCh(reaction: ChannelReactionOnKickOutAnyCh): FullReaction<ChannelReactionOnKickOutAnyCh> {
        const fullReaction = new FullReaction<ChannelReactionOnKickOutAnyCh>(reaction);
        this._mapKick.add(ChannelTarget.ANY, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on kick out reaction for any channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offKickOutAnyCh(fullReaction ?: FullReaction<ChannelReactionOnKickOutAnyCh>): void {
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
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onKickOutUserCh(reaction: ChannelReactionOnKickOutZationCh): FullReaction<ChannelReactionOnKickOutZationCh> {
        const fullReaction = new FullReaction<ChannelReactionOnKickOutZationCh>(reaction);
        this._mapKick.add(ChannelTarget.USER, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on kick out reaction for user channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offKickOutUserCh(fullReaction ?: FullReaction<ChannelReactionOnKickOutZationCh>): void {
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
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onKickOutAuthUserGroupCh(reaction: ChannelReactionOnKickOutZationCh): FullReaction<ChannelReactionOnKickOutZationCh> {
        const fullReaction = new FullReaction<ChannelReactionOnKickOutZationCh>(reaction);
        this._mapKick.add(ChannelTarget.AUG, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on kick out reaction for auth user group channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offKickOutAuthUserGroupCh(fullReaction ?: FullReaction<ChannelReactionOnKickOutZationCh>): void {
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
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onKickOutDefaultUserGroupCh(reaction: ChannelReactionOnKickOutZationCh): FullReaction<ChannelReactionOnKickOutZationCh> {
        const fullReaction = new FullReaction<ChannelReactionOnKickOutZationCh>(reaction);
        this._mapKick.add(ChannelTarget.DUG, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on kick out reaction for default user group channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offKickOutDefaultUserGroupCh(fullReaction ?: FullReaction<ChannelReactionOnKickOutZationCh>): void {
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
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onKickOutAllCh(reaction: ChannelReactionOnKickOutZationCh): FullReaction<ChannelReactionOnKickOutZationCh> {
        const fullReaction = new FullReaction<ChannelReactionOnKickOutZationCh>(reaction);
        this._mapKick.add(ChannelTarget.ALL, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on kick out reaction for all channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offKickOutAllCh(fullReaction ?: FullReaction<ChannelReactionOnKickOutZationCh>): void {
        this._mapKick.remove(ChannelTarget.ALL, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on kick out for an custom channel.
     * @example
     * onKickOutCustomCh((message,chName) => {});
     * @param chName
     * You can also respond to multiple channel names by giving an channel name array.
     * Or to all channel names if you pass as parameter null.
     * @param reaction
     * @return
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onKickOutCustomCh(chName: string | string[] | null,reaction: ChannelReactionOnKickOutCustomCh): FullReaction<ChannelReactionOnKickOutCustomCh> {
        const fullReaction = new FullReaction<ChannelReactionOnKickOutCustomCh>(reaction, {chName: chName});
        this._mapKick.add(ChannelTarget.C, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on kick out reaction for an custom channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offKickOutCustomCh(fullReaction ?: FullReaction<ChannelReactionOnKickOutCustomCh>): void {
        this._mapKick.remove(ChannelTarget.C, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on kick out for an custom id channel.
     * @example
     * onKickOutCustomCh((message,chId,chName) => {});
     * @param chName
     * You can also respond to multiple channel names by giving an channel name array.
     * Or to all channel names if you pass as parameter null.
     * @param chId
     * You can also respond to multiple channel ids by giving an channel id array.
     * Or to all channel ids if you pass as parameter null.
     * @param reaction
     * @return
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onKickOutCustomIdCh(chName: string | string[] | null,chId: string | string[] | null,reaction: ChannelReactionOnKickOutCustomIdCh): FullReaction<ChannelReactionOnKickOutCustomIdCh> {
        const fullReaction = new FullReaction<ChannelReactionOnKickOutCustomIdCh>(reaction, {chName, chId});
        this._mapKick.add(ChannelTarget.CID, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on kick out reaction for an custom id channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offKickOutCustomIdCh(fullReaction ?: FullReaction<ChannelReactionOnKickOutCustomIdCh>): void {
        this._mapKick.remove(ChannelTarget.CID, fullReaction);
    }


    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on kick out for the panel out channel.
     * @example
     * onKickOutPanelOutCh((message) => {});
     * @param reaction
     * @return
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onKickOutPanelOutCh(reaction: ChannelReactionOnKickOutZationCh): FullReaction<ChannelReactionOnKickOutZationCh> {
        const fullReaction = new FullReaction<ChannelReactionOnKickOutZationCh>(reaction);
        this._mapKick.add(ChannelTarget.PANEL, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on kick out reaction for panel out channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offKickOutPanelOutCh(fullReaction ?: FullReaction<ChannelReactionOnKickOutZationCh>): void {
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
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onSubFailAnyCh(reaction: ChannelReactionOnSubFailAnyCh): FullReaction<ChannelReactionOnSubFailAnyCh> {
        const fullReaction = new FullReaction<ChannelReactionOnSubFailAnyCh>(reaction);
        this._mapSubFail.add(ChannelTarget.ANY, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on sub fail reaction for any channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offSubFailAnyCh(fullReaction ?: FullReaction<ChannelReactionOnSubFailAnyCh>): void {
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
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onSubFailUserCh(reaction: ChannelReactionOnSubFailZationCh): FullReaction<ChannelReactionOnSubFailZationCh> {
        const fullReaction = new FullReaction<ChannelReactionOnSubFailZationCh>(reaction);
        this._mapSubFail.add(ChannelTarget.USER, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on sub fail reaction for user channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offSubFailUserCh(fullReaction ?: FullReaction<ChannelReactionOnSubFailZationCh>): void {
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
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onSubFailAuthUserGroupCh(reaction: ChannelReactionOnSubFailZationCh): FullReaction<ChannelReactionOnSubFailZationCh> {
        const fullReaction = new FullReaction<ChannelReactionOnSubFailZationCh>(reaction);
        this._mapSubFail.add(ChannelTarget.AUG, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on sub fail reaction for auth user group channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offSubFailAuthUserGroupCh(fullReaction ?: FullReaction<ChannelReactionOnSubFailZationCh>): void {
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
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onSubFailDefaultUserGroupCh(reaction: ChannelReactionOnSubFailZationCh): FullReaction<ChannelReactionOnSubFailZationCh> {
        const fullReaction = new FullReaction<ChannelReactionOnSubFailZationCh>(reaction);
        this._mapSubFail.add(ChannelTarget.DUG, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on sub fail reaction for default user group channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offSubFailDefaultUserGroupCh(fullReaction ?: FullReaction<ChannelReactionOnSubFailZationCh>): void {
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
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onSubFailAllCh(reaction: ChannelReactionOnSubFailZationCh): FullReaction<ChannelReactionOnSubFailZationCh> {
        const fullReaction = new FullReaction<ChannelReactionOnSubFailZationCh>(reaction);
        this._mapSubFail.add(ChannelTarget.ALL, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on sub fail reaction for all channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offSubFailAllCh(fullReaction ?: FullReaction<ChannelReactionOnSubFailZationCh>): void {
        this._mapSubFail.remove(ChannelTarget.ALL, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on sub fail for an custom channel.
     * @example
     * onSubFailCustomCh((error,chName) => {});
     * @param chName
     * You can also respond to multiple channel names by giving an channel name array.
     * Or to all channel names if you pass as parameter null.
     * @param reaction
     * @return
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onSubFailCustomCh(chName: string | string[] | null,reaction: ChannelReactionOnSubFailCustomCh): FullReaction<ChannelReactionOnSubFailCustomCh> {
        const fullReaction = new FullReaction<ChannelReactionOnSubFailCustomCh>(reaction, {chName: chName});
        this._mapSubFail.add(ChannelTarget.C, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on sub fail reaction for an custom channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offSubFailCustomCh(fullReaction ?: FullReaction<ChannelReactionOnSubFailCustomCh>): void {
        this._mapSubFail.remove(ChannelTarget.C, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on sub fail for an custom id channel.
     * @example
     * onSubFailCustomIdCh((error,chId,chName) => {});
     * @param chName
     * You can also respond to multiple channel names by giving an channel name array.
     * Or to all channel names if you pass as parameter null.
     * @param chId
     * You can also respond to multiple channel ids by giving an channel id array.
     * Or to all channel ids if you pass as parameter null.
     * @param reaction
     * @return
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onSubFailCustomIdCh(chName: string | string[] | null,chId: string | string[] | null, reaction: ChannelReactionOnSubFailCustomIdCh): FullReaction<ChannelReactionOnSubFailCustomIdCh> {
        const fullReaction = new FullReaction<ChannelReactionOnSubFailCustomIdCh>(reaction, {chName,chId});
        this._mapSubFail.add(ChannelTarget.CID, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on sub fail reaction for an custom id channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offSubFailCustomIdCh(fullReaction ?: FullReaction<ChannelReactionOnSubFailCustomIdCh>): void {
        this._mapSubFail.remove(ChannelTarget.CID, fullReaction);
    }
    
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on sub fail for the panel out channel.
     * @example
     * onSubFailPanelOutCh((error) => {});
     * @param reaction
     * @return
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onSubFailPanelOutCh(reaction: ChannelReactionOnSubFailZationCh): FullReaction<ChannelReactionOnSubFailZationCh> {
        const fullReaction = new FullReaction<ChannelReactionOnSubFailZationCh>(reaction);
        this._mapSubFail.add(ChannelTarget.PANEL, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on sub fail reaction for panel out channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offSubFailPanelOutCh(fullReaction ?: FullReaction<ChannelReactionOnSubFailZationCh>): void {
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
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onSubAnyCh(reaction: ChannelReactionOnSubAnyCh): FullReaction<ChannelReactionOnSubAnyCh> {
        const fullReaction = new FullReaction<ChannelReactionOnSubAnyCh>(reaction);
        this._mapSub.add(ChannelTarget.ANY, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on sub reaction for any channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offSubAnyCh(fullReaction ?: FullReaction<ChannelReactionOnSubAnyCh>): void {
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
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onSubUserCh(reaction: ChannelReactionOnSubZationCh): FullReaction<ChannelReactionOnSubZationCh> {
        const fullReaction = new FullReaction<ChannelReactionOnSubZationCh>(reaction);
        this._mapSub.add(ChannelTarget.USER, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on sub reaction for user channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offSubUserCh(fullReaction ?: FullReaction<ChannelReactionOnSubZationCh>): void {
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
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onSubAuthUserGroupCh(reaction: ChannelReactionOnSubZationCh): FullReaction<ChannelReactionOnSubZationCh> {
        const fullReaction = new FullReaction<ChannelReactionOnSubZationCh>(reaction);
        this._mapSub.add(ChannelTarget.AUG, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on sub reaction for auth user group channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offSubAuthUserGroupCh(fullReaction ?: FullReaction<ChannelReactionOnSubZationCh>): void {
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
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onSubDefaultUserGroupCh(reaction: ChannelReactionOnSubZationCh): FullReaction<ChannelReactionOnSubZationCh> {
        const fullReaction = new FullReaction<ChannelReactionOnSubZationCh>(reaction);
        this._mapSub.add(ChannelTarget.DUG, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on sub reaction for default user group channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offSubDefaultUserGroupCh(fullReaction ?: FullReaction<ChannelReactionOnSubZationCh>): void {
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
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onSubAllCh(reaction: ChannelReactionOnSubZationCh): FullReaction<ChannelReactionOnSubZationCh> {
        const fullReaction = new FullReaction<ChannelReactionOnSubZationCh>(reaction);
        this._mapSub.add(ChannelTarget.ALL, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on sub reaction for all channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offSubAllCh(fullReaction ?: FullReaction<ChannelReactionOnSubZationCh>): void {
        this._mapSub.remove(ChannelTarget.ALL, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on sub for an custom channel.
     * @example
     * onSubCustomCh((chName) => {});
     * @param chName
     * You can also respond to multiple channel names by giving an channel name array.
     * Or to all channel names if you pass as parameter null.
     * @param reaction
     * @return
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onSubCustomCh(chName: string | string[] | null,reaction: ChannelReactionOnSubCustomCh): FullReaction<ChannelReactionOnSubCustomCh> {
        const fullReaction = new FullReaction<ChannelReactionOnSubCustomCh>(reaction, {chName: chName});
        this._mapSub.add(ChannelTarget.C, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on sub reaction for an custom channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offSubCustomCh(fullReaction ?: FullReaction<ChannelReactionOnSubCustomCh>): void {
        this._mapSub.remove(ChannelTarget.C, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on sub for an custom id channel.
     * @example
     * onSubCustomCh((chId,chName) => {});
     * @param chName
     * You can also respond to multiple channel names by giving an channel name array.
     * Or to all channel names if you pass as parameter null.
     * @param chId
     * You can also respond to multiple channel ids by giving an channel id array.
     * Or to all channel ids if you pass as parameter null.
     * @param reaction
     * @return
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onSubCustomIdCh(chName: string | string[] | null,chId: string | string[] | null,reaction: ChannelReactionOnSubCustomIdCh): FullReaction<ChannelReactionOnSubCustomIdCh> {
        const fullReaction = new FullReaction<ChannelReactionOnSubCustomIdCh>(reaction, {chName, chId});
        this._mapSub.add(ChannelTarget.CID, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on sub reaction for an custom id channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offSubCustomIdCh(fullReaction ?: FullReaction<ChannelReactionOnSubCustomIdCh>): void {
        this._mapSub.remove(ChannelTarget.CID, fullReaction);
    }


    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on sub for the panel out channel.
     * @example
     * onSubPanelOutCh(() => {});
     * @param reaction
     * @return
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onSubPanelOutCh(reaction: ChannelReactionOnSubZationCh): FullReaction<ChannelReactionOnSubZationCh> {
        const fullReaction = new FullReaction<ChannelReactionOnSubZationCh>(reaction);
        this._mapSub.add(ChannelTarget.PANEL, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on sub reaction for panel out channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offSubPanelOutCh(fullReaction ?: FullReaction<ChannelReactionOnSubZationCh>): void {
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
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onClientUnsubAnyCh(reaction: ChannelReactionOnClientUnsubAnyCh): FullReaction<ChannelReactionOnClientUnsubAnyCh> {
        const fullReaction = new FullReaction<ChannelReactionOnClientUnsubAnyCh>(reaction);
        this._mapClientUnsub.add(ChannelTarget.ANY, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on client unsub reaction for any channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offClientUnsubAnyCh(fullReaction ?: FullReaction<ChannelReactionOnClientUnsubAnyCh>): void {
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
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onClientUnsubUserCh(reaction: ChannelReactionOnClientUnsubZationCh): FullReaction<ChannelReactionOnClientUnsubZationCh> {
        const fullReaction = new FullReaction<ChannelReactionOnClientUnsubZationCh>(reaction);
        this._mapClientUnsub.add(ChannelTarget.USER, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on client unsub reaction for user channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offClientUnsubUserCh(fullReaction ?: FullReaction<ChannelReactionOnClientUnsubZationCh>): void {
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
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onClientUnsubAuthUserGroupCh(reaction: ChannelReactionOnClientUnsubZationCh): FullReaction<ChannelReactionOnClientUnsubZationCh> {
        const fullReaction = new FullReaction<ChannelReactionOnClientUnsubZationCh>(reaction);
        this._mapClientUnsub.add(ChannelTarget.AUG, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on client unsub reaction for auth user group channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offClientUnsubAuthUserGroupCh(fullReaction ?: FullReaction<ChannelReactionOnClientUnsubZationCh>): void {
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
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onClientUnsubDefaultUserGroupCh(reaction: ChannelReactionOnClientUnsubZationCh): FullReaction<ChannelReactionOnClientUnsubZationCh> {
        const fullReaction = new FullReaction<ChannelReactionOnClientUnsubZationCh>(reaction);
        this._mapClientUnsub.add(ChannelTarget.DUG, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on client unsub reaction for default user group channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offClientUnsubDefaultUserGroupCh(fullReaction ?: FullReaction<ChannelReactionOnClientUnsubZationCh>): void {
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
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onClientUnsubAllCh(reaction: ChannelReactionOnClientUnsubZationCh): FullReaction<ChannelReactionOnClientUnsubZationCh> {
        const fullReaction = new FullReaction<ChannelReactionOnClientUnsubZationCh>(reaction);
        this._mapClientUnsub.add(ChannelTarget.ALL, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on client unsub reaction for all channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offClientUnsubAllCh(fullReaction ?: FullReaction<ChannelReactionOnClientUnsubZationCh>): void {
        this._mapClientUnsub.remove(ChannelTarget.ALL, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on client unsub for an custom channel.
     * @example
     * onClientUnsubCustomCh((chName) => {});
     * @param chName
     * You can also respond to multiple channel names by giving an channel name array.
     * Or to all channel names if you pass as parameter null.
     * @param reaction
     * @return
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onClientUnsubCustomCh(chName: string | string[] | null,reaction: ChannelReactionOnClientUnsubCustomCh): FullReaction<ChannelReactionOnClientUnsubCustomCh> {
        const fullReaction = new FullReaction<ChannelReactionOnClientUnsubCustomCh>(reaction, {chName: chName});
        this._mapClientUnsub.add(ChannelTarget.C, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on client unsub reaction for an custom channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offClientUnsubCustomCh(fullReaction ?: FullReaction<ChannelReactionOnClientUnsubCustomCh>): void {
        this._mapClientUnsub.remove(ChannelTarget.C, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on client unsub for an custom id channel.
     * @example
     * onClientUnsubCustomCh((chId,chName) => {});
     * @param chName
     * You can also respond to multiple channel names by giving an channel name array.
     * Or to all channel names if you pass as parameter null.
     * @param chId
     * You can also respond to multiple channel ids by giving an channel id array.
     * Or to all channel ids if you pass as parameter null.
     * @param reaction
     * @return
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onClientUnsubCustomIdCh(chName: string | string[] | null,chId: string | string[] | null,reaction: ChannelReactionOnClientUnsubCustomIdCh): FullReaction<ChannelReactionOnClientUnsubCustomIdCh> {
        const fullReaction = new FullReaction<ChannelReactionOnClientUnsubCustomIdCh>(reaction, {chName, chId});
        this._mapClientUnsub.add(ChannelTarget.CID, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on client unsub reaction for an custom id channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offClientUnsubCustomIdCh(fullReaction ?: FullReaction<ChannelReactionOnClientUnsubCustomIdCh>): void {
        this._mapClientUnsub.remove(ChannelTarget.CID, fullReaction);
    }


    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on client unsub for the panel out channel.
     * @example
     * onClientUnsubPanelOutCh(() => {});
     * @param reaction
     * @return
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onClientUnsubPanelOutCh(reaction: ChannelReactionOnClientUnsubZationCh): FullReaction<ChannelReactionOnClientUnsubZationCh> {
        const fullReaction = new FullReaction<ChannelReactionOnClientUnsubZationCh>(reaction);
        this._mapClientUnsub.add(ChannelTarget.PANEL, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on client unsub reaction for panel out channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offClientUnsubPanelOutCh(fullReaction ?: FullReaction<ChannelReactionOnClientUnsubZationCh>): void {
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
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onUnsubAnyCh(reaction: ChannelReactionOnUnsubAnyCh): FullReaction<ChannelReactionOnUnsubAnyCh> {
        const fullReaction = new FullReaction<ChannelReactionOnUnsubAnyCh>(reaction);
        this._mapUnsub.add(ChannelTarget.ANY, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on unsub reaction for any channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offUnsubAnyCh(fullReaction ?: FullReaction<ChannelReactionOnUnsubAnyCh>): void {
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
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onUnsubUserCh(reaction: ChannelReactionOnUnsubZationCh): FullReaction<ChannelReactionOnUnsubZationCh> {
        const fullReaction = new FullReaction<ChannelReactionOnUnsubZationCh>(reaction);
        this._mapUnsub.add(ChannelTarget.USER, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on unsub reaction for user channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offUnsubUserCh(fullReaction ?: FullReaction<ChannelReactionOnUnsubZationCh>): void {
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
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onUnsubAuthUserGroupCh(reaction: ChannelReactionOnUnsubZationCh): FullReaction<ChannelReactionOnUnsubZationCh> {
        const fullReaction = new FullReaction<ChannelReactionOnUnsubZationCh>(reaction);
        this._mapUnsub.add(ChannelTarget.AUG, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on unsub reaction for auth user group channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offUnsubAuthUserGroupCh(fullReaction ?: FullReaction<ChannelReactionOnUnsubZationCh>): void {
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
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onUnsubDefaultUserGroupCh(reaction: ChannelReactionOnUnsubZationCh): FullReaction<ChannelReactionOnUnsubZationCh> {
        const fullReaction = new FullReaction<ChannelReactionOnUnsubZationCh>(reaction);
        this._mapUnsub.add(ChannelTarget.DUG, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on unsub reaction for default user group channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offUnsubDefaultUserGroupCh(fullReaction ?: FullReaction<ChannelReactionOnUnsubZationCh>): void {
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
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onUnsubAllCh(reaction: ChannelReactionOnUnsubZationCh): FullReaction<ChannelReactionOnUnsubZationCh> {
        const fullReaction = new FullReaction<ChannelReactionOnUnsubZationCh>(reaction);
        this._mapUnsub.add(ChannelTarget.ALL, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on unsub reaction for all channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offUnsubAllCh(fullReaction ?: FullReaction<ChannelReactionOnUnsubZationCh>): void {
        this._mapUnsub.remove(ChannelTarget.ALL, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on unsub for an custom channel.
     * @example
     * onUnsubCustomCh((fromClient,chName) => {});
     * @param chName
     * You can also respond to multiple channel names by giving an channel name array.
     * Or to all channel names if you pass as parameter null.
     * @param reaction
     * @return
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onUnsubCustomCh(chName: string | string[] | null,reaction: ChannelReactionOnUnsubCustomCh): FullReaction<ChannelReactionOnUnsubCustomCh> {
        const fullReaction = new FullReaction<ChannelReactionOnUnsubCustomCh>(reaction, {chName: chName});
        this._mapUnsub.add(ChannelTarget.C, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on unsub reaction for an custom channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offUnsubCustomCh(fullReaction ?: FullReaction<ChannelReactionOnUnsubCustomCh>): void {
        this._mapUnsub.remove(ChannelTarget.C, fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on unsub for an custom id channel.
     * @example
     * onUnsubCustomCh((fromClient,chId,chName) => {});
     * @param chName
     * You can also respond to multiple channel names by giving an channel name array.
     * Or to all channel names if you pass as parameter null.
     * @param chId
     * You can also respond to multiple channel ids by giving an channel id array.
     * Or to all channel ids if you pass as parameter null.
     * @param reaction
     * @return
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onUnsubCustomIdCh(chName: string | string[] | null,chId: string | string[] | null,reaction: ChannelReactionOnUnsubCustomIdCh): FullReaction<ChannelReactionOnUnsubCustomIdCh> {
        const fullReaction = new FullReaction<ChannelReactionOnUnsubCustomIdCh>(reaction, {chName, chId});
        this._mapUnsub.add(ChannelTarget.CID, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on unsub reaction for an custom id channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offUnsubCustomIdCh(fullReaction ?: FullReaction<ChannelReactionOnUnsubCustomIdCh>): void {
        this._mapUnsub.remove(ChannelTarget.CID, fullReaction);
    }


    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on unsub for the panel out channel.
     * @example
     * onUnsubPanelOutCh((fromClient) => {});
     * @param reaction
     * @return
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onUnsubPanelOutCh(reaction: ChannelReactionOnUnsubZationCh): FullReaction<ChannelReactionOnUnsubZationCh> {
        const fullReaction = new FullReaction<ChannelReactionOnUnsubZationCh>(reaction);
        this._mapUnsub.add(ChannelTarget.PANEL, fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on unsub reaction for panel out channel.
     * @param fullReaction
     * If it is not given away all will be removed.
     */
    offUnsubPanelOutCh(fullReaction ?: FullReaction<ChannelReactionOnUnsubZationCh>): void {
        this._mapUnsub.remove(ChannelTarget.PANEL, fullReaction);
    }

    private async _triggerFilterDataEventBox(box: SBox<any> | undefined, valid: ValidChecker, ...data: any[]) {
        if (box) {
            await box.forEachAll(async (reaction: FullReaction<any>) => {
                if (valid(reaction.getFilter())) {
                    await reaction.getReactionHandler()(...data);
                }
            });
        }
    }

    private async _triggerDataEventBox(box: SBox<any> | undefined, ...data: any[]) {
        if (box) {
            await box.forEachAll(async (reaction: FullReaction<any>) => {
                await reaction.getReactionHandler()(...data);
            });
        }
    }

    private static _multiFilter(value, check): boolean {
        if (value === null) {
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
    async _triggerPub(target : ChannelTarget, event : string, data : any, {chName,chId,chFullName} : any, ssid ?: string) : Promise<void>
    {
        if(this.active) {
            switch (target)
            {
                case ChannelTarget.C:
                    const sameEventAndChFilter : ValidChecker = (filter : object) : boolean => {
                        return ChannelReactionBox._multiFilter(filter['event'],event) &&
                            ChannelReactionBox._multiFilter(filter['chName'],chName);};
                    await this._triggerFilterDataEventBox(this._mapPub.tryGet(ChannelTarget.C),sameEventAndChFilter,data,ssid,event,chName);
                    break;
                case ChannelTarget.CID:
                    const sameEventChOrIdFilter : ValidChecker = (filter : object) : boolean => {
                        return ChannelReactionBox._multiFilter(filter['event'],event) &&
                            ChannelReactionBox._multiFilter(filter['chName'],chName) &&
                            ChannelReactionBox._multiFilter(filter['chId'],chId);};
                    await this._triggerFilterDataEventBox(this._mapPub.tryGet(ChannelTarget.CID),sameEventChOrIdFilter,data,ssid,event,chId,chName);
                    break;
                default:
                    const sameEventFilter : ValidChecker = (filter : object) : boolean => {
                        return ChannelReactionBox._multiFilter(filter['event'],event);
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
                    break;
            }
        }
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Used internally.
     * Only use this method carefully.
     */
    async _triggerEvent(map : SboxMapper<FullReaction<any>>, target : ChannelTarget, {chName,chId,chFullName} : any, ...arg : any[]) : Promise<void>
    {
        if(this.active) {
            switch (target)
            {
                case ChannelTarget.C:
                    const sameEventAndChFilter : ValidChecker = (filter : object) : boolean => {
                        return ChannelReactionBox._multiFilter(filter['chName'],chName);};
                    await this._triggerFilterDataEventBox(map.tryGet(ChannelTarget.C),sameEventAndChFilter,...arg,chName);
                    break;
                case ChannelTarget.CID:
                    const sameEventChOrIdFilter : ValidChecker = (filter : object) : boolean => {
                        return ChannelReactionBox._multiFilter(filter['chName'],chName) &&
                               ChannelReactionBox._multiFilter(filter['chId'],chId);};
                    await this._triggerFilterDataEventBox(map.tryGet(ChannelTarget.CID),sameEventChOrIdFilter,...arg,chId,chName);
                    break;
                default:
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
                    break;
            }
        }
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Used internally.
     * Only use this method carefully.
     */
    get mapPub(): SboxMapper<FullReaction<any>> {
        return this._mapPub;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Used internally.
     * Only use this method carefully.
     */
    get mapKick(): SboxMapper<FullReaction<any>> {
        return this._mapKick;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Used internally.
     * Only use this method carefully.
     */
    get mapSubFail(): SboxMapper<FullReaction<any>> {
        return this._mapSubFail;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Used internally.
     * Only use this method carefully.
     */
    get mapSub(): SboxMapper<FullReaction<any>> {
        return this._mapSub;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Used internally.
     * Only use this method carefully.
     */
    get mapClientUnsub(): SboxMapper<FullReaction<any>> {
        return this._mapClientUnsub;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Used internally.
     * Only use this method carefully.
     */
    get mapUnsub(): SboxMapper<FullReaction<any>> {
        return this._mapUnsub;
    }
}

export = ChannelReactionBox;