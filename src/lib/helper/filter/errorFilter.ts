/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

export interface ErrorFilter
{
    name ?: string[] | string,
    type ?: string[] | string,
    info ?: object[] | object,
    infoKey ?: (string | string[] )[] | string
    infoValue ?: (string | string[] )[] | string
}


