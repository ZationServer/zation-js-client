/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {ReactionOnError} from "../reactionHandler";
import ResponseReactAble = require("../responseReactAble");
import {AbstractOnErrorBuilder} from "./abstractOnErrorBuilder";

export class OnAllErrorBuilder<T extends ResponseReactAble> extends AbstractOnErrorBuilder<T>
{
    constructor(main : T) {
        super(main);
    }

    save(reaction : ReactionOnError,filter : object) : void
    {
        this.main.onAllError(reaction,filter);
    }
}