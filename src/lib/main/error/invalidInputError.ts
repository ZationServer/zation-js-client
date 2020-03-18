/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {BackError}         from "../../main/response/backError";
import {ErrorFilterEngine} from "../../main/react/respReactEngines/errorFilterEngine";
import {ErrorFilter}       from "../../main/react/error/errorFilter";

export class InvalidInputError extends Error
{
    private readonly rawError: Error;

    constructor(message: string,rawError: Error)
    {
        super(message);
        this.rawError = rawError;
    }

    // noinspection JSUnusedGlobalSymbols
    getRawError(): Error {
        return this.rawError;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns the backErrors of the invalid input error.
     */
    getBackErrors(): BackError[] {
        const errors = (this.rawError as any).backErrors;
        return Array.isArray(errors) ? errors: [];
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns the raw error code.
     */
    get code(): any {
        return this.rawError['code'];
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * Returns the error name.
     */
    get name(): string {
        return this.rawError.name;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Filter the BackErrors.
     * @example
     * -FilterExamples-
     * For errors with the name:
     * {name: 'errorName1'}
     * For errors with the names:
     * {name: ['errorName1','errorName2']}
     * For errors with the group:
     * {group: 'errorGroup1'}
     * For errors with the groups:
     * {group: ['errorGroup1','errorGroup2']}
     * For errors with the type:
     * {type: 'errorType1'}
     * For errors with the types:
     * {type: ['errorType1','errorType2']}
     * For errors with has all keys and values in the info:
     * {info: {path: 'name', value: 'value'}}
     * For errors with has at least one of all keys and values in the info:
     * {info: [{path: 'name'},{path: 'firstName'}]}
     * For errors with the info key:
     * {infoKey: 'path'}
     * For errors with at least one of the info keys:
     * {infoKey: ['path','value']}
     * For errors with all of the info keys:
     * {infoKey: [['path','value']]}
     * For errors with the info value:
     * {infoValue: 'name'}
     * For errors with at least one of the info values:
     * {infoValue: ['name','firstName']}
     * For errors with all of the info values:
     * {infoValue: [['value1','value2']]}
     * For errors there from the zation system:
     * {fromZationSystem: true}
     * For errors there not from the zation system:
     * {fromZationSystem: false}
     * You can combine all of this properties.
     * @param filter
     * The purpose of this param is to filter the BackErrors errors.
     * Look in the examples how you can use it.
     * You also can add more than one filter.
     * The filter are linked with OR so the filtered errors
     * of each filter are countend together.
     */
    filterBackErrors(filter: ErrorFilter[]): BackError[] {
        return ErrorFilterEngine.filterErrors(this.getBackErrors(),filter);
    }
}


