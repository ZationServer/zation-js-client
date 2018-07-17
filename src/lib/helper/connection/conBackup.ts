/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */
import Zation = require("../../api/zation");

class ConBackup
{
    private socket : any;

    //BackUpStore
    private wasAuthIn : boolean = false;
    private restoredChannels : object = {};

    private restoreMode : boolean = false;
    private saveMode : boolean = true;

    constructor(zation : Zation)
    {
        this.socket = zation.getSocket();

        this.wasAuthIn = false;
        this.restoredChannels = {};

        this.restoreMode = false;
        this.saveMode = true;


        this.socket.on('close',() =>
        {
            if(!this.restoreMode)
            {
                this.restoredChannels = this.socket.channels;
            }

            this.socket.channels = {};
            this.saveMode = false;
        });

        this.socket.on('authenticate',() =>
        {
            if(this.saveMode)
            {
                this.wasAuthIn = true;
            }

            if(this.restoreMode)
            {
                this._loadOldChannels();
                this.restoreMode = false;
                this.saveMode = true;
            }
        });

        this.socket.on('deauthenticate',() =>
        {
            if(this.saveMode)
            {
                this.wasAuthIn = false;
            }
        });
    }

    _loadOldChannels()
    {
        for(let k in this.restoredChannels)
        {
            if(this.restoredChannels.hasOwnProperty(k))
            {
                this.socket.subscribe(k,{});
            }
        }
    }

    async restoreBackup()
    {
        this.restoreMode = true;

        if(this.wasAuthIn)
        {
            await this._zation.authIn();
        }
        else
        {
            this._loadOldChannels();
            this.restoreMode = false;
            this.saveMode = true;
        }
    }
}

export = ConBackup;

