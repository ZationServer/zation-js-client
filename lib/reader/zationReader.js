/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

const zationClientMinFile          = __dirname + './../../zation.min.js';
const zationClientFile             = __dirname + './../../zation.js';

const fs   = require('fs');
const path = require('path');

class ZationReader
{
    static getZationMinifyClient()
    {
        return fs.readFileSync(path.resolve(zationClientMinFile), "utf8");
    }

    static getZationClient()
    {
        return fs.readFileSync(path.resolve(zationClientFile), "utf8");
    }
}

module.exports = ZationReader;