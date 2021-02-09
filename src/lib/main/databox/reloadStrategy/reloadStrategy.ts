/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import DbsHead            from '../storage/components/dbsHead';
import {FetchHistoryItem} from '../dbFetchHistoryManager';
import {ImmutableJson}    from '../../utils/typeUtils';

export type ReloadStrategy = (context: {
    currentData: ImmutableJson,
    history: FetchHistoryItem[],
    parallelFetch: boolean,
    reloadFetch: (input?: any) => Promise<{data: DbsHead, counter: number} | null>,
    disconnectedTimestamp?: number
}) => Promise<DbsHead[]>;

export type ReloadStrategyBuilder<T> = (options?: T) => ReloadStrategy;

const reloadStrategyBuilderRegister = {}

/**
 * Registers a new reload strategy.
 * Registered strategies can be specified from the server-side.
 * But notice only to use JSON friendly values in the options.
 * @param name
 * @param builder
 */
export function registerReloadStrategy<T>(name: string, builder: ReloadStrategyBuilder<T>): ReloadStrategyBuilder<T> {
    reloadStrategyBuilderRegister[name] = builder;
    return builder;
}

export function getReloadStrategyBuilder(name: string): ReloadStrategyBuilder<any> | undefined {
    return reloadStrategyBuilderRegister[name];
}