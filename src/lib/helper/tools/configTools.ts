/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import ReactionBox = require("../react/box/reactionBox");

type AddFunction = (reactionBox : ReactionBox, key ?: string) => void;

class ConfigTools
{
    static addJsonReactionBox(add : AddFunction,config : Record<string,ReactionBox> | ReactionBox[] | ReactionBox) : void
    {
        if(Array.isArray(config)) {
            for(let i = 0; i < config.length; i++) {
                add(config[i]);
            }
        }
        else if(typeof config === 'object')
        {
            for(let key in config) {
                if(config.hasOwnProperty(key)) {
                    add(config[key],key);
                }
            }
        }
        else {
            add(config);
        }
    }

}

export = ConfigTools;

