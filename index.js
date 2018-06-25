/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

const Zation         = require('./lib/api/zation');
const Request        = require('./lib/api/request');
const Result         = require('./lib/api/response');
const ChannelRespond = require('./lib/api/channelRespond');
const RequestRespond = require('./lib/api/resultRespond');
const RequestAble    = require('./lib/api/requestAble');

//Api Classes
module.exports.create = (settings) =>
{
    return new Zation(settings);
};

module.exports.Zation         = Zation;
module.exports.Request        = Request;
module.exports.Result         = Result;
module.exports.ChannelRespond = ChannelRespond;
module.exports.RequestRespond = RequestRespond;
module.exports.RequestAble    = RequestAble;

// browserify-ignore-start
//support for zation-server
const ZationReader            = require('./lib/reader/zationReader');
module.exports.ZationReader   = ZationReader;
// browserify-ignore-end