/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {ZationOptions as  Options}      from "./lib/core/zationOptions";
import {Zation}                         from "./lib/core/zation";
import {Zation as Client}               from "./lib/core/zation";
import {Zation as ZationClient}         from "./lib/core/zation";
import {ResponseReactionBox}            from "./lib/main/controller/response/responseReactionBox";
import {ChannelReactionBox}             from "./lib/main/channel/channelReactionBox";
import {EventReactionBox}               from "./lib/main/event/eventReactionBox";
import {StandardRequest}                from "./lib/main/controller/request/main/standardRequest";
import { ValidationCheckRequest}        from "./lib/main/controller/request/main/validationCheckRequest";
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
import {AuthenticationFailedError}      from "./lib/main/error/authenticationFailedError";
import {AuthenticationRequiredError}    from "./lib/main/error/authenticationRequiredError";
import {ConnectionAbortError}           from "./lib/main/error/connectionAbortError";
import {ConnectionRequiredError}        from "./lib/main/error/connectionRequiredError";
import {DeauthenticationFailedError}    from "./lib/main/error/deauthenticationFailedError";
import {DeauthenticationRequiredError}  from "./lib/main/error/deauthenticationRequiredError";
import {AuthUserGroupRequiredError}     from "./lib/main/error/authUserGroupRequiredError";
import {UserIdRequiredError}            from "./lib/main/error/userIdRequiredError";
import {PublishFailedError}             from "./lib/main/error/publishFailedError";
import {TimeoutError}                   from "./lib/main/error/timeoutError";
import {SignAuthenticationFailedError}  from "./lib/main/error/signAuthenticationFailedError";
import {SubscribeFailedError}           from "./lib/main/error/subscribeFailedError";
import {Response}                       from "./lib/main/controller/response/response";
import {ZationSaver}                    from "./lib/core/zationSaver";
import {ZationClientNotFoundError}      from "./lib/main/error/zationClientNotFoundError";
import {AbstractRequestBuilder}         from "./lib/main/controller/request/fluent/abstractRequestBuilder";
import {AuthRequestBuilder}             from "./lib/main/controller/request/fluent/authRequestBuilder";
import {RequestBuilder}                 from "./lib/main/controller/request/fluent/requestBuilder";
import {ValidationRequestBuilder}       from "./lib/main/controller/request/fluent/validationRequestBuilder";
import {ErrorFilterEngine}              from "./lib/main/backError/errorFilterEngine";
import {PresetBackErrorLib}             from "./lib/main/backError/presetBackErrorLib";
import {BackErrorFilter}                from "./lib/main/backError/backErrorFilter";
import {BackError}                      from "./lib/main/backError/backError";
import {AbstractBackErrorFilterBuilder} from "./lib/main/backError/abstractBackErrorFilterBuilder";
import {ErrorName}                      from "./lib/main/constants/errorName";
import {RawError}                       from "./lib/main/error/rawError";
import {buildKeyArray}                  from "./lib/main/databox/storage/keyArrayUtils";
import DbsHead                          from "./lib/main/databox/storage/components/dbsHead";
import DbStorage, {DataEventReason}     from "./lib/main/databox/storage/dbStorage";
import Databox                          from "./lib/main/databox/databox";
import {DbsComparator}                  from "./lib/main/databox/storage/dbsComparator";
import {DbsValueMerger}                 from "./lib/main/databox/storage/dbsMergerUtils";
import {InvalidInputError}              from "./lib/main/error/invalidInputError";
import DbError                          from "./lib/main/databox/dbError";
import {AbortSignal, AbortTrigger}      from "./lib/main/utils/connectionUtils";
import {AuthRequest}                    from "./lib/main/controller/request/main/authRequest";
import {ValidationCheckPair}            from "./lib/main/controller/controllerDefinitions";

// noinspection JSUnusedGlobalSymbols
/**
 * @description
 * Creates a Zation client.
 * @param options
 * @param reactionBox
 */
const create = (options?: Options,...reactionBox: (ResponseReactionBox | ChannelReactionBox | EventReactionBox)[]): Zation => {
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
    StandardRequest,
    AuthRequest,
    ValidationCheckRequest,
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
    AbstractRequestBuilder,
    AuthRequestBuilder,
    RequestBuilder,
    ValidationRequestBuilder,
    ErrorFilterEngine,
    PresetBackErrorLib,
    BackErrorFilter,
    BackError,
    ValidationCheckPair,
    AbstractBackErrorFilterBuilder,
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