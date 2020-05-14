/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {
    ControllerStandardReq,
    ControllerValidationCheckReq,
    SpecialController,
    ValidationCheckPair
} from "../../controllerDefinitions";

export function buildNormalControllerReq
(
    controller: string | SpecialController,
    data: any,
    apiLevel: number | undefined): ControllerStandardReq
{
    return {
        c: controller,
        ...(apiLevel ? {a: apiLevel}: {}),
        ...(data !== undefined ? {d: data} : {})
    };
}

export function buildValidationCheckControllerReq
(
    controller: string | SpecialController,
    checks: ValidationCheckPair[],
    apiLevel: number | undefined): ControllerValidationCheckReq
{
    return {
        c: controller,
        ...(apiLevel ? {a: apiLevel}: {}),
        v: checks
    };
}