/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

//Api Classes
import {ZationOptions as  Options}     from "./lib/mainApi/zationOptions";
import {RequestAble}                   from "./lib/request/helper/requestAble";
import {ProtocolType}                  from "./lib/helper/constants/protocolType";
import {Zation}                        from "./lib/mainApi/zation";
import {Zation as Client}              from "./lib/mainApi/zation";
import {Zation as ZationClient}        from "./lib/mainApi/zation";
import {ResponseReactionBox}           from "./lib/react/reactionBoxes/responseReactionBox";
import {ChannelReactionBox}            from "./lib/react/reactionBoxes/channelReactionBox";
import {EventReactionBox}              from "./lib/react/reactionBoxes/eventReactionBox";
import {WsRequest}                     from "./lib/request/main/wsRequest";
import {HttpRequest}                   from "./lib/request/main/httpRequest";
import {AuthRequest}                   from "./lib/request/main/authRequest";
import {ValidationCheck, ValidationRequest} from "./lib/request/main/validationRequest";
import {AuthenticationFailedError}     from "./lib/helper/error/authenticationFailedError";
import {AuthenticationNeededError}     from "./lib/helper/error/authenticationNeededError";
import {ConnectionAbortError}          from "./lib/helper/error/connectionAbortError";
import {ConnectionNeededError}         from "./lib/helper/error/connectionNeededError";
import {DeauthenticationFailedError}   from "./lib/helper/error/deauthenticationFailedError";
import {DeauthenticationNeededError}   from "./lib/helper/error/deauthenticationNeededError";
import {MissingAuthUserGroupError}     from "./lib/helper/error/missingAuthUserGroupError";
import {MissingUserIdError}            from "./lib/helper/error/missingUserIdError";
import {PublishFailedError}            from "./lib/helper/error/publishFailedError";
import {TimeoutError}                  from "./lib/helper/error/timeoutError";
import {SignAuthenticationFailedError} from "./lib/helper/error/signAuthenticationFailedError";
import {SubscribeFailedError}          from "./lib/helper/error/subscribeFailedError";
import {Response}                      from "./lib/response/response";
import {ZationSaver}                   from "./lib/mainApi/zationSaver";
import {NoZationClientSetOnTheKey}     from "./lib/helper/error/noZationClientSetOnTheKey";
import {AbstractRequestBuilder}        from "./lib/request/fluent/abstractRequestBuilder";
import {AuthRequestBuilder}            from "./lib/request/fluent/authRequestBuilder";
import {RequestBuilder}                from "./lib/request/fluent/requestBuilder";
import {ValidationRequestBuilder}      from "./lib/request/fluent/validationRequestBuilder";
import {ErrorFilterEngine}             from "./lib/react/respReactEngines/errorFilterEngine";
import {PresetErrorLib}                from "./lib/react/error/presetErrorLib";
import {ErrorFilter}                   from "./lib/react/error/errorFilter";
import {BackError}                     from "./lib/response/backError";
import {AbstractErrorFilterBuilder}    from "./lib/react/error/abstractErrorFilterBuilder";
import {ErrorName}                     from "./lib/helper/constants/errorName";

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
    TimeoutError,
    SignAuthenticationFailedError,
    SubscribeFailedError,
    NoZationClientSetOnTheKey,
    ProtocolType,
    AbstractRequestBuilder,
    AuthRequestBuilder,
    RequestBuilder,
    ValidationRequestBuilder,
    ErrorFilterEngine,
    PresetErrorLib,
    ErrorFilter,
    BackError,
    ValidationCheck,
    AbstractErrorFilterBuilder,
    ErrorName
};




