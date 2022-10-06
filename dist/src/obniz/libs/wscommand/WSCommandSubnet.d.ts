/// <reference types="node" />
/// <reference types="node" />
/**
 * @packageDocumentation
 * @ignore
 */
import { WSCommand } from './WSCommand';
export declare class WSCommandSubnet extends WSCommand.CommandClasses.WSCommandSystem {
    module: number;
    _CommandRequestAllSubnet: number;
    _CommandSendAddr: number;
    _CommandSend: number;
    _CommandFromAddr: number;
    _CommandRecv: number;
    _CommandRequestJoin: number;
    currentFromAddr: null | string;
    delegate?: {
        onSubnetTableReceived: (subnetNodes: string[]) => void;
        onDataReceivedFromSubnet: (fromAddr: string, payload: Uint8Array) => void;
    };
    requestAllSubnet(): void;
    sendToNode(targetMacAddr: string, data: Uint8Array): void;
    sendToNodeBufAddr(bufAddr: Buffer, data: Uint8Array): void;
    parseFromJson(): void;
    notifyFromBinary(objToSend: {
        [x: string]: any;
    }, func: number, payload: Uint8Array): void;
    /**
     * 参加要求フレームを送るように指示
     *
     */
    sendRequestConnectToNode(targetMacAddr: string): void;
    /**
     * Onlineになったことを通知。authorizeとは関係なく、http request を読みその返り値として返す
     *
     */
    sendOnline(targetMacAddr: string): void;
    sendRebootToNode(targetMacAddr: string): void;
    parsedRequestString(reqHeader: string): {
        obniz_id: null | string;
        headers: {
            [key: string]: string;
        };
    };
    isWSRoomOnlyCommand(): boolean;
}
