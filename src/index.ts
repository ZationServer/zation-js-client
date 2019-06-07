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
import {AuthenticationRequiredError}   from "./lib/helper/error/authenticationRequiredError";
import {ConnectionAbortError}          from "./lib/helper/error/connectionAbortError";
import {ConnectionRequiredError}       from "./lib/helper/error/connectionRequiredError";
import {DeauthenticationFailedError}   from "./lib/helper/error/deauthenticationFailedError";
import {DeauthenticationRequiredError} from "./lib/helper/error/deauthenticationRequiredError";
import {AuthUserGroupRequiredError}    from "./lib/helper/error/authUserGroupRequiredError";
import {UserIdRequiredError}           from "./lib/helper/error/userIdRequiredError";
import {PublishFailedError}            from "./lib/helper/error/publishFailedError";
import {TimeoutError}                  from "./lib/helper/error/timeoutError";
import {SignAuthenticationFailedError} from "./lib/helper/error/signAuthenticationFailedError";
import {SubscribeFailedError}          from "./lib/helper/error/subscribeFailedError";
import {Response}                      from "./lib/response/response";
import {ZationSaver}                   from "./lib/mainApi/zationSaver";
import {ZationClientNotFoundError}     from "./lib/helper/error/zationClientNotFoundError";
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
import {RawError}                      from "./lib/helper/error/rawError";

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
    AuthenticationRequiredError,
    ConnectionAbortError,
    ConnectionRequiredError,
    DeauthenticationFailedError,
    DeauthenticationRequiredError,
    AuthUserGroupRequiredError,
    UserIdRequiredError,
    PublishFailedError,
    TimeoutError,
    SignAuthenticationFailedError,
    SubscribeFailedError,
    ZationClientNotFoundError,
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
    ErrorName,
    RawError
};




