/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import ReactionBox = require("../react/box/reactionBox");

type AddFunction = (reactionBox : ReactionBox) => void;

class ConfigTools
{
    static addJsonReactionBox(add : AddFunction,config : ReactionBox[] | ReactionBox) : void
    {
        if(Array.isArray(config)) {
            for(let i = 0; i < config.length; i++) {
                add(config[i]);
            }
        }
        else {
            add(config);
        }
    }
}

export = ConfigTools;

