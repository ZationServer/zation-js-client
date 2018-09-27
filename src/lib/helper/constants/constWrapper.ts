/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import errorTypes       = require('./errorTypes');
import settings         = require('./settings');
import SyController     = require("./systemController");
import Config           = require("./config");


class ConstWrapper
{
    static readonly Error = errorTypes;
    static readonly Settings = settings;
    static readonly SyController = SyController;
    static readonly Config = Config;
}

export = ConstWrapper;
