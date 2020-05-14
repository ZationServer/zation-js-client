/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

export enum TimeoutType {
    responseTimeout,
    connectTiemeout
}

export class TimeoutError extends Error {

    private readonly _type: TimeoutType;

    constructor(type: TimeoutType,msg: string = 'Timeout exceeded') {
        super(msg);
        this._type = type;
    }

    get type(): TimeoutType {
        return this._type;
    }
}


