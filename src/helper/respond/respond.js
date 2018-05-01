/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

class Respond
{
    constructor()
    {
        this._active = true;
    }

    // noinspection JSUnusedGlobalSymbols
    activate()
    {
        this._active = true;
    }

    // noinspection JSUnusedGlobalSymbols
    deactivate()
    {
        this._active = false;
    }

    static _addJsonReactions(box,config)
    {
        if(config !== undefined && Array.isArray(config))
        {
            for(let i = 0; i < config.length; i++)
            {
                box.addItem(config,key,config['overwrite']);
            }
        }
        else if(config !== undefined && typeof config === 'object')
        {
            for(let key in config)
            {
                if(config.hasOwnProperty(key))
                {
                    box.addItem(config,key,config['overwrite']);
                }
            }
        }
    }

    _trigger(data)
    {
    };
}

module.exports = Respond;