/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

//Api Classes
import Zation = require("./lib/api/zation");
import {ZationOptions} from "./lib/api/zationOptions";

const create = (options : ZationOptions) : Zation => {
    return new Zation(options);
};

const cca = async (options : ZationOptions,authData : object) : Promise<Zation> =>
{
    const za = new Zation(options);
    await za.connect();
    await za.authIn(authData);
    return za;
};

import {RequestAble} from "./lib/api/requestAble";
import ZationFile = require("./lib/api/zationFile");
import WsRequest = require("./lib/api/wsRequest");
import HttpRequest = require("./lib/api/httpRequest");
import AuthRequest = require("./lib/api/authRequest");
import ValidationRequest = require("./lib/api/validationRequest");
import ChannelReactiomBox = require("./lib/api/channelReactionBox");
import Response = require("./lib/api/response");
import ResponseReactionBox = require("./lib/api/responseReactionBox");

const ex =
    {
        RequestAble,
        ZationFile,
        WsRequest,
        HttpRequest,
        create,
        cca,
        Zation,
        AuthRequest,
        ValidationRequest,
        ChannelReactiomBox,
        ResponseReactionBox,
        Response
    };

// browserify-ignore-start
//support for zation-server
import ZationReader  = require('./lib/reader/zationReader');
ex['ZationReader'] = ZationReader;
// browserify-ignore-end

exports = ex;