/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {AbstractBackErrorFilterBuilder} from "./abstractBackErrorFilterBuilder";
import {BackErrorFilter}                from "./backErrorFilter";
import {PresetBackErrorLib}             from "./presetBackErrorLib";

export class PresetBackErrorFilterSelector<T extends AbstractBackErrorFilterBuilder<T>> extends PresetBackErrorLib<T>
{
    private readonly errorFilterBuilder: T;

    constructor(errorFilterBuilder: T,
                private readonly onPresetSelect: (filter: BackErrorFilter) => void) {
        super();
        this.errorFilterBuilder = errorFilterBuilder;
    }

    protected applyPreset(filter: BackErrorFilter): void {
        this.onPresetSelect(filter);
    }

    protected self(): T {
        return this.errorFilterBuilder;
    }
}