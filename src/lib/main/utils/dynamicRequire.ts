/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

/**
 * Requires a module dynamic to avoid ESLint warnings.
 * @param mod
 * @param module
 */
export function dynamicRequire(mod: any, module: string): any {
    // tslint:disable-next-line: no-unsafe-any
    return mod.require(module);
}