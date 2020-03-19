/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import './lib/main/utils/perfomanceNodeFix';

//Api Classes
import {ZationOptions as  Options}     from "./lib/core/zationOptions";
import {RequestAble}                   from "./lib/main/request/helper/requestAble";
import {ProtocolType}                  from "./lib/main/constants/protocolType";
import {Zation}                        from "./lib/core/zation";
import {Zation as Client}              from "./lib/core/zation";
import {Zation as ZationClient}        from "./lib/core/zation";
import {ResponseReactionBox}           from "./lib/main/react/reactionBoxes/responseReactionBox";
import {ChannelReactionBox}            from "./lib/main/react/reactionBoxes/channelReactionBox";
import {EventReactionBox}              from "./lib/main/react/reactionBoxes/eventReactionBox";
import {WsRequest}                     from "./lib/main/request/main/wsRequest";
import {HttpRequest}                   from "./lib/main/request/main/httpRequest";
import {AuthRequest}                   from "./lib/main/request/main/authRequest";
import {ValidationCheck, ValidationRequest} from "./lib/main/request/main/validationRequest";
import {
    $all,
    $any,
    $contains,
    $key,
    $matches,
    $not,
    $pair,
    $value
} from "./lib/main/databox/dbApiUtils";
import {AuthenticationFailedError}     from "./lib/main/error/authenticationFailedError";
import {AuthenticationRequiredError}   from "./lib/main/error/authenticationRequiredError";
import {ConnectionAbortError}          from "./lib/main/error/connectionAbortError";
import {ConnectionRequiredError}       from "./lib/main/error/connectionRequiredError";
import {DeauthenticationFailedError}   from "./lib/main/error/deauthenticationFailedError";
import {DeauthenticationRequiredError} from "./lib/main/error/deauthenticationRequiredError";
import {AuthUserGroupRequiredError}    from "./lib/main/error/authUserGroupRequiredError";
import {UserIdRequiredError}           from "./lib/main/error/userIdRequiredError";
import {PublishFailedError}            from "./lib/main/error/publishFailedError";
import {TimeoutError}                  from "./lib/main/error/timeoutError";
import {SignAuthenticationFailedError} from "./lib/main/error/signAuthenticationFailedError";
import {SubscribeFailedError}          from "./lib/main/error/subscribeFailedError";
import {Response}                      from "./lib/main/response/response";
import {ZationSaver}                   from "./lib/core/zationSaver";
import {ZationClientNotFoundError}     from "./lib/main/error/zationClientNotFoundError";
import {AbstractRequestBuilder}        from "./lib/main/request/fluent/abstractRequestBuilder";
import {AuthRequestBuilder}            from "./lib/main/request/fluent/authRequestBuilder";
import {RequestBuilder}                from "./lib/main/request/fluent/requestBuilder";
import {ValidationRequestBuilder}      from "./lib/main/request/fluent/validationRequestBuilder";
import {ErrorFilterEngine}             from "./lib/main/react/respReactEngines/errorFilterEngine";
import {PresetErrorLib}                from "./lib/main/react/error/presetErrorLib";
import {ErrorFilter}                   from "./lib/main/react/error/errorFilter";
import {BackError}                     from "./lib/main/response/backError";
import {AbstractErrorFilterBuilder}    from "./lib/main/react/error/abstractErrorFilterBuilder";
import {ErrorName}                     from "./lib/main/constants/errorName";
import {RawError}                      from "./lib/main/error/rawError";
import {buildKeyArray}                 from "./lib/main/databox/storage/keyArrayUtils";
import DbsHead                         from "./lib/main/databox/storage/components/dbsHead";
import DbStorage, {DataEventReason}    from "./lib/main/databox/storage/dbStorage";
import Databox                         from "./lib/main/databox/databox";
import {DbsComparator}                 from "./lib/main/databox/storage/dbsComparator";
import {DbsValueMerger}                from "./lib/main/databox/storage/dbsMergerUtils";
import {InvalidInputError}             from "./lib/main/error/invalidInputError";
import DbError                         from "./lib/main/databox/dbError";
import {AbortSignal, AbortTrigger}     from "./lib/main/utils/connectionUtils";

// noinspection JSUnusedGlobalSymbols
/**
 * @description
 * Creates a zation client.
 * @param options
 * @param reactionBox
 */
const create = (options?: Options,...reactionBox: (ResponseReactionBox | ChannelReactionBox | EventReactionBox)[]): Zation =>
{
    return new ZationClient(options,...reactionBox);
};

const save = (client: ZationClient, key: string = 'default') => {
    ZationSaver.save(client,key);
};

const load = (key: string = 'default'): ZationClient => {
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
    RawError,
    InvalidInputError,
    buildKeyArray,
    DbsHead,
    DbStorage,
    Databox,
    DbsComparator,
    DbsValueMerger,
    $not,
    $key,
    $value,
    $pair,
    $all,
    $contains,
    $any,
    $matches,
    DataEventReason,
    DbError,
    AbortTrigger,
    AbortSignal
};