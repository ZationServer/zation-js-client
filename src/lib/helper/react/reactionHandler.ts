/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import Response = require("../../api/response");

export type ReactionOnSuccessful = (result : any,response : Response) => void | Promise<void>;
export type ReactionOnError      = (filteredErrors : object[], response : Response) => void | Promise<void>;
export type ReactionCatchError   = (catchedErrors : object[], response : Response) => void | Promise<void>;

export type ReactionOnZationCh   = (data : any) => void | Promise<void>;
export type ReactionOnCustomCh   = (data : any) => void | Promise<void>;
export type ReactionOnCustomIdCh = (data : any,id : string) => void | Promise<void>;
