/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

export class Logger
{
    static printInfo(txt: string) {
        console.log('\x1b[34m%s\x1b[0m','   [INFO]',txt);
    }

    static printError(...args: (object | string)[]) {
        console.error('\x1b[31m%s\x1b[0m', '   [Error]',...args);
    }
}


