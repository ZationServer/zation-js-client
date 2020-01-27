/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {
    CudOperation,
    DbSelector,
    IfOption,
    InfoOption, PotentialInsertOption,
    PotentialUpdateOption,
} from "./dbDefinitions";
import DbUtils                                               from "./dbUtils";

type CommitFunction = (operations : CudOperation[]) => void;

/**
 * Saves all commands for execute later.
 */
export default class DbCudOperationSequence
{
    private operations : CudOperation[] = [];
    private readonly commitFunction : CommitFunction;

    constructor(commitFunc : CommitFunction) {
        this.commitFunction = commitFunc;
    }

    /**
     * Do an insert operation.
     * Notice if you do a cud operation locally on the client,
     * that this operation is not done on the server-side.
     * So if the Databox reloads the data or resets the changes are lost.
     * If you want to do more changes, you should look at the seqEdit method.
     * Insert behavior:
     * Notice that in every case, the insert only happens when the key
     * does not exist on the client.
     * Otherwise, the client will ignore or convert it to an
     * update when potentiallyUpdate is active.
     * Other conditions are that the timeout is newer than the existing
     * timeout and all if conditions are true.
     * Head (with selector [] or '') -> Inserts the value.
     * KeyArray -> Inserts the value at the end with the key.
     * But if you are using a compare function, it will insert the value in the correct position.
     * Object -> Insert the value with the key.
     * Array -> Key will be parsed to int if it is a number, then it will be inserted at the index.
     * Otherwise, it will be inserted at the end.
     * @param selector
     * The selector describes which key-value pairs should be
     * deleted updated or where a value should be inserted.
     * It can be a string array key path, but it also can contain
     * filter queries (they work with the forint library).
     * You can filter by value ($value or property value) by key ($key or property key) or
     * select all keys with {} (For better readability use the constant $all).
     * In the case of insertions, most times, the selector should end with
     * a new key instead of a query.
     * Notice that all numeric values in the selector will be converted to a
     * string because all keys need to be from type string.
     * If you provide a string instead of an array, the string will be
     * split by dots to create a string array.
     * @param value
     * @param options
     */
    insert(selector : DbSelector, value : any, {if : ifOption,potentialUpdate,code,data} : IfOption & PotentialUpdateOption & InfoOption = {}) : DbCudOperationSequence {
        this.operations.push(DbUtils.buildInsert(selector,value,ifOption,potentialUpdate,code,data));
        return this;
    }

    /**
     * Do an update operation.
     * Notice if you do a cud operation locally on the client,
     * that this operation is not done on the server-side.
     * So if the Databox reloads the data or resets the changes are lost.
     * If you want to do more changes, you should look at the seqEdit method.
     * Update behavior:
     * Notice that in every case, the update only happens when the key
     * on the client does exist.
     * Otherwise, the client will ignore or convert it to an
     * insert when potentiallyInsert is active.
     * Other conditions are that the timeout is newer than the existing
     * timeout and all if conditions are true.
     * Head (with selector [] or '') -> Updates the complete structure.
     * KeyArray -> Updates the specific value.
     * Object -> Updates the specific value.
     * Array -> Key will be parsed to int if it is a number
     * it will update the specific value.
     * @param selector
     * The selector describes which key-value pairs should be
     * deleted updated or where a value should be inserted.
     * It can be a string array key path, but it also can contain
     * filter queries (they work with the forint library).
     * You can filter by value ($value or property value) by key ($key or property key) or
     * select all keys with {} (For better readability use the constant $all).
     * In the case of insertions, most times, the selector should end with
     * a new key instead of a query.
     * Notice that all numeric values in the selector will be converted to a
     * string because all keys need to be from type string.
     * If you provide a string instead of an array, the string will be
     * split by dots to create a string array.
     * @param value
     * @param options
     */
    update(selector : DbSelector, value : any, {if : ifOption,potentialInsert,code,data} : IfOption & PotentialInsertOption & InfoOption = {}) : DbCudOperationSequence {
        this.operations.push(DbUtils.buildUpdate(selector,value,ifOption,potentialInsert,code,data));
        return this;
    }

    /**
     * Do an delete operation.
     * Notice if you do a cud operation locally on the client,
     * that this operation is not done on the server-side.
     * So if the Databox reloads the data or resets the changes are lost.
     * If you want to do more changes, you should look at the seqEdit method.
     * Delete behavior:
     * Notice that in every case, the delete only happens when the key
     * on the client does exist.
     * Otherwise, the client will ignore it.
     * Other conditions are that the timeout is newer than the existing
     * timeout and all if conditions are true.
     * Head (with selector [] or '') -> Deletes the complete structure.
     * KeyArray -> Deletes the specific value.
     * Object -> Deletes the specific value.
     * Array -> Key will be parsed to int if it is a number it
     * will delete the specific value.
     * Otherwise, it will delete the last item.
     * @param selector
     * The selector describes which key-value pairs should be
     * deleted updated or where a value should be inserted.
     * It can be a string array key path, but it also can contain
     * filter queries (they work with the forint library).
     * You can filter by value ($value or property value) by key ($key or property key) or
     * select all keys with {} (For better readability use the constant $all).
     * In the case of insertions, most times, the selector should end with
     * a new key instead of a query.
     * Notice that all numeric values in the selector will be converted to a
     * string because all keys need to be from type string.
     * If you provide a string instead of an array, the string will be
     * split by dots to create a string array.
     * @param options
     */
    delete(selector : DbSelector, {if : ifOption,code,data} : IfOption & InfoOption = {}) : DbCudOperationSequence {
        this.operations.push(DbUtils.buildDelete(selector,ifOption,code,data));
        return this;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Apply all changes.
     * Notice if you do a cud operation locally on the client,
     * that this operation is not done on the server-side.
     * So if the Databox reloads the data or resets the changes are lost.
     */
    commit() {
        this.commitFunction(this.operations);
    }
}