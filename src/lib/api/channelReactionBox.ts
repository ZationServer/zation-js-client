/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import ReactionBox    = require("../helper/react/box/reactionBox");
import Box            = require("../helper/box/box");
import FullReaction   = require("../helper/react/reaction/fullReaction");
import {ReactionOnPubCustomCh, ReactionOnPubCustomIdCh, ReactionOnPubZationCh} from "../helper/react/reaction/reactionHandler";
import {ZationChannelType}                                                  from "../helper/channel/zationChannelType";

type ValidChecker = (filter : object) => boolean;

class ChannelReactionBox extends ReactionBox
{
    private readonly userChReactionBox : Box<FullReaction<ReactionOnPubZationCh>>
        = new Box<FullReaction<ReactionOnPubZationCh>>();

    private readonly authUGChReactionBox : Box<FullReaction<ReactionOnPubZationCh>>
        = new Box<FullReaction<ReactionOnPubZationCh>>();

    private readonly defaultUGChReactionBox : Box<FullReaction<ReactionOnPubZationCh>>
        = new Box<FullReaction<ReactionOnPubZationCh>>();

    private readonly allChReactionBox : Box<FullReaction<ReactionOnPubZationCh>>
        = new Box<FullReaction<ReactionOnPubZationCh>>();

    private readonly panelOutChReactionBox : Box<FullReaction<ReactionOnPubZationCh>>
        = new Box<FullReaction<ReactionOnPubZationCh>>();

    private readonly customIdChReactionBox : Box<FullReaction<ReactionOnPubCustomIdCh>>
        = new Box<FullReaction<ReactionOnPubCustomIdCh>>();

    private readonly customChReactionBox : Box<FullReaction<ReactionOnPubCustomCh>>
        = new Box<FullReaction<ReactionOnPubCustomCh>>();

    constructor()
    {
        super();
    }

    //OnPub Handler
    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on publish in the user channel.
     * @example
     * onUserChPub((data,event,socketSrcSid) => {});
     * @param event
     * You can also respond to multiple events by giving an event array.
     * Or to all events if you pass as parameter null.
     * @param reaction
     * @return
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onUserChPub(event : string | string[] | null,reaction : ReactionOnPubZationCh) : FullReaction<ReactionOnPubZationCh> {
        const fullReaction = new FullReaction<ReactionOnPubZationCh>(reaction,{event : event});
        this.userChReactionBox.addItem(fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on publish in the user channel reaction.
     * @param fullReaction
     */
    offUserChPub(fullReaction : FullReaction<ReactionOnPubZationCh>) : void {
        this.userChReactionBox.removeItem(fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on publish in the auth user group channel.
     * @example
     * onAuthUserGroupChPub((data,event,socketSrcSid) => {});
     * @param event
     * You can also respond to multiple events by giving an event array.
     * Or to all events if you pass as parameter null.
     * @param reaction
     * @return
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onAuthUserGroupChPub(event : string | string[] | null,reaction : ReactionOnPubZationCh) : FullReaction<ReactionOnPubZationCh> {
        const fullReaction = new FullReaction<ReactionOnPubZationCh>(reaction,{event : event});
        this.authUGChReactionBox.addItem(fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on publish in the auth user group channel reaction.
     * @param fullReaction
     */
    offAuthUserGroupChPub(fullReaction : FullReaction<ReactionOnPubZationCh>) : void {
        this.authUGChReactionBox.removeItem(fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on publish in the default user group channel.
     * @example
     * onDefaultUserGroupChPub((data,event,socketSrcSid) => {});
     * @param event
     * You can also respond to multiple events by giving an event array.
     * Or to all events if you pass as parameter null.
     * @param reaction
     * @return
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onDefaultUserGroupChPub(event : string | string[] | null,reaction : ReactionOnPubZationCh) : FullReaction<ReactionOnPubZationCh> {
        const fullReaction = new FullReaction<ReactionOnPubZationCh>(reaction,{event : event});
        this.defaultUGChReactionBox.addItem(fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on publish in the default user group channel reaction.
     * @param fullReaction
     */
    offDefaultUserGroupChPub(fullReaction : FullReaction<ReactionOnPubZationCh>) : void {
        this.defaultUGChReactionBox.removeItem(fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on publish in the all channel.
     * @example
     * onAllChPub((data,event,socketSrcSid) => {});
     * @param event
     * You can also respond to multiple events by giving an event array.
     * Or to all events if you pass as parameter null.
     * @param reaction
     * @return
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onAllChPub(event : string | string[] | null,reaction : ReactionOnPubZationCh) : FullReaction<ReactionOnPubZationCh> {
        const fullReaction = new FullReaction<ReactionOnPubZationCh>(reaction,{event : event});
        this.allChReactionBox.addItem(fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on publish in the all channel reaction.
     * @param fullReaction
     */
    offAllChPub(fullReaction : FullReaction<ReactionOnPubZationCh>) : void {
        this.allChReactionBox.removeItem(fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on publish in the panel out channel.
     * @example
     * onPanelOutChPub((data,event,socketSrcSid) => {});
     * @param event
     * You can also respond to multiple events by giving an event array.
     * Or to all events if you pass as parameter null.
     * @param reaction
     * @return
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onPanelOutChPub(event : string | string[] | null,reaction : ReactionOnPubZationCh) : FullReaction<ReactionOnPubZationCh> {
        const fullReaction = new FullReaction<ReactionOnPubZationCh>(reaction,{event : event});
        this.panelOutChReactionBox.addItem(fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on publish in the panel out channel reaction.
     * @param fullReaction
     */
    offPanelOutChPub(fullReaction : FullReaction<ReactionOnPubZationCh>) : void {
        this.panelOutChReactionBox.removeItem(fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on publish in an custom channel.
     * @example
     * onAllChPub((data,chName,socketSrcSid) => {});
     * @param chName
     * @param event
     * @param reaction
     * @return
     * It returns a FullReaction, you can use it to remove this Reaction from the box with the off method.
     */
    onCustomChPub(chName : string | string[] | null,event : string | string[] | null,reaction : ReactionOnPubCustomCh) : FullReaction<ReactionOnPubCustomCh> {
        const fullReaction = new FullReaction<ReactionOnPubCustomCh>(reaction,{chName : chName,event : event});
        this.customChReactionBox.addItem(fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    offCustomChPub(fullReaction : FullReaction<ReactionOnPubCustomCh>) : boolean {
        return this.customChReactionBox.removeItem(fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    onCustomIdChData(chName : string, event : string, reaction : ReactionOnPubCustomIdCh, id ?: string) : FullReaction<ReactionOnPubCustomIdCh> {
        const fullReaction = new FullReaction<ReactionOnPubCustomIdCh>(reaction,{chName : chName,event : event, id : id});
        this.customIdChReactionBox.addItem(fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    offCustomIdChData(fullReaction : FullReaction<ReactionOnPubCustomIdCh>) : boolean {
        return this.customIdChReactionBox.removeItem(fullReaction);
    }

    private async _triggerDataEventBox(box : Box<any>, valid : ValidChecker, ...data : any[])
    {
        let promises : Promise<void>[] = [];
        promises.push(box.forEach(async (reaction : FullReaction<any>) =>
        {
            if(valid(reaction.getFilter())) {
                await reaction.getReactionHandler()(...data);
            }
        }));
        await Promise.all(promises);
    }

    async _triggerZationChData(type : ZationChannelType, event : string, data : any, ssid ?: string)
    {
        const sameEventFilter : ValidChecker = (filter : object) : boolean =>
        {
            if(filter['event'] === null) {
                return true;
            }
            else if(Array.isArray(filter['event'])) {
                return filter['event'].indexOf(event) !== -1;
            }
            else {
                return filter['event'] === event;
            }
        };

        if(this.active)
        {
            switch (type)
            {
                case ZationChannelType.USER:
                    await this._triggerDataEventBox(this.userChReactionBox,sameEventFilter,data,event,ssid);
                    break;
                case ZationChannelType.AUTH_USER_GROUP:
                    await this._triggerDataEventBox(this.authUGChReactionBox,sameEventFilter,data,event,ssid);
                    break;
                case ZationChannelType.DEFAULT_USER_GROUP:
                    await this._triggerDataEventBox(this.defaultUGChReactionBox,sameEventFilter,data,event,ssid);
                    break;
                case ZationChannelType.ALL:
                    await this._triggerDataEventBox(this.allChReactionBox,sameEventFilter,data,event,ssid);
                    break;
                case ZationChannelType.PANEL_OUT:
                    await this._triggerDataEventBox(this.panelOutChReactionBox,sameEventFilter,data,event,ssid);
                    break;
            }
        }
    }

    async _triggerCustomChData(chName : string, event : string, data : any, ssid ?: string)
    {
        if(this.active)
        {
            const sameEventAndChFilter : ValidChecker = (filter : object) : boolean =>
            {
                return filter['event'] === event && filter['chName'] === chName;
            };

            await this._triggerDataEventBox(this.customChReactionBox,sameEventAndChFilter,data,chName,ssid);
        }
    }

    async _triggerCustomIdChData(chName : string, id : string, event : string, data : any, ssid ?: string)
    {
        if(this.active)
        {
            const sameEventChOrIdFilter : ValidChecker = (filter : object) : boolean =>
            {
                return (filter['event'] === event && filter['chName'] === chName) &&
                    (
                        filter['id'] === undefined ||
                        (
                            filter['id'] === id
                        )
                    );
            };
            await this._triggerDataEventBox(this.customIdChReactionBox,sameEventChOrIdFilter,data,chName,id,ssid);
        }
    }

}

export = ChannelReactionBox;