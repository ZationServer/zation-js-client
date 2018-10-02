/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

//Api Classes
import Zation = require("./lib/api/zation");
import {ZationOptions} from "./lib/api/zationOptions";

const create = (options : ZationOptions = {}) : Zation => {
    return new Zation(options);
};

const cca = async (options : ZationOptions = {},authData : object = {}) : Promise<Zation> =>
{
    const za = new Zation(options);
    await za.connect();
    await za.authenticate(authData);
    return za;
};

type StartFunction = (zation : Zation) => Promise<void>;

const start = (func : StartFunction,options : ZationOptions = {}) : void =>
{
    (async () => {
        const za = create(options);
        await func(za);
    })();
};

import {RequestAble} from "./lib/api/requestAble";
import ZationFile = require("./lib/api/zationFile");
import WsRequest = require("./lib/api/wsRequest");
import HttpRequest = require("./lib/api/httpRequest");
import AuthRequest = require("./lib/api/authRequest");
import ValidationRequest = require("./lib/api/validationRequest");
import ChannelReactionBox = require("./lib/api/channelReactionBox");
import Response = require("./lib/api/response");
import ResponseReactionBox = require("./lib/api/responseReactionBox");

export
{
    Zation,
    create,
    cca,
    start,
    RequestAble,
    ZationFile,
    WsRequest,
    HttpRequest,
    AuthRequest,
    ValidationRequest,
    ChannelReactionBox,
    ResponseReactionBox,
    Response
};

// browserify-ignore-start
//support for zation-server
import ZationReader  = require('./lib/reader/zationReader');
export {ZationReader};
// browserify-ignore-end