/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

//Api Classes
import {ZationOptions as  Options}     from "./lib/api/zationOptions";
import {RequestAble}                   from "./lib/api/requestAble";
import {ProtocolType}                  from "./lib/helper/constants/protocolType";
import {Zation}                        from "./lib/api/zation";
import {Zation as Client}              from "./lib/api/zation";
import {Zation as ZationClient}        from "./lib/api/zation";
import {ResponseReactionBox}           from "./lib/api/responseReactionBox";
import {ChannelReactionBox}            from "./lib/api/channelReactionBox";
import {EventReactionBox}              from "./lib/api/eventReactionBox";
import {WsRequest}                     from "./lib/api/wsRequest";
import {HttpRequest}                   from "./lib/api/httpRequest";
import {AuthRequest}                   from "./lib/api/authRequest";
import {ValidationCheck, ValidationRequest} from "./lib/api/validationRequest";
import {AuthenticationFailedError}     from "./lib/helper/error/authenticationFailedError";
import {AuthenticationNeededError}     from "./lib/helper/error/authenticationNeededError";
import {ConnectionAbortError}          from "./lib/helper/error/connectionAbortError";
import {ConnectionNeededError}         from "./lib/helper/error/connectionNeededError";
import {DeauthenticationFailedError}   from "./lib/helper/error/deauthenticationFailedError";
import {DeauthenticationNeededError}   from "./lib/helper/error/deauthenticationNeededError";
import {MissingAuthUserGroupError}     from "./lib/helper/error/missingAuthUserGroupError";
import {MissingUserIdError}            from "./lib/helper/error/missingUserIdError";
import {PublishFailedError}            from "./lib/helper/error/publishFailedError";
import {ResultIsMissingError}          from "./lib/helper/error/resultIsMissingError";
import {SignAuthenticationFailedError} from "./lib/helper/error/signAuthenticationFailedError";
import {SubscribeFailedError}          from "./lib/helper/error/subscribeFailedError";
import {Response}                      from "./lib/api/response";
import {ZationSaver}                   from "./lib/helper/saver/zationSaver";
import {NoZationClientSetOnTheKey}     from "./lib/helper/error/noZationClientSetOnTheKey";
import {AbstractRequestHelper}         from "./lib/helper/request/abstractRequestHelper";
import {AuthRequestHelper}             from "./lib/helper/request/authRequestHelper";
import {RequestHelper}                 from "./lib/helper/request/requestHelper";
import {ValidationRequestHelper}       from "./lib/helper/request/validationRequestHelper";
import {ErrorFilterEngine}             from "./lib/helper/react/responseReactionEngine/errorFilterEngine";
import {PresetErrorLib}                from "./lib/helper/react/onErrorBuilder/presetErrorLib";
import {ErrorFilter}                   from "./lib/helper/filter/errorFilter";
import {TaskError}                     from "./lib/helper/react/taskError/taskError";
import {AbstractErrorFilterBuilder}    from "./lib/helper/react/onErrorBuilder/abstractErrorFilterBuilder";
import {SocketNotCreatedError}         from "./lib/helper/error/socketNotCreated";

// noinspection JSUnusedGlobalSymbols
/**
 * @description
 * Creates the returnTarget zation client.
 * @param options
 * @param reactionBox
 */
const create = (options ?: Options,...reactionBox : (ResponseReactionBox | ChannelReactionBox | EventReactionBox)[]) : Zation =>
{
    return new ZationClient(options,...reactionBox);
};

const save = (client : ZationClient, key : string = 'default') => {
    ZationSaver.save(client,key);
};

const load = (key : string = 'default') : ZationClient => {
    return ZationSaver.load(key);
};

export {
    Zation,
    Client,
    ZationClient,
    create,
    save,
    load,
    Options,
    RequestAble,
    WsRequest,
    HttpRequest,
    AuthRequest,
    ValidationRequest,
    ChannelReactionBox,
    ResponseReactionBox,
    EventReactionBox,
    Response,
    AuthenticationFailedError,
    AuthenticationNeededError,
    ConnectionAbortError,
    ConnectionNeededError,
    DeauthenticationFailedError,
    DeauthenticationNeededError,
    MissingAuthUserGroupError,
    MissingUserIdError,
    PublishFailedError,
    ResultIsMissingError,
    SignAuthenticationFailedError,
    SocketNotCreatedError,
    SubscribeFailedError,
    NoZationClientSetOnTheKey,
    ProtocolType,
    AbstractRequestHelper,
    AuthRequestHelper,
    RequestHelper,
    ValidationRequestHelper,
    ErrorFilterEngine,
    PresetErrorLib,
    ErrorFilter,
    TaskError,
    ValidationCheck,
    AbstractErrorFilterBuilder
};




