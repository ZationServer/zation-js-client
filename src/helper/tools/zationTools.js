/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

class ZationTools
{
    static _isAuthIn(authGroup)
    {
        return authGroup !== undefined && authGroup !== '';
    }

    static async _buildRequestData(request, system, version)
    {
        if (!(request instanceof Request))
        {
            request = new Request(request,{});
        }

        let taskBody = await request.getRequestObj();
        return {
            v: version,
            s: system,
            t: taskBody
        };
    }

    // noinspection JSUnusedGlobalSymbols
    static _printWarning(txt)
    {
        console.error(`ZATION WARNING -> ${txt}`);
    }

    static _printInfo(txt)
    {
        console.log(`ZATION INFO -> ${txt}`);
    }

    static _buildAuthRequestData(authData, system, version)
    {
        return {
            v: version,
            s: system,
            a:
                {
                    p: authData
                }
        };
    }
}