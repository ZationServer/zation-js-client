/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import ResponseReactAble     = require("./responseReactAble");
import {ReactionOnError, ReactionOnSuccessful} from "./reactionHandler";
import {OnAllErrorBuilder}   from "./onErrorBuilder/onAllErrorBuilder";
import {OnErrorBuilder}      from "./onErrorBuilder/onErrorBuilder";
import Response              = require("../../api/response");

class ResponseReact extends ResponseReactAble
{
    private readonly response : Response;

    constructor(response : Response)
    {
        super();
        this.response = response;
    }

    getResponse() : Response
    {
        return this.response;
    }

    onAllError(reaction: ReactionOnError, filter?: object) : ResponseReact
    {

        return this;
    }

    buildOnAllError() : OnAllErrorBuilder<ResponseReact>
    {
        return new OnAllErrorBuilder<ResponseReact>(this);
    }

    onAllSuccessful(reaction: ReactionOnSuccessful, filter?: object) : ResponseReact
    {

        return this;
    }

    onError(reaction: ReactionOnError, filter?: object) : ResponseReact
    {

        return this;
    }

    buildOnError() : OnErrorBuilder<ResponseReact>
    {
        return new OnErrorBuilder<ResponseReact>(this);
    }

    onSuccessful(reaction: ReactionOnSuccessful, filter?: object) : ResponseReact
    {

        return this;
    }
}

export = ResponseReact;

