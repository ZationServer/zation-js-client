/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {ForintQuery}                             from "forint";
import {ForintSearchQuery, IfQuery, IfQueryType} from "./dbDefinitions";

/**
 * @description
 * Util function for creating a value filter for databox cud actions.
 * @example
 * await db.update([$value({name : 'Luca'}),'name'],'luca');
 * @param query
 */
export function $value<T>(query : ForintQuery<T>) : ForintSearchQuery {
    return {v : query};
}

/**
 * @description
 * Util function for creating a key filter for databox cud actions.
 * @example
 * await db.update([$key({$gt : 45453}),'name'],'luca');
 * @param query
 */
export function $key<T>(query : ForintQuery<T>) : ForintSearchQuery {
    return {k : query};
}

/**
 * @description
 * Util function for creating a pair (key and value) filter for databox cud actions.
 * @example
 * await db.update([$pair({$gt : 45453},{age : {$gt : 18}}),'cool'],true);
 * @param keyQuery
 * @param valueQuery
 */
export function $pair<TK,TV>(keyQuery : ForintQuery<TK>,valueQuery : ForintQuery<TV>) : ForintSearchQuery {
    return {k : keyQuery,v : valueQuery};
}

/**
 * @description
 * Databox filter constant to select all values.
 * @example
 * await db.update([$all,'online'],true);
 */
export const $all = Object.freeze({});

/**
 * @description
 * Util function for creating an if condition for cud operations of databoxes.
 * It creates a condition that at least one item must match with the provided query.
 * @example
 * await db.update(['34','name'],'luca',{if : $contains($key('35'))});
 * @param query
 */
export function $contains<TK,TV>(query : ForintSearchQuery<TK,TV>) : IfQuery {
    return {q : query,t : IfQueryType.search};
}

/**
 * @description
 * Util function for creating an if condition for cud operations of databoxes.
 * It creates a condition that none of the items should match with the provided query.
 * @example
 * await db.update(['34','name'],'luca',{if : $notContains($key('39'))});
 * @param query
 */
export function $notContains<TK,TV>(query : ForintSearchQuery<TK,TV>) : IfQuery {
    return {q : query,n : true,t : IfQueryType.search};
}

/**
 * @description
 * Util constant for creating an if condition for cud operations of databoxes.
 * With this constant, you can check if any element or none element exists.
 * @example
 * await db.insert(['41'],{name : 'Max',age : 10},{if : $notContains($any)});
 */
export const $any = Object.freeze({});

/**
 * @description
 * Util function for creating an if condition for cud operations of databoxes.
 * It creates a condition that the complete object (all key-value pairs)
 * must match with the provided query.
 * @example
 * await db.update(['34','name'],'luca',{if: $matches({email: 'test1@test.de', age: {gte: 18}})});
 * @param query
 */
export function $matches<T>(query : ForintQuery<T>) : IfQuery {
    return {q : query,t : IfQueryType.full};
}

/**
 * @description
 * Util function for creating an if condition for cud operations of databoxes.
 * It creates a condition that the complete object (all key-value pairs)
 * must not match with the provided query.
 * @example
 * await db.update(['34','name'],'luca',{if: $notMatches({email: 'test1@test.de', age: {gte: 18}})});
 * @param query
 */
export function $notMatches<T>(query : ForintQuery<T>) : IfQuery {
    return {q : query,n : true,t : IfQueryType.full};
}