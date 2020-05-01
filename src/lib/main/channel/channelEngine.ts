/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

// noinspection ES6PreferShortImport
import {Zation} from '../../core/zation';
// noinspection ES6PreferShortImport
import {SubscribeFailedError} from '../error/subscribeFailedError';
// noinspection ES6PreferShortImport
import {ChannelReactionBox} from './channelReactionBox';
// noinspection ES6PreferShortImport
import {PublishFailedError} from '../error/publishFailedError';
// noinspection ES6PreferShortImport
import {TimeoutError} from '../error/timeoutError';
import ConnectionUtils, {WaitForConnectionOption} from '../utils/connectionUtils';
import PubData, {ChannelEvent, ChannelTarget, ZationChannel} from './channelDefinitions';

export class ChannelEngine
{
    private readonly zation: Zation;

    constructor(zation: Zation) {
        this.zation = zation;
    }

    // noinspection JSUnusedGlobalSymbols
    async subUserChannel(userId: string | number,retrySubForever : boolean = true) {
        await this.subZationChannel(ZationChannel.USER_CHANNEL_PREFIX + userId,ChannelTarget.User,retrySubForever);
    }

    // noinspection JSUnusedGlobalSymbols
    hasSubUserChannel(userId: string | number): boolean  {
        return this.hasSubChannel(ZationChannel.USER_CHANNEL_PREFIX + userId);
    }

    // noinspection JSUnusedGlobalSymbols
    unsubUserChannel(userId: string | number,andDestroy: boolean = true) {
       this.unsubChannel(ZationChannel.USER_CHANNEL_PREFIX + userId,andDestroy);
    }

    // noinspection JSUnusedGlobalSymbols
    async subAuthUserGroupChannel(authGroup: string,retrySubForever : boolean = true) {
        await this.subZationChannel(ZationChannel.AUTH_USER_GROUP_PREFIX + authGroup,ChannelTarget.Aug,retrySubForever);
    }

    // noinspection JSUnusedGlobalSymbols
    hasSubAuthUserGroupChannel(authGroup: string): boolean  {
        return this.hasSubChannel(ZationChannel.AUTH_USER_GROUP_PREFIX + authGroup);
    }

    // noinspection JSUnusedGlobalSymbols
    unsubAuthUserGroupChannel(authGroup: string,andDestroy: boolean = true) {
        this.unsubChannel(ZationChannel.AUTH_USER_GROUP_PREFIX + authGroup,andDestroy);
    }

    // noinspection JSUnusedGlobalSymbols
    async subDefaultUserGroupChannel(retrySubForever : boolean = true) {
        await this.subZationChannel(ZationChannel.DEFAULT_USER_GROUP,ChannelTarget.Dug,retrySubForever);
    }

    // noinspection JSUnusedGlobalSymbols
    hasSubDefaultUserGroupChannel(): boolean {
        return this.hasSubChannel(ZationChannel.DEFAULT_USER_GROUP);
    }

    // noinspection JSUnusedGlobalSymbols
    unsubDefaultUserGroupChannel(andDestroy: boolean = true) {
        this.unsubChannel(ZationChannel.DEFAULT_USER_GROUP,andDestroy);
    }

    // noinspection JSUnusedGlobalSymbols
    async subAllChannel(retrySubForever : boolean = true) {
        await this.subZationChannel(ZationChannel.ALL,ChannelTarget.All,retrySubForever);
    }

    // noinspection JSUnusedGlobalSymbols
    hasSubAllChannel(): boolean {
        return this.hasSubChannel(ZationChannel.ALL);
    }

    // noinspection JSUnusedGlobalSymbols
    unsubAllChannel(andDestroy: boolean = true) {
        this.unsubChannel(ZationChannel.ALL,andDestroy);
    }

    // noinspection JSUnusedGlobalSymbols
    async subPanelOutChannel(retrySubForever : boolean =  true) {
        await this.subZationChannel(ZationChannel.PANEL_OUT,ChannelTarget.Panel,retrySubForever);
    }

    // noinspection JSUnusedGlobalSymbols
    hasSubPanelOutChannel(): boolean {
        return this.hasSubChannel(ZationChannel.PANEL_OUT);
    }

    // noinspection JSUnusedGlobalSymbols
    unsubPanelOutChannel(andDestroy: boolean = true) {
        this.unsubChannel(ZationChannel.PANEL_OUT,andDestroy);
    }

    subChannel(channel: string,chTarget: ChannelTarget,chInfoObj, watcher: Function,retrySubForever: boolean, subOptions?: object): Promise<void> {
        return new Promise<void>(((resolve, reject) => {
            const ch = this.zation.getSocket().channel(channel);

            if(retrySubForever){
                ch['retrySubForever'] = true;
            }

            //register
            ch.once('subscribe',() => {
                //watcher
                ch.watch(watcher);
                resolve();
            });

            ch.once('subscribeFail',async (err) => {
                reject(new SubscribeFailedError(err));
            });

            ch.on('kickOut',(msg) =>
                this.zation._getChannelReactionMainBox().forEachParallel((chReactionBox: ChannelReactionBox) =>
                    chReactionBox._triggerEvent(chTarget,ChannelEvent.KickOut,chInfoObj,msg)));

            ch.on('subscribeFail',(err) =>
                this.zation._getChannelReactionMainBox().forEachParallel((chReactionBox: ChannelReactionBox) =>
                    chReactionBox._triggerEvent(chTarget,ChannelEvent.SubscribeFail,chInfoObj,err)));

            ch.on('subscribe',() =>
                this.zation._getChannelReactionMainBox().forEachParallel((chReactionBox: ChannelReactionBox) =>
                    chReactionBox._triggerEvent(chTarget,ChannelEvent.Subscribe,chInfoObj)));

            ch.on('unsubscribe',(name,fromClient) =>
                this.zation._getChannelReactionMainBox().forEachParallel((chReactionBox: ChannelReactionBox) =>
                    chReactionBox._triggerEvent(chTarget,ChannelEvent.Unsubscribe,chInfoObj,fromClient)));

            //sub
            ch.subscribe(subOptions);
        }));
    }


    async subZationChannel(channel: string, target: ChannelTarget,retrySubForever : boolean): Promise<void> {
       const infoObj = {};
       await this.subChannel(channel,target,infoObj,async (input: PubData) => {
           if(typeof input === 'object') {
               const event = input.e;
               const data = input.d;
               const sSid = input.sSid;

               await this.zation._getChannelReactionMainBox().forEachParallel(async (channelReactionBox: ChannelReactionBox) => {
                   await channelReactionBox._triggerPub(target,event,data,infoObj,sSid);
               })
           }
       },retrySubForever);
    }

    unsubChannel(channel: string,andDestroy: boolean = true): void
    {
        const socket = this.zation.getSocket();
        if(!!socket) {
            if(andDestroy) {
                socket.destroyChannel(channel);
            }
            else {
                socket.unsubscribe(channel);
                socket.unwatch(channel);
            }
        }
    }

    hasSubChannel(channel): boolean {
        const socket: any = this.zation.getSocket();
        return (!!socket && socket.isSubscribed(channel));
    }

    //Part Custom Channel
    // noinspection JSUnusedGlobalSymbols
    async subCustomCh(identifier: string, member?: string, retrySubForever : boolean = true): Promise<void>
    {
        let chName = ZationChannel.CUSTOM_CHANNEL_PREFIX + identifier;
        if(member !== undefined){
            chName += (ZationChannel.CUSTOM_CHANNEL_MEMBER_SEPARATOR + member);
        }

        const infoObj = {identifier,member};
        await this.subChannel
        (chName, ChannelTarget.Custom, infoObj,
            async (input: PubData) => {
                if(typeof input === 'object') {
                    const event = input.e;
                    const data = input.d;
                    const sSid = input.sSid;

                    await this.zation._getChannelReactionMainBox().forEachParallel(async (channelReactionBox: ChannelReactionBox) => {
                        await channelReactionBox._triggerPub(
                            ChannelTarget.Custom,
                            event,
                            data,
                            infoObj,
                            sSid
                        );
                    });
                }
        },retrySubForever);
    }

    // noinspection JSUnusedGlobalSymbols
    static getCustomChName(identifier?: string, member?: string): string {
        if(identifier !== undefined) {
            if(member !== undefined){
                return ZationChannel.CUSTOM_CHANNEL_PREFIX + identifier +
                    ZationChannel.CUSTOM_CHANNEL_MEMBER_SEPARATOR + member;
            }
            else {
                return ZationChannel.CUSTOM_CHANNEL_PREFIX + identifier;
            }
        }
        else {
            return ZationChannel.CUSTOM_CHANNEL_PREFIX;
        }
    }

    // noinspection JSUnusedGlobalSymbols
    unsubscribeCustomCh(identifier?: string,member?: string,andDestroy: boolean = true): string[] {
        return this.unsubscribeWithIndex(ChannelEngine.getCustomChName(identifier,member),andDestroy);
    }

    getSubCustomCh(identifier?: string,member?: string): string[] {
        return this.getSubsWithIndex(ChannelEngine.getCustomChName(identifier,member));
    }

    // noinspection JSUnusedGlobalSymbols
    hasSubCustomCh(identifier?: string,member?: string): boolean {
        return this.getSubCustomCh(identifier,member).length > 0;
    }

    // noinspection JSUnusedGlobalSymbols
    unsubscribeWithIndex(channelName: string, andDestroy: boolean): string[]
    {
        const socket = this.zation.getSocket();
        let unsubscribedChannels: string[] = [];
        if(!!socket) {
            const subs = socket.subscriptions(false);
            for(let i = 0; i < subs.length; i++) {
                if(subs[i].indexOf(channelName) !== -1) {
                    this.unsubChannel(subs[i],andDestroy);
                    unsubscribedChannels.push(subs[i]);
                }
            }
        }
        return unsubscribedChannels;
    }

    getSubsWithIndex(channelName: string): string[]
    {
        const socket = this.zation.getSocket();
        let foundSubs: string[] = [];
        if(!!socket) {
            const subs = socket.subscriptions(false);
            for(let i = 0; i < subs.length; i++) {
                if(subs[i].indexOf(channelName) !== -1) {
                    foundSubs.push(subs[i]);
                }
            }
        }
        return foundSubs;
    }

    static buildPubData(eventName: string,data: any): PubData
    {
        return {
            e: eventName,
            d: data
        };
    }

    private async publish(channelName: string,eventName: string,data: any,waitForConnection: WaitForConnectionOption): Promise<void>
    {
        await ConnectionUtils.checkConnection
        (this.zation,waitForConnection,'To publish data.');

        return new Promise<void>(async (resolve, reject) => {
            this.zation.getSocket().publish(channelName,ChannelEngine.buildPubData(eventName,data),(err) => {
                if(err){
                    if(err.name === 'TimeoutError'){
                        reject(new TimeoutError(err.message));
                    }
                    else {
                        reject(new PublishFailedError(err));
                    }
                }
                else{
                    resolve();
                }
            });
        });
    }

    pubUserCh(userId: string | number,event: string, data: any,waitForConnection: WaitForConnectionOption): Promise<void> {
        return this.publish(ZationChannel.USER_CHANNEL_PREFIX + userId,event,data,waitForConnection);
    }

    pubAuthUserGroupCh(authUserGroup: string,event: string, data: any,waitForConnection: WaitForConnectionOption): Promise<void> {
        return this.publish(ZationChannel.AUTH_USER_GROUP_PREFIX + authUserGroup,event,data,waitForConnection);
    }

    pubDefaultUserGroupCh(event: string, data: any,waitForConnection: WaitForConnectionOption): Promise<void> {
        return this.publish(ZationChannel.DEFAULT_USER_GROUP,event,data,waitForConnection);
    }

    pubAllCh(event: string, data: any,waitForConnection: WaitForConnectionOption): Promise<void> {
        return this.publish(ZationChannel.ALL,event,data,waitForConnection);
    }

    pubPanelInCh(event: string, data: any,waitForConnection: WaitForConnectionOption): Promise<void> {
        return this.publish(ZationChannel.PANEL_IN,event,data,waitForConnection);
    }

    pubCustomCh({identifier,member}: {identifier: string,member?: string},event: string, data: any,
                      waitForConnection: WaitForConnectionOption): Promise<void> {
        return this.publish(ChannelEngine.getCustomChName(identifier,member),event,data,waitForConnection);
    }
}