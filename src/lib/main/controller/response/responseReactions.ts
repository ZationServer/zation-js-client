/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {Response}  from "./response";
// noinspection ES6PreferShortImport
import {BackError} from "../../backError/backError";

export type ResponseReactionOnSuccessful<T> = (result: T, response: Response<T>) => void | Promise<void>;
export type ResponseReactionOnResponse<T> = (response: Response<T>) => void | Promise<void>;
export type ResponseReactionOnError<T> = (errors: BackError[], response: Response<T>) => void | Promise<void>;
export type ResponseReactionCatchError<T> = (caughtErrors: BackError[], response: Response<T>) => void | Promise<void>;

