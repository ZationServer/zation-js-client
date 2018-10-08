/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import ReactionBox    = require("../helper/react/box/reactionBox");
import Box            = require("../helper/box/box");
import FullReaction   = require("../helper/react/reaction/fullReaction");
import {ReactionOnCustomCh, ReactionOnCustomIdCh, ReactionOnZationCh} from "../helper/react/reaction/reactionHandler";
import {ZationChannelType}                                                  from "../helper/channel/zationChannelType";

type ValidChecker = (filter : object) => boolean;

class ChannelReactionBox extends ReactionBox
{
    private readonly userChReactionBox : Box<FullReaction<ReactionOnZationCh>>
        = new Box<FullReaction<ReactionOnZationCh>>();

    private readonly authUGChReactionBox : Box<FullReaction<ReactionOnZationCh>>
        = new Box<FullReaction<ReactionOnZationCh>>();

    private readonly allChReactionBox : Box<FullReaction<ReactionOnZationCh>>
        = new Box<FullReaction<ReactionOnZationCh>>();

    private readonly defaultUGChReactionBox : Box<FullReaction<ReactionOnZationCh>>
        = new Box<FullReaction<ReactionOnZationCh>>();

    private readonly customIdChReactionBox : Box<FullReaction<ReactionOnCustomIdCh>>
        = new Box<FullReaction<ReactionOnCustomIdCh>>();

    private readonly customChReactionBox : Box<FullReaction<ReactionOnCustomCh>>
        = new Box<FullReaction<ReactionOnCustomCh>>();

    constructor()
    {
        super();
    }

    // noinspection JSUnusedGlobalSymbols
    onUserChData(event : string,reaction : ReactionOnZationCh) : FullReaction<ReactionOnZationCh> {
        const fullReaction = new FullReaction<ReactionOnZationCh>(reaction,{event : event});
        this.userChReactionBox.addItem(fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    offUserChData(fullReaction : FullReaction<ReactionOnZationCh>) : boolean {
        return this.userChReactionBox.removeItem(fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    onAuthUserGroupChData(event : string,reaction : ReactionOnZationCh) : FullReaction<ReactionOnZationCh> {
        const fullReaction = new FullReaction<ReactionOnZationCh>(reaction,{event : event});
        this.authUGChReactionBox.addItem(fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    offAuthUserGroupChData(fullReaction : FullReaction<ReactionOnZationCh>) : boolean {
        return this.authUGChReactionBox.removeItem(fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    onDefaultGroupChData(event : string,reaction : ReactionOnZationCh) : FullReaction<ReactionOnZationCh> {
        const fullReaction = new FullReaction<ReactionOnZationCh>(reaction,{event : event});
        this.defaultUGChReactionBox.addItem(fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    offDefaultAuthGroupChData(fullReaction : FullReaction<ReactionOnZationCh>) : boolean {
        return this.defaultUGChReactionBox.removeItem(fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    onAllChData(event : string,reaction : ReactionOnZationCh) : FullReaction<ReactionOnZationCh> {
        const fullReaction = new FullReaction<ReactionOnZationCh>(reaction,{event : event});
        this.allChReactionBox.addItem(fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    offAllChData(fullReaction : FullReaction<ReactionOnZationCh>) : boolean {
        return this.allChReactionBox.removeItem(fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    onCustomChData(chName : string,event : string,reaction : ReactionOnCustomCh) : FullReaction<ReactionOnCustomCh> {
        const fullReaction = new FullReaction<ReactionOnCustomCh>(reaction,{chName : chName,event : event});
        this.customChReactionBox.addItem(fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    offCustomChData(fullReaction : FullReaction<ReactionOnCustomCh>) : boolean {
        return this.customChReactionBox.removeItem(fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    onCustomIdChData(chName : string,event : string,reaction : ReactionOnCustomIdCh,id ?: string) : FullReaction<ReactionOnCustomIdCh> {
        const fullReaction = new FullReaction<ReactionOnCustomIdCh>(reaction,{chName : chName,event : event, id : id});
        this.customIdChReactionBox.addItem(fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    offCustomIdChData(fullReaction : FullReaction<ReactionOnCustomIdCh>) : boolean {
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
        const sameEventFilter : ValidChecker = (filter : object) : boolean => {
            return filter['event'] === event;
        };

        if(this.active)
        {
            switch (type)
            {
                case ZationChannelType.USER:
                    await this._triggerDataEventBox(this.userChReactionBox,sameEventFilter,data,ssid);
                    break;
                case ZationChannelType.AUTH_USER_GROUP:
                    await this._triggerDataEventBox(this.authUGChReactionBox,sameEventFilter,data,ssid);
                    break;
                case ZationChannelType.DEFAULT_USER_GROUP:
                    await this._triggerDataEventBox(this.defaultUGChReactionBox,sameEventFilter,data,ssid);
                    break;
                case ZationChannelType.ALL:
                    await this._triggerDataEventBox(this.allChReactionBox,sameEventFilter,data,ssid);
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