/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {ForintQuery}   from "forint";

export interface DataboxConnectReq {
    /**
     * databox (identifier)
     */
    d: string,
    /**
     * member
     */
    m?: any,
    /**
     * apiLevel
     */
    a?: number,
    /**
     * token
     * If defined will be used instead of
     * creating a new token with options.
     */
    t?: string,
    /**
     * options
     */
    o?: any
}

export interface DataboxConnectRes {
    /**
     * Input key
     */
    i: string,
    /**
     * Output key
     */
    o: string,
    /**
     * Last cud id
     */
    lc: string,
    /**
     * Parallel fetching
     */
    p: boolean,
    /**
     * Initial data
     */
    id?: any,
    /**
     * Reload strategy
     */
    rs?: [string,any]
}

export const DATABOX_START_INDICATOR = 'D>';

/**
 * The package that the client can send to the server to invoke an action.
 */
export interface DbClientInputPackage {
    /**
     * Action
     */
    a: DbClientInputAction,
    /**
     * Session Target
     */
    t?: DBClientInputSessionTarget
}

/**
 * The package that the client can send to the server to send a signal.
 */
export interface DbClientInputSignalPackage extends DbClientInputPackage{
    a: DbClientInputAction.signal,
    /**
     * signal
     */
    s: string,
    /**
     * data
     */
    d: any
}

/**
 * The package that the client can send to the server to fetch data.
 */
export interface DbClientInputFetchPackage extends DbClientInputPackage{
    a: DbClientInputAction.fetch,
    /**
     * input
     */
    i: any
}

export interface DbClientInputFetchResponse {
    /**
     * counter
     */
    c: number,
    /**
     * token
     */
    t: string,
    /**
     * data
     */
    d: any,
    /**
     * Timestamp
     */
    ti: number
}

/**
 * Events that a client can receive from the server.
 */
export const enum DbClientOutputEvent {
    cud,
    close,
    reload,
    kickOut,
    signal
}

/**
 * Packages that the server can send to the clients.
 */
export interface DbClientOutputPackage {
    /**
     * action
     */
    a: DbClientOutputEvent,
    /**
     * data
     */
    d?: any,
    /**
     * code
     */
    c?: number | string,
}

export const enum CudType {
    insert,
    update,
    delete
}

/**
 * A local cud operation.
 */
export interface LocalCudOperation {
    /**
     * type
     */
    type: CudType,
    /**
     * timestamp
     */
    timestamp?: number,
    /**
     * selector
     */
    selector: DbProcessedSelector,
    /**
     * value
     */
    value?: any;
    /**
     * code
     */
    code?: any;
    /**
     * data
     */
    data?: any;
    /**
     * if conditions
     */
    if?: IfOptionProcessedValue;
    /**
     * potential Insert/Update
     */
    potential?: boolean;
}

/**
 * A cud operation.
 */
export interface CudOperation {
    /**
     * type
     */
    t: CudType,
    /**
     * selector
     */
    s: DbProcessedSelector,
    /**
     * value
     */
    v?: any;
    /**
     * code
     */
    c?: any;
    /**
     * data
     */
    d?: any;
    /**
     * if conditions
     */
    i?: IfOptionProcessedValue;
    /**
     * potential Insert/Update
     */
    p?: 0 | 1;
}

/**
 * A full-defined cud package that the server can send to the clients.
 */
export interface CudPackage extends PreCudPackage{
    /**
     * timestamp
     */
    t: number,
}

/**
 * A pre-defined cud package.
 */
export interface PreCudPackage {
    /**
     * cudId
     */
    ci: string,
    /**
     * timestamp
     */
    t?: number,
    /**
     * operations
     */
    o: CudOperation[]
}

/**
 * Cud package that the server can send to the clients.
 * In case of an insert, update, or delete of data.
 */
export interface DbClientOutputCudPackage extends DbClientOutputPackage{
    /**
     * action
     */
    a: DbClientOutputEvent.cud,
    /**
     * data
     */
    d: CudPackage
}

/**
 * Reload package that the server can send to the clients.
 */
export interface DbClientOutputReloadPackage extends DbClientOutputPackage{
    /**
     * action
     */
    a: DbClientOutputEvent.reload,
    /**
     * data
     */
    d?: any
}

/**
 * Close package that the server can send to the clients.
 */
export interface DbClientOutputClosePackage extends DbClientOutputPackage{
    /**
     * action
     */
    a: DbClientOutputEvent.close,
    /**
     * data
     */
    d?: any
}

/**
 * Kick out package that the server can send to the clients.
 */
export interface DbClientOutputKickOutPackage extends DbClientOutputPackage{
    /**
     * action
     */
    a: DbClientOutputEvent.kickOut,
    /**
     * data
     */
    d?: any
}

/**
 * Signal package that the server can send to the clients.
 */
export interface DbClientOutputSignalPackage extends DbClientOutputPackage{
    /**
     * action
     */
    a: DbClientOutputEvent.signal,
    /**
     * signal
     */
    s: string
    /**
     * data
     */
    d?: any
}

/**
 * The target session that the server should use to process.
 */
export const enum DBClientInputSessionTarget {
    mainSession,
    reloadSession
}

/**
 * Actions that a client can send to the server.
 */
export const enum DbClientInputAction {
    fetch,
    resetSession,
    copySession,
    disconnect,
    getLastCudId,
    signal
}

export interface InfoOption {
    /**
     * With the code, you can pass information about the reason of this cud operation.
     * That can be a string (e.g. 'NewMessage') or a number (e.g. 200,304).
     */
    code?: string | number;
    /**
     * With the data option, you can pass extra data to the
     * cud event that gets triggered on the client.
     */
    data?: any,
}

export interface TimestampOption {
    /**
     * With the timestamp option, you can change the sequence of data.
     * The storage, for example, will only update data that is older as incoming data.
     * Use this option only if you know what you are doing.
     */
    timestamp?: number
}

export const enum IfQueryType {
    search,
    full
}

export type IfQuery = IfFullQuery | IfSearchQuery;

export interface IfFullQuery {
    //not
    n?: boolean;
    //type
    t: IfQueryType.full,
    //query
    q: ForintQuery<any>;
}

export interface IfSearchQuery {
    //not
    n?: boolean;
    //type
    t: IfQueryType.search,
    //query
    q: ForintSearchQuery;
}

export type IfOptionValue = IfQuery | (IfQuery[]);
export type IfOptionProcessedValue = IfQuery[];

export interface IfOption {
    /**
     * @description
     * The if option gives you the possibility to
     * define conditions for the cud operation.
     * All conditions must be evaluated to true;
     * otherwise, the client will ignore the operation.
     * You can define multiple conditions with an array or only one condition.
     * If you have an operation that has a selector that has multiple key targets,
     * the if conditions will only be evaluated once for every component.
     * There are two helper functions to build a condition the $contains and $matches helper.
     * In both helper functions, you pass in forint queries.
     * The contains helper function will execute the queries multiple times
     * for each key or value.
     * If at least one pair, key, or value matches, the condition is evaluated to true.
     * It's possible to invert the result using the $not function.
     * That gives you the possibility to check that a specific key, value,
     * or pair must exist or not.
     * In the case of a head selector (with selector [] or ''), the key always is: '' and
     * the value references to the complete data structure (if the value is not undefined).)
     * With the $any constant, which refers to an empty query ({}),
     * you can check if any pair exists or not.
     * Some useful example would be to reinsert old data,
     * but only to the clients that already loaded this old data section.
     * Or to build a set where each element value should be unique.
     * The matches helper function will execute the query once for the
     * complete object (all key-value pairs).
     * It's also possible to invert the result using the $not function.
     * In the case of a head selector (with selector [] or ''), the value
     * of the head (complete data structure) will be used.
     * It helps to check multiple pairs in one query and makes it more readable.
     * @example
     * if: $not($contains($any))
     * if: $contains($key('20'))
     * if: [$contains($value({name: 'luca'})),$not(contains($key('30')))]
     * if: $contains($pair('name','luca'))
     * if: $matches({name: 'luca', age: {gte: 18}, email: 'test1@test.de'})
     * if: $not($matches({email: 'test1@test.de'}))
     */
    if?: IfOptionValue;
}

export interface PotentialUpdateOption {
    /**
     * With the potentialUpdate option, you indicate that the insert is potential an update.
     * For example, when the key already exists,
     * the client will update the value instead of insert.
     */
    potentialUpdate?: boolean
}

export interface PotentialInsertOption {
    /**
     * With the potentialInsert option, you indicate that the update is potential an insert.
     * For example, when the key does not exist,
     * the client will insert the value instead of update.
     * Notice that the potentialInsert only works when the path selector ends on a specific key.
     */
    potentialInsert?: boolean
}

export type IfOptionProcessArgsValue = IfOptionProcessedValue | boolean;

export type InsertArgs = Required<TimestampOption> & {if?: IfOptionProcessedValue} & PotentialUpdateOption;
export type InsertProcessArgs = Required<TimestampOption> & {if?: IfOptionProcessArgsValue} & PotentialUpdateOption;
export type UpdateArgs = Required<TimestampOption> & {if?: IfOptionProcessedValue} & PotentialInsertOption;
export type UpdateProcessArgs = Required<TimestampOption> & {if?: IfOptionProcessArgsValue} & PotentialInsertOption;
export type DeleteArgs = Required<TimestampOption> & {if?: IfOptionProcessedValue};
export type DeleteProcessArgs = Required<TimestampOption> & {if?: IfOptionProcessArgsValue};

/**
 * Forint search query.
 */
export type ForintSearchQuery<TK = any,TV = any> = {
    //key
    k?: ForintQuery<TK>,
    //value
    v?: ForintQuery<TV>
};

/**
 * Selector types.
 */
export type DbProcessedSelectorItem = string | ForintSearchQuery;
export type DbProcessedSelector = DbProcessedSelectorItem[];

type DbSelectorItem = string | number | ForintSearchQuery;
export type DbSelector = DbSelectorItem | DbSelectorItem[];