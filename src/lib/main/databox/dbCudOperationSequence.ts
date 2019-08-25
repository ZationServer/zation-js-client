/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {CudOperation, CudType, IfContainsOption, InfoOption} from "./dbDefinitions";
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
     * Base (with keyPath [] or '') -> Nothing
     * KeyArray -> Inserts the value at the end with the key
     * (if the key does not exist). But if you are using a compare function,
     * it will insert the value in the correct position.
     * Object -> Inserts the value with the key (if the key does not exist).
     * Array -> Key will be parsed to int if it is a number then it will be inserted at the index.
     * Otherwise, it will be added at the end.
     * With ifContains (ifContains exists):
     * Base (with keyPath [] or '') -> Nothing
     * KeyArray -> Inserts the value before the ifContains element with the key
     * (if the key does not exist). But if you are using a compare function,
     * it will insert the value in the correct position.
     * Object -> Inserts the value with the key (if the key does not exist).
     * Array -> Key will be parsed to int if it is a number then it will be inserted at the index.
     * Otherwise, it will be added at the end.
     * @param keyPath
     * The keyPath can be a string array or a
     * string where you can separate the keys with a dot.
     * @param value
     * @param options
     */
    insert(keyPath : string[] | string,value : any,{ifContains,code,data} : IfContainsOption & InfoOption = {}) : DbCudOperationSequence {
        keyPath = DbUtils.handleKeyPath(keyPath);
        this.operations.push({t : CudType.insert,k : keyPath,v : value,c : code,d : data,i : ifContains});
        return this;
    }

    /**
     * Do an update operation.
     * Notice if you do a cud operation locally on the client,
     * that this operation is not done on the server-side.
     * So if the Databox reloads the data or resets the changes are lost.
     * Update behavior:
     * Base (with keyPath [] or '') -> Updates the complete structure.
     * KeyArray -> Updates the specific value (if the key does exist).
     * Object -> Updates the specific value (if the key does exist).
     * Array -> Key will be parsed to int if it is a number it will
     * update the specific value (if the index exist).
     * @param keyPath
     * The keyPath can be a string array or a
     * string where you can separate the keys with a dot.
     * @param value
     * @param options
     */
    update(keyPath : string[] | string,value : any,{code,data} : InfoOption = {}) : DbCudOperationSequence {
        keyPath = DbUtils.handleKeyPath(keyPath);
        this.operations.push({t : CudType.update,k : keyPath,v : value,c : code,d : data});
        return this;
    }

    /**
     * Do an delete operation.
     * Notice if you do a cud operation locally on the client,
     * that this operation is not done on the server-side.
     * So if the Databox reloads the data or resets the changes are lost.
     * Delete behavior:
     * Base (with keyPath [] or '') -> Deletes the complete structure.
     * KeyArray -> Deletes the specific value (if the key does exist).
     * Object -> Deletes the specific value (if the key does exist).
     * Array -> Key will be parsed to int if it is a number it will delete the
     * specific value (if the index does exist). Otherwise, it will delete the last item.
     * @param keyPath
     * The keyPath can be a string array or a
     * string where you can separate the keys with a dot.
     * @param options
     */
    delete(keyPath : string[] | string,{code,data} : InfoOption = {}) : DbCudOperationSequence {
        keyPath = DbUtils.handleKeyPath(keyPath);
        this.operations.push({t : CudType.delete,k : keyPath,c : code,d : data});
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