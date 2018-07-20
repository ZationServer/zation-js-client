/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import Response = require("../../api/response");

export type ReactionOnSuccessful = (response : Response) => void;
export type ReactionOnError      = (filteredErrors : object[], response : Response) => void;