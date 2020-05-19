/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {ZationClient} from "./zationClient";

const proxyDefined = typeof Proxy === 'function';

const unsetDefaultClientValue = proxyDefined ? new Proxy({},{
    get: () => {throw new Error('The main client does not exist. Create a main client with the function: create or set the main client with the function: setMainClient.');},
    set: () => {throw new Error('The main client does not exist. Create a main client with the function: create or set the main client with the function: setMainClient.');}
}) as ZationClient : undefined as any;

export let mainClient: ZationClient = unsetDefaultClientValue;

export class ZationMainClientManager {

    private static mainClientChangeListener: ((client: ZationClient) => void)[] = [];

    /**
     * Clears the main client.
     * The main client can be easily accessed in any
     * file by importing: client from this module.
     */
    static clear(): void {
        mainClient = unsetDefaultClientValue;
        this.mainClientChangeListener.forEach(l => l(unsetDefaultClientValue));
    }

    /**
     * Sets the main client.
     * The main client can be easily accessed in any file
     * by importing: client from this module.
     * To clear the main client later you can
     * use the function: clearMainClient.
     * @param client
     */
    static set(client: ZationClient): void {
        mainClient = client;
        this.mainClientChangeListener.forEach(l => l(client));
    }

    static onMainClientChange(listener: (client: ZationClient) => void): void {
        this.mainClientChangeListener.push(listener);
    }
}

/**
 * Clears the main client.
 * The main client can be easily accessed in any
 * file by importing: client from this module.
 */
export const clearMainClient = ZationMainClientManager.clear.bind(ZationMainClientManager);
/**
 * Sets the main client.
 * The main client can be easily accessed in any file
 * by importing: client from this module.
 * To clear the main client later you can
 * use the function: clearMainClient.
 * @param client
 */
export const setMainClient = ZationMainClientManager.set.bind(ZationMainClientManager);
