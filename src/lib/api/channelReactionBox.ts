/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import ReactionBox = require("../helper/react/box/reactionBox");
import Box = require("../helper/box/box");
import FullReaction = require("../helper/react/fullReaction");
import {ReactionOnCustomCh, ReactionOnCustomIdCh, ReactionOnZationCh} from "../helper/react/reactionHandler";
import {ChannelType} from "../helper/channel/channelType";

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
    onUserCh(event : string,reaction : ReactionOnZationCh) : FullReaction<ReactionOnZationCh> {
        const fullReaction = new FullReaction<ReactionOnZationCh>(reaction,{event : event});
        this.userChReactionBox.addItem(fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    removeOnUserCh(fullReaction : FullReaction<ReactionOnZationCh>) : boolean {
        return this.userChReactionBox.removeItem(fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    onAuthUserGroupCh(event : string,reaction : ReactionOnZationCh) : FullReaction<ReactionOnZationCh> {
        const fullReaction = new FullReaction<ReactionOnZationCh>(reaction,{event : event});
        this.authUGChReactionBox.addItem(fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    removeOnAuthUserGroupCh(fullReaction : FullReaction<ReactionOnZationCh>) : boolean {
        return this.authUGChReactionBox.removeItem(fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    onDefaultGroupCh(event : string,reaction : ReactionOnZationCh) : FullReaction<ReactionOnZationCh> {
        const fullReaction = new FullReaction<ReactionOnZationCh>(reaction,{event : event});
        this.defaultUGChReactionBox.addItem(fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    removeOnDefaultAuthGroupCh(fullReaction : FullReaction<ReactionOnZationCh>) : boolean {
        return this.defaultUGChReactionBox.removeItem(fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    onAllCh(event : string,reaction : ReactionOnZationCh) : FullReaction<ReactionOnZationCh> {
        const fullReaction = new FullReaction<ReactionOnZationCh>(reaction,{event : event});
        this.allChReactionBox.addItem(fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    removeOnAllCh(fullReaction : FullReaction<ReactionOnZationCh>) : boolean {
        return this.allChReactionBox.removeItem(fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    onCustomCh(chName : string,event : string,reaction : ReactionOnCustomCh) : FullReaction<ReactionOnCustomCh> {
        const fullReaction = new FullReaction<ReactionOnCustomCh>(reaction,{chName : chName,event : event});
        this.customChReactionBox.addItem(fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    removeOnCustomCh(fullReaction : FullReaction<ReactionOnCustomCh>) : boolean {
        return this.customChReactionBox.removeItem(fullReaction);
    }

    // noinspection JSUnusedGlobalSymbols
    onCustomIdCh(chName : string,event : string,reaction : ReactionOnCustomIdCh,id ?: string) : FullReaction<ReactionOnCustomIdCh> {
        const fullReaction = new FullReaction<ReactionOnCustomIdCh>(reaction,{chName : chName,event : event, id : id});
        this.customIdChReactionBox.addItem(fullReaction);
        return fullReaction;
    }

    // noinspection JSUnusedGlobalSymbols
    removeOnCustomIdCh(fullReaction : FullReaction<ReactionOnCustomIdCh>) : boolean {
        return this.customIdChReactionBox.removeItem(fullReaction);
    }

    async _triggerDataEventBox(box : Box<FullReaction<ReactionOnZationCh | ReactionOnCustomCh>>, valid : ValidChecker, data : any)
    {
        let promises : Promise<void>[] = [];
        promises.push(box.forEach(async (reaction : FullReaction<ReactionOnZationCh | ReactionOnCustomCh>) =>
        {
            if(valid(reaction.getFilter())) {
                await reaction.getReactionHandler()(data);
            }
        }));
        await Promise.all(promises);
    }

    async _triggerDataIdEventBox(box : Box<FullReaction<ReactionOnCustomIdCh>>, valid : ValidChecker, data : any, id : string)
    {
        let promises : Promise<void>[] = [];
        promises.push(box.forEach(async (reaction : FullReaction<ReactionOnCustomIdCh>) =>
        {
            if(valid(reaction.getFilter())) {
                await reaction.getReactionHandler()(data,id);
            }
        }));
        await Promise.all(promises);
    }

    async _triggerZationCh(type : ChannelType,event : string,data : any)
    {
        const sameEventFilter : ValidChecker = (filter : object) : boolean => {
            return filter['event'] === event;
        };

        if(this.active)
        {
            switch (type)
            {
                case ChannelType.USER:
                    await this._triggerDataEventBox(this.userChReactionBox,sameEventFilter,data);
                    break;
                case ChannelType.AUTH_USER_GROUP:
                    await this._triggerDataEventBox(this.authUGChReactionBox,sameEventFilter,data);
                    break;
                case ChannelType.DEFAULT_USER_GROUP:
                    await this._triggerDataEventBox(this.defaultUGChReactionBox,sameEventFilter,data);
                    break;
                case ChannelType.ALL:
                    await this._triggerDataEventBox(this.allChReactionBox,sameEventFilter,data);
                    break;
            }
        }
    }

    async _triggerCustomCh(chName : string,event : string,data : any)
    {
        if(this.active)
        {
            const sameEventAndChFilter : ValidChecker = (filter : object) : boolean =>
            {
                return filter['event'] === event && filter['chName'] === chName;
            };

            await this._triggerDataEventBox(this.customChReactionBox,sameEventAndChFilter,data);
        }
    }

    async _triggerCustomIdCh(chName : string,id : string,event : string,data : any)
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
            await this._triggerDataIdEventBox(this.customIdChReactionBox,sameEventChOrIdFilter,data,id);
        }
    }

}

export = ChannelReactionBox;