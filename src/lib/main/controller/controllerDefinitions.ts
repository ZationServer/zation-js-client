/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {DryBackError} from "../backError/backError";

export const enum ControllerRequestType {
    Standard,
    ValidationCheck,
    Auth
}

export interface ControllerReq {
    /**
     * ApiLevel
     */
    al?: number,
    /**
     * Controller
     */
    c?: string,
    /**
     * SystemController
     */
    sc?: string,
    /**
     * RequestType
     * @default 0
     */
    t?: ControllerRequestType,
    /**
     * Input
     */
    i?: any
}

export interface ControllerValidationCheckReq extends ControllerReq {
    /**
     * RequestType
     */
    t: ControllerRequestType.ValidationCheck,
    /**
     * Input
     */
    i: ValidationCheckPair[]
}

export interface ValidationCheckPair {
    /**
     * Path
     */
    p: string | string[],
    /**
     * Value
     */
    v: any
}

/**
 * Successful = errors.length === 0 or undefined
 */
export type ControllerRes = {
    /**
     * Errors
     */
    0: DryBackError[],
    /**
     * Result
     */
    1?: any
} | undefined;