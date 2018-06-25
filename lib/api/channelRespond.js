/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

const Respond = require('./../helper/respond/respond');
const ZationConst = require('./../helper/constants/constWrapper');

class ChannelRespond extends Respond
{
    constructor(json)
    {
        super();
        //Reactions
        this._userChannelReactions = new Box(ChannelRespond._checkChannelValid);
        this._authGroupChannelReactions = new Box(ChannelRespond._checkChannelValid);
        this._allChannelReactions = new Box(ChannelRespond._checkChannelValid);
        this._defaultGroupChannelReactions = new Box(ChannelRespond._checkChannelValid);

        this._specialChannelReactions = new Box(ChannelRespond._checkSpecialChannelValid);

        if(json !== undefined)
        {
            this.addReactions(json);
        }
    }

    static _checkChannelValid(config)
    {
        return config['event'] !== undefined && config['reaction'] !== undefined;
    }

    static _checkSpecialChannelValid(config)
    {
        return config['reaction'] !== undefined;
    }

    addReactions(json)
    {
        if(json['onUserCh'] !== undefined)
        {
            Respond._addJsonReactions(this._userChannelReactions,json['onUserCh']);
        }
        if(json['onAuthGroupCh'] !== undefined)
        {
            Respond._addJsonReactions(this._authGroupChannelReactions,json['onAuthGroupCh']);
        }
        if(json['onDefaultAuthGroupCh'] !== undefined)
        {
            Respond._addJsonReactions(this._defaultGroupChannelReactions,json['onDefaultGroupCh']);
        }
        if(json['onAllCh'] !== undefined)
        {
            Respond._addJsonReactions(this._allChannelReactions,json['onAllCh']);
        }
        if(json['onSpecialCh'] !== undefined)
        {
            Respond._addJsonReactions(this._specialChannelReactions,json['onSpecialCh'],true);
        }
    }

    // noinspection JSUnusedGlobalSymbols
    onUserCh(event,reaction,key = undefined,overwrite = true)
    {
        return this._userChannelReactions.addItem({event : event,reaction : reaction},key,overwrite);
    }

    // noinspection JSUnusedGlobalSymbols
    removeOnUserCh(key)
    {
        return this._userChannelReactions.removeItem(key);
    }

    // noinspection JSUnusedGlobalSymbols
    onAuthGroupCh(event,reaction,key,overwrite = true)
    {
        return this._authGroupChannelReactions.addItem({event : event,reaction : reaction},key,overwrite);
    }

    // noinspection JSUnusedGlobalSymbols
    removeOnAuthGroupCh(key)
    {
        return this._authGroupChannelReactions.removeItem(key)
    }

    // noinspection JSUnusedGlobalSymbols
    onDefaultGroupCh(event,reaction,key,overwrite = true)
    {
        return this._defaultGroupChannelReactions.addItem({event : event,reaction : reaction},key,overwrite);
    }

    // noinspection JSUnusedGlobalSymbols
    removeOnDefaultAuthGroupCh(key)
    {
        return this._defaultGroupChannelReactions.removeItem(key);
    }

    // noinspection JSUnusedGlobalSymbols
    onAllCh(event,reaction,key,overwrite = true)
    {
        return this._allChannelReactions.addItem({event : event,reaction : reaction},key,overwrite);
    }

    // noinspection JSUnusedGlobalSymbols
    removeOnAllCh(key)
    {
        return this._allChannelReactions.removeItem(key);
    }

    // noinspection JSUnusedGlobalSymbols
    onSpecialCh(filter,reaction,key,overwrite = true)
    {
        return this._specialChannelReactions.addItem({filter : filter,reaction : reaction},key,overwrite);
    }

    // noinspection JSUnusedGlobalSymbols
    removeOnSpecialCh(key)
    {
        return this._specialChannelReactions.removeItem(key);
    }

    static _triggerReaction({reaction,channel,id,event,isSpecial,data})
    {
        if(typeof reaction === 'function')
        {
            reaction(data);
        }
        else if(reaction instanceof ChannelRespond)
        {
            reaction._trigger({channel : channel, event : event, isSpecial : isSpecial, data : data, id : id});
        }
    }

    static _triggerChannelReactions(box,event,channel,data)
    {
        box.forEach((respond) => {

            if(respond['event'] !== undefined && respond['event'] === event
                && respond['reaction'] !== undefined)
            {
                ChannelRespond._triggerReaction(
                    {reaction : respond['reaction'],channel : channel,event : event,isSpecial : false,data : data});
            }
        });
    }

    static _isFilteredSpecialRespond(filter,channel,event,id)
    {
        if(filter !== undefined)
        {
            if(filter['channel'] !== undefined
                && filter['channel'] !== channel)
            {
                return false;
            }

            if(filter['id'] !== undefined
                && filter['id'] !== id)
            {
                return false;
            }

            if(filter['event'] !== undefined
                && filter['event'] !== event)
            {
                return false;
            }
        }

        return true;
    }

    static _triggerSpecialChannelReactions(box,channel,event,id,data)
    {
        box.forEach((respond) => {

            if(respond['reaction'] !== undefined &&
                ChannelRespond._isFilteredSpecialRespond(respond['filter'],channel,event,id))
            {
                ChannelRespond._triggerReaction(
                    {
                        reaction : respond['reaction'] ,
                        channel : channel,
                        event : event,
                        data : data,
                        id : id,
                        isSpecial : true
                    });
            }
        });
    }

    _trigger({channel,event,id,isSpecial,data})
    {
        if(this._active)
        {
            if (isSpecial) {
                ChannelRespond._triggerSpecialChannelReactions(this._specialChannelReactions, channel, event, id, data);
            }
            else {
                if (channel === ZationConst.CHANNEL_USER_CHANNEL_PREFIX) {
                    ChannelRespond._triggerChannelReactions(this._userChannelReactions, event, channel, data);
                }
                else if (channel === ZationConst.CHANNEL_AUTH_GROUP_PREFIX) {
                    ChannelRespond._triggerChannelReactions(this._authGroupChannelReactions, event, channel, data);
                }
                else if (channel === ZationConst.CHANNEL_ALL) {
                    ChannelRespond._triggerChannelReactions(this._allChannelReactions, event, channel, data);
                }
                else if (channel === ZationConst.CHANNEL_DEFAULT_GROUP) {
                    ChannelRespond._triggerChannelReactions(this._defaultGroupChannelReactions, event, channel, data);
                }
            }
        }
    }
}

module.exports = ChannelRespond;