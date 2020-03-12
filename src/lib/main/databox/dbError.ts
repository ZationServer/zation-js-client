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
    static isNoMoreDataAvailable(err: any): boolean {
        return err.name === ErrorName.NoMoreDataAvailable;
    }

    /**
     * Returns if not data is available.
     * @param err
     */
    static isNoDataAvailable(err: any): err is {info: {code?: number | string,data?: any}} {
        return err.name === ErrorName.NoDataAvailable;
    }

    /**
     * Returns if the access is denied.
     * @param err
     */
    static isAccessDenied(err: any): boolean {
        return err.name === ErrorName.AccessDenied;
    }

    /**
     * Returns if the client has no access with the current version.
     * @param err
     */
    static hasNoAccessWithVersion(err: any): boolean {
        return err.name === ErrorName.NoAccessWithVersion;
    }

    /**
     * Returns if the client has no access with the current system.
     * @param err
     */
    static hasNoAccessWithSystem(err: any): boolean {
        return err.name === ErrorName.NoAccessWithSystem;
    }

    /**
     * Returns if the id is not valid.
     * @param err
     */
    static isIdNotValid(err: any): boolean {
        return err.name === ErrorName.IdIsNotValid;
    }

    /**
     * Returns if the API level is incompatible.
     * @param err
     */
    static isApiLevelIncompatible(err: any): boolean {
        return err.name === ErrorName.ApiLevelIncompatible;
    }

    /**
     * Returns if the databox limit is reached.
     * @param err
     */
    static isDataboxLimitReached(err: any): boolean {
        return err.name === ErrorName.DataboxLimitReached;
    }

    /**
     * Returns if the max backpressure is reached.
     * @param err
     */
    static isMaxBackpressureReached(err: any): boolean {
        return err.name === ErrorName.MaxBackpressureReached;
    }

    /**
     * Returns if the max input channels reached.
     * @param err
     */
    static isMaxInputChannelsReached(err: any): boolean {
        return err.name === ErrorName.MaxInputChannelsReached;
    }

    /**
     * Returns if the input is invalid.
     * @param err
     */
    static isInputInvalid(err: any): err is InvalidInputError {
        return err.name === ErrorName.InvalidInput;
    }
}