/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

const errorTypes          = require('./errorTypes');
const settings            = require('./settings');
const systemController    = require('./systemController');

class ConstWrapper {}

ConstWrapper.Error              = errorTypes;
ConstWrapper.Settings           = settings;
ConstWrapper.SystemControleller = systemController;

module.exports = ConstWrapper;