/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {
    CudOperation,
    CudType,
    DbCudSelector,
    IfContainsOption,
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
     * Insert behavior:
     * Without ifContains (ifContains exists):
     * Base (with selector [] or '') -> Nothing
     * KeyArray -> Inserts the value at the end with the key
     * (if the key does not exist). But if you are using a compare function,
     * it will insert the value in the correct position.
     * Object -> Inserts the value with the key (if the key does not exist).
     * Array -> Key will be parsed to int if it is a number then it will be inserted at the index.
     * Otherwise, it will be added at the end.
     * With ifContains (ifContains exists):
     * Base (with selector [] or '') -> Nothing
     * KeyArray -> Inserts the value before the ifContains element with the key
     * (if the key does not exist). But if you are using a compare function,
     * it will insert the value in the correct position.
     * Object -> Inserts the value with the key (if the key does not exist).
     * Array -> Key will be parsed to int if it is a number then it will be inserted at the index.
     * Otherwise, it will be added at the end.
     * @param selector
     * The selector can be a direct key-path,
     * can contain filter queries (by using the forint library)
     * or it can select all items with '*'.
     * If you use a string as a param type,
     * you need to notice that it will be split into a path by dots.
     * All numeric values will be converted to a string because the key can only be a string.
     * @param value
     * @param options
     */
    insert(selector : DbCudSelector,value : any,{ifContains,code,data,potentialUpdate} : IfContainsOption & PotentialUpdateOption & InfoOption = {}) : DbCudOperationSequence {
        this.operations.push({
            t : CudType.insert,
            s : DbUtils.processSelector(selector),
            v : value,
            c : code,
            d : data,
            i : ifContains,
            p : potentialUpdate ? 1 : 0
        });
        return this;
    }

    /**
     * Do an update operation.
     * Notice if you do a cud operation locally on the client,
     * that this operation is not done on the server-side.
     * So if the Databox reloads the data or resets the changes are lost.
     * Update behavior:
     * Base (with selector [] or '') -> Updates the complete structure.
     * KeyArray -> Updates the specific value (if the key does exist).
     * Object -> Updates the specific value (if the key does exist).
     * Array -> Key will be parsed to int if it is a number it will
     * update the specific value (if the index exist).
     * @param selector
     * The selector can be a direct key-path,
     * can contain filter queries (by using the forint library)
     * or it can select all items with '*'.
     * If you use a string as a param type,
     * you need to notice that it will be split into a path by dots.
     * All numeric values will be converted to a string because the key can only be a string.
     * @param value
     * @param options
     */
    update(selector : DbCudSelector,value : any,{ifContains,code,data,potentialInsert} : IfContainsOption & PotentialInsertOption & InfoOption = {}) : DbCudOperationSequence {
        this.operations.push({
            t : CudType.update,
            s : DbUtils.processSelector(selector),
            v : value,
            c : code,
            d : data,
            i : ifContains,
            p : potentialInsert ? 1 : 0
        });
        return this;
    }

    /**
     * Do an delete operation.
     * Notice if you do a cud operation locally on the client,
     * that this operation is not done on the server-side.
     * So if the Databox reloads the data or resets the changes are lost.
     * Delete behavior:
     * Base (with selector [] or '') -> Deletes the complete structure.
     * KeyArray -> Deletes the specific value (if the key does exist).
     * Object -> Deletes the specific value (if the key does exist).
     * Array -> Key will be parsed to int if it is a number it will delete the
     * specific value (if the index does exist). Otherwise, it will delete the last item.
     * @param selector
     * The selector can be a direct key-path,
     * can contain filter queries (by using the forint library)
     * or it can select all items with '*'.
     * If you use a string as a param type,
     * you need to notice that it will be split into a path by dots.
     * All numeric values will be converted to a string because the key can only be a string.
     * @param options
     */
    delete(selector : DbCudSelector,{ifContains,code,data} : IfContainsOption & InfoOption = {}) : DbCudOperationSequence {
        this.operations.push({
            t : CudType.delete,
            s : DbUtils.processSelector(selector),
            c : code,
            d : data,
            i : ifContains
        });
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