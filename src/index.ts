/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

//Api Classes
import Zation = require("./lib/api/zation");
import ZationFile = require("./lib/api/zationFile");
import WsRequest = require("./lib/api/wsRequest");
import HttpRequest = require("./lib/api/httpRequest");
import AuthRequest = require("./lib/api/authRequest");
import ValidationRequest = require("./lib/api/validationRequest");
import ChannelReactionBox = require("./lib/api/channelReactionBox");
import Response = require("./lib/api/response");
import ResponseReactionBox = require("./lib/api/responseReactionBox");
import ZationReader = require('./lib/reader/zationReader');
import EventReactionBox = require("./lib/api/eventReactionBox");
import AuthenticationNeededError = require("./lib/helper/error/authenticationNeededError");
import ConnectionAbortError = require("./lib/helper/error/connectionAbortError");
import ConnectionNeededError = require("./lib/helper/error/connectionNeededError");
import DeauthenticationFailError = require("./lib/helper/error/deauthenticationFailError");
import DeauthenticationNeededError = require("./lib/helper/error/deauthenticationNeededError");
import MissingAuthUserGroupError = require("./lib/helper/error/missingAuthUserGroupError");
import MissingUserIdError = require("./lib/helper/error/missingUserIdError");
import PublishFailError = require("./lib/helper/error/publishFailError");
import ResultIsMissingError = require("./lib/helper/error/resultIsMissingError");
import SignAuthenticationFailError = require("./lib/helper/error/signAuthenticationFailError");
import SubscribeFailError = require("./lib/helper/error/subscribeFailError");
import {ZationOptions} from "./lib/api/zationOptions";
import {RequestAble} from "./lib/api/requestAble";
import {ProtocolType} from "./lib/helper/constants/protocolType";

// noinspection JSUnusedGlobalSymbols
/**
 * @description
 * Creates the main zation client.
 * @param options
 * @param reactionBox
 */
const create = (options : ZationOptions = {},...reactionBox : (ResponseReactionBox | ChannelReactionBox | EventReactionBox)[]) : Zation =>
{
    return new Zation(options,...reactionBox);
};

//TODO
//not really function
//react returns a responseReacAble not an responseReact!
new Response({},ProtocolType.Http).react().
    buildCatchError().presets().inputNotMatchWithMinLength('name')
    .react(((filteredErrors, response) => {}))
    .onSuccessful((result, response) => {});

export
{
    Zation,
    create,
    RequestAble,
    ZationFile,
    WsRequest,
    HttpRequest,
    AuthRequest,
    ValidationRequest,
    ChannelReactionBox,
    ResponseReactionBox,
    EventReactionBox,
    Response,
    AuthenticationNeededError,
    ConnectionAbortError,
    ConnectionNeededError,
    DeauthenticationFailError,
    DeauthenticationNeededError,
    MissingAuthUserGroupError,
    MissingUserIdError,
    PublishFailError,
    ResultIsMissingError,
    SignAuthenticationFailError,
    SubscribeFailError,
    ProtocolType
};

// browserify-ignore-start
//support for zation-server
export {ZationReader};
// browserify-ignore-end