/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {Response}  from "./response";
// noinspection ES6PreferShortImport
import {BackError} from "../../backError/backError";

export type ResponseReactionOnSuccessful = (result: any, response: Response) => void | Promise<void>;
export type ResponseReactionOnResponse   = (response: Response) => void | Promise<void>;
export type ResponseReactionOnError      = (errors: BackError[], response: Response) => void | Promise<void>;
export type ResponseReactionCatchError   = (caughtErrors: BackError[], response: Response) => void | Promise<void>;

