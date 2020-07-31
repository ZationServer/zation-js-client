/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

type BackErrorInfo = Record<string,any> & {main ?: any};

export interface DryBackError {
    /**
     * Name
     */
    n: string,
    /**
     * Group
     */
    g?: string,
    /**
     * Type
     */
    t: string
    /**
     * Description
     */
    d?: string,
    /**
     * Custom
     */
    c: 0 | 1,
    /**
     * Info
     */
    i?: BackErrorInfo
}

export class BackError
{
    private readonly dryBackError: DryBackError;

    constructor(dryBackError: DryBackError) {
        this.dryBackError = dryBackError
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the name of the BackError.
     */
    getName(): string {
        return this.dryBackError.n;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the group of the BackError.
     */
    getGroup(): string | undefined {
        return this.dryBackError.g;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the BackError has a group.
     */
    hasGroup(): boolean {
        return this.dryBackError.g !== undefined;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the type of the BackError.
     */
    getType(): string {
        return this.dryBackError.t
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the description of the BackError.
     * Is undefined if it was not sended.
     */
    getDescription(): string | undefined {
        return this.dryBackError.d;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the BackError is a custom-defined error.
     */
    isCustom(): boolean {
        return !!this.dryBackError.c;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the info of the BackError.
     * If the info is not an object, it will return an empty object.
     */
    getInfo(): BackErrorInfo {
        return this.dryBackError.i || {};
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the BackError has an info object.
     */
    hasInfo(): boolean {
        return typeof this.dryBackError.i === 'object';
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the main info of the BackError.
     */
    getMainInfo(): string | undefined {
        return this.getInfo().main;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns if the BackError has main info.
     */
    hasMainInfo(): boolean {
        return this.getInfo().main !== undefined;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the info value form a key.
     * Is undefined if it was not sended.
     */
    getInfoValue(key: string): any | undefined {
        const info = this.getInfo();
        return !!info ? info[key]: undefined;
    }

    toString(): string
    {
        return `BackError -> \n` +
            `   Name: ${this.getName()}\n` +
            `   Group: ${this.getGroup() || 'No Group'}\n` +
            `   Type: ${this.getType()}\n` +
            `   Custom: ${this.isCustom()}\n`+
            `   Description: ${this.getDescription() || 'Unknown'}\n`+
            `   Info: ${typeof this.getInfo() === 'object' ? JSON.stringify(this.getInfo()): (this.getInfo() || 'Unknown')}\n`;
    }
}