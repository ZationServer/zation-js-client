/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

const zationClientMinFile          = __dirname + './../../zation.min.js';
const zationClientFile             = __dirname + './../../zation.js';

import fs   = require('fs');
import path = require('path');

class ZationReader
{
    static getZationMinifyClient() : string {
        return fs.readFileSync(path.resolve(zationClientMinFile), "utf8");
    }

    static getZationClient() : string {
        return fs.readFileSync(path.resolve(zationClientFile), "utf8");
    }
}

export = ZationReader;