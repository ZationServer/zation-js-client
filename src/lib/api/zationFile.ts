/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {RequestAble} from "./requestAble";

class ZationFile implements RequestAble
{
    constructor()
    {

    }

    async toRequestData() : Promise<object>
    {
        return {};
    }
}

export = ZationFile;