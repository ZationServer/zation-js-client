/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

export interface ErrorFilter
{
    name?: string[] | string,
    group?: string[] | string,
    type?: string[] | string,
    info?: object[] | object,
    infoKey?: (string | string[] )[] | string
    infoValue?: (any | any[] )[] | any
    fromZationSystem?: boolean
}


