/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */


import errorTypes       = require('./errorTypes');
import settings         = require('./settings');
import SyController     = require("./systemController");


class ConstWrapper
{
    static readonly Error = errorTypes;
    static readonly Settings = settings;
    static readonly SyController = SyController;
}

export = ConstWrapper;
