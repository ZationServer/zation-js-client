/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */


//Api Classes
exports.create = (settings) =>
{
    return new Zation(settings);
};

import RequestAble = require("./lib/api/requestAble");
import ZationFile = require("./lib/api/zationFile");
import WsRequest = require("./lib/api/wsRequest");
import HttpRequest = require("./lib/api/httpRequest");

exports = RequestAble;
exports = ZationFile;
exports = WsRequest;
exports = HttpRequest;

// browserify-ignore-start
//support for zation-server
import ZationReader  = require('./lib/reader/zationReader');
exports = ZationReader;
// browserify-ignore-end