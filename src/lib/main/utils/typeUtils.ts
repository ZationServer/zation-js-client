/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

export type JsonPrimitive = string | number | boolean | null;
export type ImmutableJson = JsonPrimitive | ImmutableJsonObject | ImmutableJsonArray | undefined;
export type ImmutableJsonObject = { readonly [member: string]: ImmutableJson };
export interface ImmutableJsonArray extends ReadonlyArray<ImmutableJson> {}

export type Writeable<T> = { -readonly [P in keyof T]: T[P] };