/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import Response = require("../../../api/response");
import {TaskError} from "../taskError/taskError";

export type ReactionOnSuccessful = (result : any,response : Response) => void | Promise<void>;
export type ReactionOnResponse   = (response : Response) => void | Promise<void>;
export type ReactionOnError      = (filteredErrors : TaskError[], response : Response) => void | Promise<void>;
export type ReactionCatchError   = (catchedErrors : TaskError[], response : Response) => void | Promise<void>;

export type ReactionOnPubZationCh   = (data : any, eventName : string,socketSrcSid : undefined | string) => void | Promise<void>;
export type ReactionOnPubCustomCh   = (data : any, eventName : string,chName : string, socketSrcSid : undefined | string) => void | Promise<void>;
export type ReactionOnPubCustomIdCh = (data : any, eventName : string,chName : string, chId : string, socketSrcSid : undefined | string) => void | Promise<void>;
