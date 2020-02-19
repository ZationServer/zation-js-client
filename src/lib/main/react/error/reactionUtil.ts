/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {ResponseReactionOnError} from "../reaction/reactionHandler";

export class ReactionUtil {

    static mergeReaction(reactions: ResponseReactionOnError[]): ResponseReactionOnError
    {
        return (resp,filteredErrors) => {
            reactions.forEach((reaction) => {
                reaction(resp,filteredErrors);
            })
        }
    }

}