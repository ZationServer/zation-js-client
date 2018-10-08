/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import Response = require("../../../api/response");
import {TaskError} from "../taskError/taskError";

export type ReactionOnSuccessful = (result : any,response : Response) => void | Promise<void>;
export type ReactionOnError      = (filteredErrors : TaskError[], response : Response) => void | Promise<void>;
export type ReactionCatchError   = (catchedErrors : TaskError[], response : Response) => void | Promise<void>;

export type ReactionOnZationCh   = (data : any,socketSrcId : undefined | string) => void | Promise<void>;
export type ReactionOnCustomCh   = (data : any,chName : string,socketSrcId : undefined | string) => void | Promise<void>;
export type ReactionOnCustomIdCh = (data : any,chName : string,chId : string,socketSrcId : undefined | string) => void | Promise<void>;
