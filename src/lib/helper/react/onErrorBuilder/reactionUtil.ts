/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {ResponseReactionOnError} from "../reaction/reactionHandler";

export class ReactionUtil {

    static mergeReaction(reactions : ResponseReactionOnError[]) : ResponseReactionOnError
    {
        return (resp,filteredErrors) => {
            reactions.forEach((reaction) => {
                reaction(resp,filteredErrors);
            })
        }
    }

}