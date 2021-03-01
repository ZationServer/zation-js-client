/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {Default} from '../utils/typeUtils';

export type CustomApiDefinition<T extends APIDefinition> = T;
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