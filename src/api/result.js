/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

class Result
{

    constructor(data)
    {
        this._successful = false;
        this._resultValues = [];
        this._resultKeyValuePairs = {};
        this._erros = [];

        this._readData(data);
        this._buildNewAuthData();
    }


    // noinspection JSUnusedGlobalSymbols
    getValueResults()
    {
        return this._resultValues;
    }

    // noinspection JSUnusedGlobalSymbols
    getKeyValuePairResults()
    {
        return this._resultKeyValuePairs;
    }

    // noinspection JSUnusedGlobalSymbols
    getResultByKey(key)
    {
        return this._resultKeyValuePairs[key];
    }

    // noinspection JSUnusedGlobalSymbols
    hasResultWithKey(key)
    {
        return this._resultKeyValuePairs[key] !== undefined;
    }

    // noinspection JSUnusedGlobalSymbols
    isSuccessful()
    {
        return this._successful;
    }

    // noinspection JSUnusedGlobalSymbols
    getNewAuthGroup()
    {
        return this._newAuthGroup;
    }

    // noinspection JSUnusedGlobalSymbols
    getNewAuthId()
    {
        return this._newAuthId;
    }

    // noinspection JSUnusedGlobalSymbols
    hasNewAuthId()
    {
        return this._newAuthId !== undefined;
    }

    // noinspection JSUnusedGlobalSymbols
    hasNewAuthGroup()
    {
        return this._newAuthGroup !== undefined;
    }

    // noinspection JSUnusedGlobalSymbols
    getErrors()
    {
        return this._erros;
    }

    // noinspection JSUnusedGlobalSymbols
    hasErrors()
    {
        return this._erros.length > 0;
    }

    // noinspection JSUnusedGlobalSymbols
    hasNewAuthData()
    {
        return this._newAuthDataBool;
    }

    // noinspection JSUnusedGlobalSymbols
    getFirstResult()
    {
        return this._resultValues[0];
    }

    // noinspection JSUnusedGlobalSymbols
    hasFirstResultValue()
    {
        return this._resultValues[0] !== undefined;
    }

    // noinspection JSUnusedGlobalSymbols
    getResultFromIndex(index)
    {
        return this._resultValues[index];
    }

    // noinspection JSUnusedGlobalSymbols
    hasResultWithIndex(index)
    {
        return this._resultValues[index] !== undefined;
    }

    _readData(data)
    {
        if (data.s !== undefined) {
            this._successful = data.s;
        }

        if (data.r !== undefined) {
            if (data.r.v !== undefined && Array.isArray(data.r.v)) {
                this._resultValues = data.r.v;
            }

            if (data.r.kv !== undefined && typeof data.r.kv === 'object') {
                this._resultKeyValuePairs = data.r.kv;
            }
        }

        if (data.a !== undefined && typeof data.a === 'object') {
            this._newAuthData = data.a;
        }

        if (data.e !== undefined && Array.isArray(data.e)) {
            this._erros = data.e;
        }
    }

    // noinspection JSUnusedGlobalSymbols
    isErrorNameIn(name)
    {
        return Filter._getWhoHas(this._erros, name, 'n', Filter._filterEquals).length !== 0;
    }

    // noinspection JSUnusedGlobalSymbols
    isOneOfErrorNameIn(names)
    {
        return Filter._getWhoHasOneOf(this._erros, names, 'n', Filter._filterEquals).length !== 0;
    }

    // noinspection JSUnusedGlobalSymbols
    isErrorTypeIn(type)
    {
        return Filter._getWhoHas(this._erros, type, 't', Filter._filterEquals).length !== 0;
    }

    // noinspection JSUnusedGlobalSymbols
    isOneOfErrorTypeIn(types)
    {
        return Filter._getWhoHasOneOf(this._erros, types, 't', Filter._filterEquals) !== 0;
    }

    // noinspection JSUnusedGlobalSymbols
    getErrorWithName(name)
    {
        let res = undefined;
        for (let i = 0; i < this._erros.length; i++) {
            if (this._erros[i]['n'] === name) {
                res = this._erros[i];
                break;
            }
        }
        return res;
    }

    _buildNewAuthData()
    {
        if (this._newAuthData.hasOwnProperty('newAuthId')) {
            this._newAuthDataBool = true;
            this._newAuthId = this._newAuthData.newAuthId;
        }

        if (this._newAuthData.hasOwnProperty('newAuthGroup')) {
            this._newAuthDataBool = true;
            this._newAuthGroup = this._newAuthData.newAuthGroup;
        }
    }
}

module.exports = Result;