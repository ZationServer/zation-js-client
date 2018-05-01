/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

const Zation         = require('./src/api/zation');
const Request        = require('./src/api/request');
const Result         = require('./src/api/result');
const ChannelRespond = require('./src/api/channelRespond');
const RequestRespond = require('./src/api/resultRespond');
const RequestAble    = require('./src/api/requestAble');

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

