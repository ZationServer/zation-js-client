/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

class ConBackup
{
    constructor(zation)
    {
        this._zation = zation;
        this._socket = this._zation._socket;
        this._wasAuthIn = false;
        this._oldChannels = {};

        this._inRestore = false;

        this._save = true;


        this._socket.on('close',() =>
        {
            if(!this._inRestore)
            {
                this._oldChannels = this._socket.channels;
            }
            this._socket.channels = {};
            this._save = false;
        });

        this._socket.on('authenticate',() =>
        {
            if(this._save)
            {
                this._wasAuthIn = true;
            }

            if(this._inRestore)
            {
                this._loadOldChannels();
                this._inRestore = false;
                this._save = true;
            }
        });

        this._socket.on('deauthenticate',() =>
        {
            if(this._save)
            {
                this._wasAuthIn = false;
            }
        });
    }

    _loadOldChannels()
    {
        for(let k in this._oldChannels)
        {
            if(this._oldChannels.hasOwnProperty(k))
            {
                this._socket.subscribe(k,{});
            }
        }
    }

    async restoreBackup()
    {
        this._inRestore = true;

        if(this._wasAuthIn)
        {
            await this._zation.authIn();
        }
        else
        {
            this._loadOldChannels();
            this._inRestore = false;
            this._save = true;
        }
    }
}

module.exports = ConBackup;