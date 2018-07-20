/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */
import Zation = require("../../api/zation");

class ConBackup
{
    private socket : any;
    private readonly zation : Zation;

    //BackUpStore
    private savedWasAuthIn : boolean = false;
    private savedChannels : object = {};

    private restoreSavedMode : boolean = false;
    private saveMode : boolean = true;

    constructor(zation : Zation)
    {
        this.zation = zation;
        this.socket = zation.getSocket();

        this.savedWasAuthIn = false;
        this.savedChannels = {};

        this.restoreSavedMode = false;
        this.saveMode = true;

        this.socket.on('close',() =>
        {
            if(!this.saveMode) {
                this.savedChannels = this.socket.channels;
            }

            this.socket.channels = {};
            this.saveMode = false;
        });

        this.socket.on('authenticate',() =>
        {
            if(this.saveMode) {
                this.savedWasAuthIn = true;
            }

            if(!this.saveMode) {
                this.loadOldChannels();
                this.restoreSavedMode = false;
                this.saveMode = true;
            }
        });

        this.socket.on('deauthenticate',() =>
        {
            if(this.saveMode) {
                this.savedWasAuthIn = false;
            }

        });

        this.socket.on('connect',() =>
        {
            if(this.saveMode) {
                this.savedWasAuthIn = false;
            }

        });

    }

    private loadOldChannels()
    {
        for(let k in this.savedChannels)
        {
            if(this.savedChannels.hasOwnProperty(k))
            {
                this.socket.subscribe(k,{});
            }
        }
    }

    async restoreBackup()
    {
        this.saveMode = false;

        if(this.savedWasAuthIn) {
            await this.zation.getAuthEngine().authIn();
        }
        else {
            this.loadOldChannels();
            this.saveMode = true;
        }
    }
}

export = ConBackup;

