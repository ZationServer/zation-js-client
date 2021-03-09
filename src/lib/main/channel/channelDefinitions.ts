/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

/**
 * Channel subscribe request element.
 */
export interface ChannelSubscribeRequest {
    /**
     * channel identifier
     */
    c: string;
    /**
     * member
     */
    m?: any;
    /**
     * apiLevel
     */
    a?: number;
}

/**
 * Actions that a client can send to the server.
 */
export const enum ChClientInputAction {
    Unsubscribe
}

/**
 * The package that the client can send to the server to invoke an action.
 */
export interface ChClientInputPackage {
    /**
     * Action
     */
    0: ChClientInputAction,
}

export const CH_CLIENT_OUTPUT_PUBLISH = 'C>P';

export interface ChClientOutputPublishPackage {
    /**
     * Channel id
     */
    i: string;
    /**
     * Event
     */
    e: string;
    /**
     * Data
     */
    d?: any;
}

export const CH_CLIENT_OUTPUT_KICK_OUT = 'C>K';

export interface ChClientOutputKickOutPackage {
    /**
     * Channel id
     */
    i: string;
    /**
     * code
     */
    c?: number | string;
    /**
     * data
     */
    d?: any;
}

export const CH_CLIENT_OUTPUT_CLOSE = 'C>C';

export interface ChClientOutputClosePackage {
    /**
     * Channel id
     */
    i: string;
    /**
     * code
     */
    c?: number | string;
    /**
     * data
     */
    d?: any;
}

export const CHANNEL_START_INDICATOR = 'C>';
export const CHANNEL_MEMBER_SPLIT = '.';