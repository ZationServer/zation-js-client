/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

export interface ZationToken {
    authUserGroup?: string,
    userId?: string | number,
    /**
     * Token id
     */
    tid?: string,
    panelAccess?: boolean,
    exp?: number,
    variables?: object
}

export const ZATION_CUSTOM_EVENT_NAMESPACE = '>CE.';
