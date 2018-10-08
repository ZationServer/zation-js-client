/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import Const = require("../../constants/constWrapper");

export class TaskError
{
    private readonly data : object;

    constructor(data : object) {
        this.data = data
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the name of the task error.
     */
    getName() : string {
        return this.data[Const.Settings.RESPONSE.ERROR.Name];
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the type of the task error.
     */
    getType() : string {
        return this.data[Const.Settings.RESPONSE.ERROR.TYPE];
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the description of the task error.
     * Is undefined if it was not sended.
     */
    getDescription() : string | undefined {
        return this.data[Const.Settings.RESPONSE.ERROR.DESCRIPTION];
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the task error is from zation system.
     * Is undefined if it was not sended.
     */
    isFromZationSystem() : boolean | undefined {
        return this.data[Const.Settings.RESPONSE.ERROR.FROM_ZATION_SYSTEM];
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the info of the task error.
     * Returns empty object if it was not sended.
     */
    getInfo() : object {
        return typeof this.data[Const.Settings.RESPONSE.ERROR.INFO] === 'object' ?
            this.data[Const.Settings.RESPONSE.ERROR.INFO] : {};
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the task error has info object.
     */
    hasInfo() : boolean {
        return typeof this.data[Const.Settings.RESPONSE.ERROR.INFO] === 'object';
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the info value form a key.
     * Is undefined if it was not sended.
     */
    getInfoValue(key : string) : any | undefined {
        const info = this.getInfo();
        return !!info ? info[key] : undefined;
    }

}


