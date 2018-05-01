/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

class Request
{
    constructor(controller, params)
    {
        this._controller = controller;
        this._params = params;
    }

    static _readParam(param,howToAdd)
    {
        return new Promise(async (resolve) =>
        {
            if(param instanceof  RequestAble)
            {
                howToAdd(await param.getJson());
                resolve();
            }
            else
            {
                howToAdd(param);
                resolve();
            }
        });
    }

    async getRequestObj()
    {
        let json = {c: this._controller};
        let params = undefined;
        let promises = [];

        if(Array.isArray(this._params))
        {
            params = [];
            for(let i = 0; i < this._params.length; i++)
            {
                promises.push(Request._readParam(this._params[i], (p) =>
                    {
                        params.push(p);
                    }
                ));
            }
        }
        else
        {
            params = {};
            for(let k in this._params)
            {
                if(this._params.hasOwnProperty(k))
                {
                    promises.push(Request._readParam(this._params[k], (p) =>
                        {
                            params[k] = p;
                        }
                    ));
                }
            }
        }

        await Promise.all(promises);
        json['p'] = params;
        return json;
    }
}

module.exports = Request;