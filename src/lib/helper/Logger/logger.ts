/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

class Logger
{
    static printInfo(txt : string)
    {
        console.log('\x1b[34m%s\x1b[0m','   [INFO]',txt);
    }
}

export = Logger;

