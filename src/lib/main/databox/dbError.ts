/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {ErrorName}         from "../definitions/errorName";
import {InvalidInputError} from "../error/invalidInputError";

export default class DbError {

    /**
     * Returns if it is a not data error.
     * @param err
     */
    static isNoData(err: any): err is {info: {code?: number | string,data?: any}} {
        return err.name === ErrorName.NoData;
    }

    /**
     * Returns if the access is denied.
     * @param err
     */
    static isAccessDenied(err: any): boolean {
        return err.name === ErrorName.AccessDenied;
    }

    /**
     * Returns if the member is invalid.
     * @param err
     */
    static isInvalidMember(err: any): err is {info: {code?: number | string,data?: any}} {
        return err.name === ErrorName.InvalidMember;
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