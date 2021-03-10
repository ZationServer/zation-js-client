/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

// noinspection ES6PreferShortImport
import {Client}                                 from "../../core/client";
import ConnectionUtils, {ConnectTimeoutOption}  from "../utils/connectionUtils";
import {RawPackage, RECEIVER_EVENT}             from "./receiverDefinitions";

export async function receiverPackageSend(
    client: Client,
    pack: RawPackage,
    connectTimeout: ConnectTimeoutOption = undefined): Promise<void>
{
    await ConnectionUtils.checkConnection(client,connectTimeout);
    client.socket.emit(RECEIVER_EVENT,pack);
}