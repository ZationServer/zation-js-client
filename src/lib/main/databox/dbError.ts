/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {ErrorName}         from "../../main/constants/errorName";
import {InvalidInputError} from "../error/invalidInputError";

export default class DbError {

    /**
     * Returns if no more data is available.
     * @param err
     */
    static isNoMoreDataAvailable(err : any) : boolean {
        return err.name === ErrorName.NO_MORE_DATA_AVAILABLE;
    }

    /**
     * Returns if not data is available.
     * @param err
     */
    static isNoDataAvailable(err : any) : err is {info : {code ?: number | string,data ?: any}} {
        return err.name === ErrorName.NO_DATA_AVAILABLE;
    }

    /**
     * Returns if the access is denied.
     * @param err
     */
    static isAccessDenied(err : any) : boolean {
        return err.name === ErrorName.ACCESS_DENIED;
    }

    /**
     * Returns if the client has no access with the current version.
     * @param err
     */
    static hasNoAccessWithVersion(err : any) : boolean {
        return err.name === ErrorName.NO_ACCESS_WITH_VERSION;
    }

    /**
     * Returns if the client has no access with the current system.
     * @param err
     */
    static hasNoAccessWithSystem(err : any) : boolean {
        return err.name === ErrorName.NO_ACCESS_WITH_SYSTEM;
    }

    /**
     * Returns if the id is not valid.
     * @param err
     */
    static isIdNotValid(err : any) : boolean {
        return err.name === ErrorName.ID_IS_NOT_VALID;
    }

    /**
     * Returns if the API level is incompatible.
     * @param err
     */
    static isApiLevelIncompatible(err : any) : boolean {
        return err.name === ErrorName.API_LEVEL_INCOMPATIBLE;
    }

    /**
     * Returns if the databox limit is reached.
     * @param err
     */
    static isDataboxLimitReached(err : any) : boolean {
        return err.name === ErrorName.DATABOX_LIMIT_REACHED;
    }

    /**
     * Returns if the max backpressure is reached.
     * @param err
     */
    static isMaxBackpressureReached(err : any) : boolean {
        return err.name === ErrorName.MAX_BACKPRESSURE_REACHED;
    }

    /**
     * Returns if the max input channels reached.
     * @param err
     */
    static isMaxInputChannelsReached(err : any) : boolean {
        return err.name === ErrorName.MAX_INPUT_CHANNELS_REACHED;
    }

    /**
     * Returns if the input is invalid.
     * @param err
     */
    static isInputInvalid(err : any) : err is InvalidInputError {
        return err.name === ErrorName.INVALID_INPUT;
    }
}