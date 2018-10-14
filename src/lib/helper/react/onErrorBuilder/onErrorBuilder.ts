/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {ResponseReactionOnError} from "../reaction/reactionHandler";
import ResponseReactAble = require("../responseReactionEngine/responseReactAble");
import {AbstractErrorFilterBuilder} from "./abstractErrorFilterBuilder";

export class OnErrorBuilder<T extends ResponseReactAble> extends AbstractErrorFilterBuilder<T>
{
    constructor(main : T) {
        super(main);
    }

    _save(reaction : ResponseReactionOnError, filter : object[]) : void
    {
        this.main.onError(reaction,...filter);
    }
}