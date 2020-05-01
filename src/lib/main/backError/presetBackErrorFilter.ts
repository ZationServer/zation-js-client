/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {AbstractBackErrorFilterBuilder} from "./abstractBackErrorFilterBuilder";
import {BackErrorFilter}                from "./backErrorFilter";
import {PresetBackErrorLib}             from "./presetBackErrorLib";

export class PresetBackErrorFilter<T extends AbstractBackErrorFilterBuilder<T>> extends PresetBackErrorLib<T>
{
    private readonly errorFilterBuilder: T;
    private readonly pushPreset: boolean;

    constructor(errorFilterBuilder: T,pushPreset: boolean)
    {
        super();
        this.pushPreset = pushPreset;
        this.errorFilterBuilder = errorFilterBuilder;
    }

    protected _presetAdd(filter: BackErrorFilter): void
    {
        if(this.pushPreset) {
            this.errorFilterBuilder.addErrorFilter(filter);
        }
        else {
            this.errorFilterBuilder.setTmpFilter(filter);
        }
    }

    protected self(): T {
        return this.errorFilterBuilder;
    }
}