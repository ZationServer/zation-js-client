/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {BackErrorInfo, ResponseBackError} from "../helper/constants/internal";

export class BackError
{
    private readonly data : ResponseBackError;

    constructor(data : ResponseBackError) {
        this.data = data
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the name of the BackError.
     */
    getName() : string {
        return this.data.n;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the group of the BackError.
     */
    getGroup() : string | undefined {
        return this.data.g;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the BackError has a group.
     */
    hasGroup() : boolean {
        return this.data.g !== undefined;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the type of the BackError.
     */
    getType() : string {
        return this.data.t
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the description of the BackError.
     * Is undefined if it was not sended.
     */
    getDescription() : string | undefined {
        return this.data.d;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the BackError is from zation system.
     * Is undefined if it was not sended.
     */
    isFromZationSystem() : boolean | undefined {
        return this.data.zs;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the info of the BackError.
     * If the info is not an object, it will return an empty object.
     */
    getInfo() : object {
        return typeof this.data.i === 'object' ?
            this.data.i : {};
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the BackError has an info object.
     */
    hasInfo() : boolean {
        return typeof this.data.i === 'object';
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the main info of the BackError.
     */
    getMainInfo() : string | undefined {
        return this.getInfo()[BackErrorInfo.MAIN];
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the BackError has main info.
     */
    hasMainInfo() : boolean {
        return this.getInfo()[BackErrorInfo.MAIN] !== undefined;
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

    toString() : string
    {
        return `BackError -> \n` +
            `   Name: ${this.getName()}\n` +
            `   Group: ${this.getGroup() || 'NO GROUP'}\n` +
            `   Type: ${this.getType()}\n` +
            `   FromZationSystem: ${this.isFromZationSystem() || 'UNKNOWN'}\n`+
            `   Description: ${this.getDescription() || 'UNKNOWN'}\n`+
            `   Info: ${typeof this.getInfo() === 'object' ? JSON.stringify(this.getInfo()) : (this.getInfo() || 'UNKNOWN')}\n`;
    }

}


