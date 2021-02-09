/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {registerReloadStrategy, ReloadStrategyBuilder} from './reloadStrategy';
import DbsHead                                         from '../storage/components/dbsHead';

function searchForOldestTimestamp(data: any, timestampKey: string): number | null {
    if(Array.isArray(data) && data.length > 0) {
        let oldestTimestamp: number | null = null;
        let tempTimestamp;
        for(let i = 0; i < data.length; i++) {
            tempTimestamp = data[i][timestampKey];
            if(typeof tempTimestamp === 'number' && (oldestTimestamp == null || tempTimestamp < oldestTimestamp))
                oldestTimestamp = tempTimestamp;
        }
        return oldestTimestamp;
    }
    return null;
}

/**
 * The time-based list strategy is ideal if you have a list of items that is flexible in size,
 * should be streamed, and each element has a timestamp.
 * This strategy first defines an end timestamp by using the oldest timestamp of the
 * existing elements or the disconnect timestamp.
 * If there is no element and the reload is not a reconnect reload the
 * strategy will not work and return no data.
 * Otherwise, it will start to fetch elements until the max fetch amount is reached or
 * an element is found that has an older or equals timestamp than the previously defined end timestamp.
 * So, the strategy will load all missed newest inserts and your
 * current data in a new state by using timestamps.
 * Duo to fetch batch size it could happen that you get some more older items than expected.
 * @param options
 */
export const buildTimeBasedListStrategy: ReloadStrategyBuilder<{
    /**
     * The property name where the timestamp is located.
     * @default 'created'
     */
    timestampKey?: string,
    /**
     * The maximal amount of fetches before give up.
     * @default 100
     */
    maxFetchTries?: number
    /**
     * Time delta of disconnected timestamp.
     * @default 5000
     */
    disconnectTimeDelta?: number
}> = (options = {}) => {

    const timestampKey = options.timestampKey ?? 'created';
    const maxFetchTries = options.maxFetchTries ?? 100;

    return async ({
                      currentData,
                      disconnectedTimestamp,
                      reloadFetch}) =>
    {
        let oldEndTimestamp: number | null = searchForOldestTimestamp(currentData,timestampKey);
        if(oldEndTimestamp == null) {
            if(disconnectedTimestamp != null) oldEndTimestamp = disconnectedTimestamp - (options.disconnectTimeDelta ?? 5000);
            else return [];
        }

        const results: DbsHead[] = [];
        for (let i = 0; i < maxFetchTries; i++) {
            const fetchRes = await reloadFetch();
            if(fetchRes != null) {
                results.push(fetchRes.data);
                const oldestDataTimestamp = searchForOldestTimestamp(fetchRes.data.data,timestampKey);
                if(oldestDataTimestamp != null && oldestDataTimestamp <= oldEndTimestamp) return results;
            }
        }
        return results;
    };
};

registerReloadStrategy('TimeBasedList',buildTimeBasedListStrategy);