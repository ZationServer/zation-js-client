/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {ErrorInfo, ResponseTaskError} from "../../constants/settings";

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
        return this.data[ResponseTaskError.NAME];
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the group of the task error.
     */
    getGroup() : string {
        return this.data[ResponseTaskError.GROUP];
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the task error has a group.
     */
    hasGroup() : boolean {
        return this.data[ResponseTaskError.GROUP] !== undefined;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the type of the task error.
     */
    getType() : string {
        return this.data[ResponseTaskError.TYPE];
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the description of the task error.
     * Is undefined if it was not sended.
     */
    getDescription() : string | undefined {
        return this.data[ResponseTaskError.DESCRIPTION];
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the task error is from zation system.
     * Is undefined if it was not sended.
     */
    isFromZationSystem() : boolean | undefined {
        return this.data[ResponseTaskError.FROM_ZATION_SYSTEM];
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the info of the task error.
     * Returns empty object if it was not sended.
     */
    getInfo() : object {
        return typeof this.data[ResponseTaskError.INFO] === 'object' ?
            this.data[ResponseTaskError.INFO] : {};
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the task error has info object.
     */
    hasInfo() : boolean {
        return typeof this.data[ResponseTaskError.INFO] === 'object';
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the main info of the task error.
     */
    getMainInfo() : string | undefined {
        return this.getInfo()[ErrorInfo.MAIN];
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the task error has main info.
     */
    hasMainInfo() : boolean {
        return this.getInfo()[ErrorInfo.MAIN] !== undefined;
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


