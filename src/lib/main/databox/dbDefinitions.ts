/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {ForintQuery} from "forint";

export interface DataboxConnectReq {
    /**
     * databox (name)
     */
    d : string,
    /**
     * id
     */
    i ?: string,
    /**
     * apiLevel
     */
    al ?: number,
    /**
     * token
     */
    t ?: string
    /**
     * initInput
     */
    ii ?: any
}

export interface DataboxConnectRes {
    /**
     * Last cud id
     */
    ci : string,
    /**
     * Used the token
     */
    ut : boolean,
    /**
     * Input key
     */
    i : string,
    /**
     * Output key
     */
    o : string,
    /**
     * Parallel fetching
     */
    pf : boolean
}

export const DATABOX_START_INDICATOR = '>D';

/**
 * The package that the client can send to the server to invoke an action.
 */
export interface DbClientInputPackage {
    /**
     * Action
     */
    a : DbClientInputAction,
    /**
     * Session Target
     */
    t ?: DBClientInputSessionTarget
}

/**
 * The package that the client can send to the server to fetch data.
 */
export interface DbClientInputFetchPackage extends DbClientInputPackage{
    a : DbClientInputAction.fetch,
    /**
     * input
     */
    i : any
}

export interface DbClientInputFetchResponse {
    /**
     * counter
     */
    c : number,
    /**
     * token
     */
    t : string,
    /**
     * data
     */
    d : any
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
    a : DbClientOutputEvent,
    /**
     * data
     */
    d ?: any,
    /**
     * code
     */
    c ?: number | string,
}

export const enum CudType {
    insert,
    update,
    delete
}

/**
 * A cud operation.
 */
export interface CudOperation {
    /**
     * type
     */
    t : CudType,
    /**
     * selector
     */
    s : DbCudProcessedSelector,
    /**
     * value
     */
    v ?: any;
    /**
     * code
     */
    c ?: any;
    /**
     * data
     */
    d ?: any;
    /**
     * if conditions
     */
    i ?: IfOptionProcessedValue;
    /**
     * potential Insert/Update
     */
    p ?: 0 | 1;
}

/**
 * A full-defined cud package that the server can send to the clients.
 */
export interface CudPackage extends PreCudPackage{
    /**
     * timestamp
     */
    t : number,
}

/**
 * A pre-defined cud package.
 */
export interface PreCudPackage {
    /**
     * cudId
     */
    ci : string,
    /**
     * timestamp
     */
    t ?: number,
    /**
     * operations
     */
    o : CudOperation[]
}

/**
 * Cud package that the server can send to the clients.
 * In case of an insert, update, or delete of data.
 */
export interface DbClientOutputCudPackage extends DbClientOutputPackage{
    /**
     * action
     */
    a : DbClientOutputEvent.cud,
    /**
     * data
     */
    d : CudPackage
}

/**
 * Reload package that the server can send to the clients.
 */
export interface DbClientOutputReloadPackage extends DbClientOutputPackage{
    /**
     * action
     */
    a : DbClientOutputEvent.reload,
    /**
     * data
     */
    d ?: any
}

/**
 * Close package that the server can send to the clients.
 */
export interface DbClientOutputClosePackage extends DbClientOutputPackage{
    /**
     * action
     */
    a : DbClientOutputEvent.close,
    /**
     * data
     */
    d ?: any
}

/**
 * Kick out package that the server can send to the clients.
 */
export interface DbClientOutputKickOutPackage extends DbClientOutputPackage{
    /**
     * action
     */
    a : DbClientOutputEvent.kickOut,
    /**
     * data
     */
    d ?: any
}

/**
 * Signal package that the server can send to the clients.
 */
export interface DbClientOutputSignalPackage extends DbClientOutputPackage{
    /**
     * action
     */
    a : DbClientOutputEvent.signal,
    /**
     * signal
     */
    s : string
    /**
     * data
     */
    d ?: any
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
    getLastCudId
}

export interface InfoOption {
    /**
     * With the code, you can pass information about the reason of this cud operation.
     * That can be a string (e.g. 'NewMessage') or a number (e.g. 200,304).
     */
    code ?: string | number;
    /**
     * With the data option, you can pass extra data to the
     * cud event that gets triggered on the client.
     */
    data ?: any,
}

export interface TimestampOption {
    /**
     * With the timestamp option, you can change the sequence of data.
     * The storage, for example, will only update data that is older as incoming data.
     * Use this option only if you know what you are doing.
     */
    timestamp ?: number
}

export interface IfQuery extends DbForintQuery {
    not ?: boolean;
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
     * There are two helper functions to build a condition
     * the $contains and $notContains helper.
     * In both helper functions, you pass in a forint query.
     * With the queries, you can check that a specific key or value must exist or not.
     * Or you can check with the $any constant, which refers to an empty query ({})
     * if any element exists.
     * In the case of a head selector (with selector [] or ''),
     * the key always is: '' and the value references to the complete
     * data structure (if the value is not undefined).)
     * Some useful example would be to reinsert old data,
     * but only to the clients that are already loaded this old data section.
     * Or to build a set where each element value should be unique.
     * @example
     * if : $notContains($any)
     * if : $contains($key('20'))
     * if : [$contains($value({name : 'luca'})),$notContains($key('30'))]
     */
    if ?: IfOptionValue;
}

export interface PotentialUpdateOption {
    /**
     * With the potentialUpdate option, you indicate that the insert is potential an update.
     * For example, when the key already exists,
     * the client will update the value instead of insert.
     */
    potentialUpdate ?: boolean
}

export interface PotentialInsertOption {
    /**
     * With the potentialInsert option, you indicate that the update is potential an insert.
     * For example, when the key does not exist,
     * the client will insert the value instead of update.
     * Notice that the potentialInsert only works when the path selector ends on a specific key.
     */
    potentialInsert ?: boolean
}

export type IfOptionProcessArgsValue = IfOptionProcessedValue | boolean;

export type InsertArgs = Required<TimestampOption> & {if ?: IfOptionProcessedValue} & PotentialUpdateOption;
export type InsertProcessArgs = Required<TimestampOption> & {if ?: IfOptionProcessArgsValue} & PotentialUpdateOption;
export type UpdateArgs = Required<TimestampOption> & {if ?: IfOptionProcessedValue} & PotentialInsertOption;
export type UpdateProcessArgs = Required<TimestampOption> & {if ?: IfOptionProcessArgsValue} & PotentialInsertOption;
export type DeleteArgs = Required<TimestampOption> & {if ?: IfOptionProcessedValue};
export type DeleteProcessArgs = Required<TimestampOption> & {if ?: IfOptionProcessArgsValue};

/**
 * Forint queries with the databox.
 */
export type DbForintQuery<TK = any,TV = any> = {key ?: ForintQuery<TK>,value ?: ForintQuery<TV>};

/**
 * Selector types for cud operations.
 */
export type DbCudProcessedSelectorItem = string | DbForintQuery;
export type DbCudProcessedSelector = DbCudProcessedSelectorItem[];

type DbCudSelectorItem = string | number | DbForintQuery;
export type DbCudSelector = DbCudSelectorItem | DbCudSelectorItem[];