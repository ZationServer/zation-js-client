/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {registerReloadStrategy, ReloadStrategyBuilder} from './reloadStrategy';
import DbsHead                                         from '../storage/components/dbsHead';

/**
 * The history-based strategy will use the fetch-history to reload the
 * data by simply re-execute the whole fetch-history.
 * The fetch input is also considered, and if parallelFetch is active,
 * it does the fetches in parallel.
 * This strategy works in a lot of cases but not all.
 * Only when it is possible to reload all your data in a newer
 * state by just re-running the fetches,
 * you can use this strategy without any issues.
 */
export const buildHistoryBasedStrategy: ReloadStrategyBuilder<undefined> = () => {
    return async ({history,parallelFetch, reloadFetch}) => {
        if(history.length <= 0) return [];

        const results: DbsHead[] = [];
        if(parallelFetch) {
            await Promise.all(history.map(async histItem => {
                const fetchRes = await reloadFetch(histItem.input);
                if(fetchRes != null) results[fetchRes.counter] = fetchRes.data;
            }))
        }
        else {
            for (let i = 0; i < history.length; i++) {
                const fetchRes = await reloadFetch(history[i].input);
                if(fetchRes != null) results[fetchRes.counter] = fetchRes.data;
            }
        }
        return results;
    };
};

registerReloadStrategy('HistoryBased',buildHistoryBasedStrategy);