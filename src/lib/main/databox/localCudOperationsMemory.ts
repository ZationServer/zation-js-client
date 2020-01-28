/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {LocalCudOperation} from "./dbDefinitions";

export default class LocalCudOperationsMemory {

    private cudLastAddedLocalOperations: LocalCudOperation[];
    private cudLocalOperations: LocalCudOperation[] = [];

    /**
     * Adds a local cud operation.
     * @param operation
     */
    public add(operation: LocalCudOperation): void {
        this.addMultiple([operation]);
    }

    /**
     * Adds multiple local cud operations.
     * @param operations
     */
    public addMultiple(operations: LocalCudOperation[]): void {
        this.cudLocalOperations.push(...operations);
        this.cudLastAddedLocalOperations = operations;
    }

    /**
     * Removes local cud operations from memory.
     * @param operations
     */
    public remove(operations: LocalCudOperation[]): void {
        this.cudLocalOperations = this.cudLocalOperations.filter(e => operations.indexOf(e) == -1);
    }

    /**
     * Resets the memory.
     */
    public reset() {
        this.cudLocalOperations = [];
        this.cudLastAddedLocalOperations = [];
    }

    /**
     * Clear the memory.
     */
    public clear() {
        this.cudLocalOperations = [];
    }

    /**
     * Returns all local cud operations from the memory.
     */
    public getAll(): LocalCudOperation[] {
        return this.cudLocalOperations;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns the last added local cud operations.
     */
    public getLast(): LocalCudOperation[] {
        return this.cudLastAddedLocalOperations;
    }
}