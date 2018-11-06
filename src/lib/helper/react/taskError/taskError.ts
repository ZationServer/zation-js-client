/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {TaskErrorInfo, ResponseTaskError} from "../../constants/internal";

export class TaskError
{
    private readonly data : ResponseTaskError;

    constructor(data : ResponseTaskError) {
        this.data = data
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the name of the task error.
     */
    getName() : string {
        return this.data.n;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the group of the task error.
     */
    getGroup() : string | undefined {
        return this.data.g;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the task error has a group.
     */
    hasGroup() : boolean {
        return this.data.g !== undefined;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the type of the task error.
     */
    getType() : string {
        return this.data.t
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the description of the task error.
     * Is undefined if it was not sended.
     */
    getDescription() : string | undefined {
        return this.data.d;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the task error is from zation system.
     * Is undefined if it was not sended.
     */
    isFromZationSystem() : boolean | undefined {
        return this.data.zs;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the info of the task error.
     * Returns empty object if it was not sended.
     */
    getInfo() : object {
        return typeof this.data.i === 'object' ?
            this.data.i : {};
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the task error has info object.
     */
    hasInfo() : boolean {
        return typeof this.data.i === 'object';
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the main info of the task error.
     */
    getMainInfo() : string | undefined {
        return this.getInfo()[TaskErrorInfo.MAIN];
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the task error has main info.
     */
    hasMainInfo() : boolean {
        return this.getInfo()[TaskErrorInfo.MAIN] !== undefined;
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


