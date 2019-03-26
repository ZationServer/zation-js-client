/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {AbstractErrorFilterBuilder} from "./abstractErrorFilterBuilder";
import {ErrorFilter}                from "../../filter/errorFilter";
import {PresetErrorLib}             from "./presetErrorLib";

export class PresetErrorFilter<T> extends PresetErrorLib<AbstractErrorFilterBuilder<T>>
{
    private readonly errorFilterBuilder : AbstractErrorFilterBuilder<T>;
    private  readonly pushPreset : boolean;

    constructor(errorFilterBuilder : AbstractErrorFilterBuilder<T>,pushPreset : boolean)
    {
        super();
        this.self = errorFilterBuilder;
        this.pushPreset = pushPreset;
    }

    protected _presetAdd(filter : ErrorFilter) : void
    {
        if(this.pushPreset) {
            this.errorFilterBuilder.addErrorFilter(filter);
        }
        else {
            this.errorFilterBuilder.setTmpFilter(filter);
        }
    }
}