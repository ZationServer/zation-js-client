/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import ReactionBox = require("../helper/react/box/reactionBox");

class ResponseReactionBox extends ReactionBox
{






    // noinspection JSUnusedGlobalSymbols
    onError(reaction, filter, key, overwrite = true)
    {
        return ResultRespond._addReaction(reaction, filter, key, overwrite, this._onErrorReactionBox);
    }

    // noinspection JSUnusedGlobalSymbols
    removeOnError(key)
    {
        return this._onBothReactionBox.removeItem(key);
    }

    // noinspection JSUnusedGlobalSymbols
    onBoth(reaction, key, overwrite = true)
    {
        return ResultRespond._addReaction(reaction, undefined, key, overwrite, this._onBothReactionBox);
    }

    // noinspection JSUnusedGlobalSymbols
    removeOnBoth(key)
    {
        return this._onBothReactionBox.removeItem(key);
    }

    // noinspection JSUnusedGlobalSymbols
    onSuccessful(reaction, filter, key, overwrite = true)
    {
        return ResultRespond._addReaction(reaction, filter, key, overwrite, this._onSuccesfulReactionBox);
    }

    // noinspection JSUnusedGlobalSymbols
    removeOnSuccessful(key)
    {
        return this._onSuccesfulReactionBox.removeItem(key);
    }

}

export = ResponseReactionBox;