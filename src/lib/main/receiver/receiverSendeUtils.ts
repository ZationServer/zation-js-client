/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

// noinspection ES6PreferShortImport
import {Zation}                                 from "../../core/zation";
import ConnectionUtils, {ConnectTimeoutOption}  from "../utils/connectionUtils";
import {RawPackage, RECEIVER_EVENT}             from "./receiverDefinitions";

export async function receiverPackageSend(
    zation: Zation,
    pack: RawPackage,
    connectTimeout: ConnectTimeoutOption = undefined): Promise<void>
{
    await ConnectionUtils.checkConnection(zation,connectTimeout);
    zation.socket.emit(RECEIVER_EVENT,pack);
}