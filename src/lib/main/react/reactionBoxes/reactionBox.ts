/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {Zation} from "../../../core/zation";
import {SBox} from "../../box/sBox";
import {DidProcess, WillProcess} from "../reaction/reactionHandler";

export class ReactionBox<S>
{
    protected self : S;

    protected active : boolean;
    private zation : Zation | undefined;

    protected lastReactionTmp : any;

    private sBoxWillProcess : SBox<WillProcess> = new SBox();
    private sBoxDidProcess : SBox<DidProcess> = new SBox();

    constructor() {
        this.active = true;
        this.zation = undefined;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * This method is used internal!
     */
    _link(zation : Zation) {
        this.zation = zation;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * This method is used internal!
     */
    _unlink() {
        this.zation = undefined;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the linked client.
     * Notice that it can be undefined if no client is linked.
     */
    getLinkedClient() : Zation | undefined {
        return this.zation;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on reactionBox will processing the reactions.
     * @example
     * onWillProcess(() => {});
     * @param reaction
     * @return
     * It returns the specific ReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onWillProcess(reaction : WillProcess) : S {
        this.sBoxWillProcess.addItem(reaction);
        this.lastReactionTmp = reaction;
        return this.self;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on will process reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offWillProcess(reaction ?: WillProcess) : void {
        this.sBoxWillProcess.remove(reaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * React on reactionBox did processing the reactions.
     * @example
     * onDidProcess(() => {});
     * @param reaction
     * @return
     * It returns the specific ReactionBox, to remove the reaction from the box
     * you can use the getLastReaction method which is return the reaction.
     */
    onDidProcess(reaction : DidProcess) : S {
        this.sBoxDidProcess.addItem(reaction);
        this.lastReactionTmp = reaction;
        return this.self;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Remove on did process reaction.
     * @param reaction
     * If it is not given away all will be removed.
     */
    offDidProcess(reaction ?: DidProcess) : void {
        this.sBoxDidProcess.remove(reaction);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Activate the reaction box.
     */
    activate() : void
    {
        this.active = true;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Deactivate the reaction box.
     */
    deactivate() : void
    {
        this.active = false;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Returns the last added Reaction, you can use it to remove the reaction from the box
     * by calling the specific off method.
     * @return
     * It returns the last added Reaction.
     */
    getLastReaction() : any {
        return this.lastReactionTmp;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * This method is used internal!
     */
    protected async  _triggerWillProcess()
    {
        await this.sBoxWillProcess.forEachAll(async (reaction) => {await reaction();});
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * This method is used internal!
     */
    protected async  _triggerDidProcess()
    {
        await this.sBoxDidProcess.forEachAll(async (reaction) => {await reaction();});
    }
}


