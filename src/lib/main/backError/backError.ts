/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

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
    i?: Record<string,any>
}

export class BackError
{
    private readonly dryBackError: DryBackError;

    constructor(dryBackError: DryBackError) {
        this.dryBackError = dryBackError
    }

    /**
     * @description
     * The name of the BackError.
     */
    get name(): string {
        return this.dryBackError.n;
    }

    /**
     * @description
     * The group of the BackError.
     * Multiple errors can belong to a group.
     */
    get group(): string | undefined {
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

    /**
     * @description
     * The type of the BackError.
     * The error type is a very abstract topic name.
     * Like validation error, database error, input error.
     * @default ErrorType.NormalError
     */
    get type(): string {
        return this.dryBackError.t
    }

    /**
     * @description
     * The description of the BackError.
     * Contains a more detailed message about the error.
     * Is undefined if it was not sent.
     */
    get description(): string | undefined {
        return this.dryBackError.d;
    }

    /**
     * @description
     * Indicates if the BackError is a custom-defined error.
     */
    get custom(): boolean {
        return !!this.dryBackError.c;
    }

    /**
     * @description
     * The BackError info.
     * The BackError info is a dynamic object which contains more detailed information.
     * For example, with an valueNotMatchesWithMinLength error,
     * the info object could include what the length of the input is and
     * what the minimum length is.
     */
    get info(): Record<string,any> {
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

    toString(): string
    {
        return `BackError -> \n` +
            `   Name: ${this.name}\n` +
            `   Group: ${this.group || 'No Group'}\n` +
            `   Type: ${this.type}\n` +
            `   Custom: ${this.custom}\n`+
            `   Description: ${this.description || 'Unknown'}\n`+
            `   Info: ${this.hasInfo() ? JSON.stringify(this.info) : 'Unknown'}\n`;
    }
}