/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {ControllerReq, ControllerRequestType} from "../../controllerDefinitions";

export function buildNormalControllerReq
(
    data: any,
    controller: string,
    isSystemController: boolean,
    apiLevel: number | undefined
): ControllerReq
{
    return {
        ...(apiLevel ? {al: apiLevel}: {}),
        [isSystemController ? 'sc': 'c']: controller,
        ...(data !== undefined ? {i: data} : {})
    };
}

export function buildAuthControllerReq(data: any, apiLevel: number | undefined): ControllerReq
{
    return {
        t: ControllerRequestType.Auth,
        ...(apiLevel ? {al: apiLevel}: {}),
        ...(data !== undefined ? {i: data} : {})
    };
}

export function buildValidationCheckControllerReq(input: object | any[], controller: string,
    isSystemController: boolean,
    apiLevel: number | undefined): ControllerReq
{
    return {
        t: ControllerRequestType.ValidationCheck,
        ...(apiLevel ? {al: apiLevel}: {}),
        [isSystemController ? 'sc': 'c']: controller,
        i: input
    };
}