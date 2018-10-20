/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

//Api Classes
import Zation = require("./lib/api/zation");
import WsRequest = require("./lib/api/wsRequest");
import HttpRequest = require("./lib/api/httpRequest");
import AuthRequest = require("./lib/api/authRequest");
import ValidationRequest = require("./lib/api/validationRequest");
import ChannelReactionBox = require("./lib/api/channelReactionBox");
import Response = require("./lib/api/response");
import ResponseReactionBox = require("./lib/api/responseReactionBox");
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
 * Creates the returnTarget zation client.
 * @param options
 * @param reactionBox
 */
const create = (options : ZationOptions = {},...reactionBox : (ResponseReactionBox | ChannelReactionBox | EventReactionBox)[]) : Zation =>
{
    return new Zation(options,...reactionBox);
};

module.exports.Zation = Zation;
module.exports.create = create;
module.exports.RequestAble = RequestAble;
module.exports.WsRequest = WsRequest;
module.exports.HttpRequest = HttpRequest;
module.exports.AuthRequest = AuthRequest;
module.exports.ValidationRequest = ValidationRequest;
module.exports.ChannelReactionBox = ChannelReactionBox;
module.exports.ResponseReactionBox = ResponseReactionBox;
module.exports.EventReactionBox = EventReactionBox;
module.exports.Response = Response;
module.exports.AuthenticationNeededError = AuthenticationNeededError;
module.exports.ConnectionAbortError = ConnectionAbortError;
module.exports.ConnectionNeededError = ConnectionNeededError;
module.exports.DeauthenticationFailError = DeauthenticationFailError;
module.exports.DeauthenticationNeededError = DeauthenticationNeededError;
module.exports.MissingAuthUserGroupError = MissingAuthUserGroupError;
module.exports.MissingUserIdError = MissingUserIdError;
module.exports.PublishFailError = PublishFailError;
module.exports.ResultIsMissingError = ResultIsMissingError;
module.exports.SignAuthenticationFailError = SignAuthenticationFailError;
module.exports.SubscribeFailError = SubscribeFailError;
module.exports.ProtocolType = ProtocolType;

// browserify-ignore-start
//support for zation-server
import ZationReader = require('./lib/reader/zationReader');
module.exports.ZationReader = ZationReader;
// browserify-ignore-end

