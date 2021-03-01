/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

export type JsonPrimitive = string | number | boolean | null;
export type Json = JsonPrimitive | JsonObject | JsonArray | undefined;
export type JsonObject = { [member: string]: Json };
export interface JsonArray extends Array<Json> {}

export type ImmutableJson = JsonPrimitive | ImmutableJsonObject | ImmutableJsonArray | undefined;
export type ImmutableJsonObject = { readonly [member: string]: ImmutableJson };
export interface ImmutableJsonArray extends ReadonlyArray<ImmutableJson> {}

export type Writable<T> = { -readonly [P in keyof T]: T[P] };

export type Primitive = undefined | null | boolean | string | number | Function

export type DeepReadonly<T> =
    T extends Primitive ? T :
        T extends Array<infer U> ? DeepReadonlyArray<U> :
            T extends Map<infer K, infer V> ? DeepReadonlyMap<K, V> : DeepReadonlyObject<T>
interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}
interface DeepReadonlyMap<K, V> extends ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>> {}
type DeepReadonlyObject<T> = {
    readonly [K in keyof T]: DeepReadonly<T[K]>
}

export type Default<T,D> = T extends undefined ? D : T;