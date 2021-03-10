/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {Default} from '../utils/typeUtils';

/**
 * @description
 * Defines a new API definition that can be used to typify the client.
 * @example
 * type API = CustomApiDefinition<{
 *  controllers: Routes<{
 *      chat: {
 *          sendMessage: [{content: string},void]
 *      }
 *  }>,
 *  receivers: {
 *  },
 *  databoxes: Routes<{
 *      chat: {
 *          get: {}
 *      }
 *  }>,
 *  channels: {
 *  }
 * }>;
 */
export type CustomApiDefinition<T extends APIDefinition> = T;
/**
 * @description
 * API definition that can be used to typify the client.
 */
export type APIDefinition = {
    /**
     * Defines the controllers and the input/output type for each.
     * 0 = input data
     * 1 = output data
     */
    controllers: Record<string,[any?,any?]>;
    /**
     * References to the auth controller name.
     */
    authController?: string;
    /**
     * Defines the receivers and the input type for each.
     */
    receivers: Record<string,any>;
    /**
     * Defines the databoxes with types.
     */
    databoxes: Record<string,{
        /**
         * Defines the data type of the databox.
         * @default any json
         */
        data?: any,
        /**
         * Defines the type of the connection options.
         * @default any
         */
        options?: any,
        /**
         * Defines the type of the fetch input.
         * @default any
         */
        fetchInput?: any,
        /**
         * Defines the member type.
         * @default string
         */
        member?: any
    }>;
    /**
     * Defines the channels with types.
     * @example
     * channels: {
     *     notifications: {
     *         publishes: {
     *             message: {content: string}
     *         }
     *     }
     * }
     */
    channels: Record<string,{
        /**
         * Defines all publish events and data.
         * @default Record<string,any>
         */
        publishes?: Record<string,any>,
        /**
         * Defines the member type.
         * @default string
         */
        member?: any
    }>
}

export type ResolveAuthData<T extends APIDefinition> =
        T['authController'] extends string ?
            T['controllers'][T['authController']] extends object ?
                Default<T['controllers'][T['authController']][0],any> : any : any;

type BuildIdentifier<R extends string,N extends string> = `${R}/${N}`;
type StringKeys<T> = Extract<keyof T, string>;
type StringKeyValues<T> = T[StringKeys<T>];

/**
 * @description
 * This type can be used to create a Route in the API definition.
 * @example
 * Route<'profile',{
 *     create: [{name: string, email: string},string],
 *     delete: [string,void]
 * }>
 */
export type Route<R extends string,T extends Record<string,any>> = Record<BuildIdentifier<R,StringKeys<T>>,T[StringKeys<T>]>;

type UnionToIntersection<U> = (U extends any
    ? (k: U) => void
    : never) extends ((k: infer I) => void)
    ? I
    : never;

/**
 * @description
 * This type can be used to create Routes in the API definitions.
 * @example
 * Routes<{
 *      chat: {
 *          sendMessage: [{content: string},void]
 *      },
 *      profile: {
 *          delete: [string,void]
 *      }
 * }>
 * It is also possible to nest it to create more complex routes.
 * Routes<{
 *      root: Routes<{
 *          authentication: {
 *              login: [{email: string, password: string},void],
 *              logout: [void,void]
 *          }
 *      }>
 * }>
 */
export type Routes<T extends Record<string,Record<string,any>>> = UnionToIntersection<StringKeyValues<{
    [key in Extract<keyof T,string>]: Route<key,T[key]>
}>>;