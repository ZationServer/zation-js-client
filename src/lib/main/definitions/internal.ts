/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

export interface AuthToken {
    authUserGroup?: string,
    userId?: string | number,
    /**
     * Token id
     */
    tid?: string,
    panelAccess?: boolean,
    exp?: number,
    payload?: object
}

export const ZATION_CUSTOM_EVENT_NAMESPACE = '>CE.';
