/**
 * @packageDocumentation
 * @module Parts.cir415a
 */
import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from "../../../obniz/ObnizPartsBleInterface";
export interface cir415aOptions {
}
export default class cir415a implements ObnizPartsBleInterface {
    static info(): ObnizPartsBleInfo;
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    onNotify: ((data: number[]) => void) | null;
    onAuthenticated: (() => void) | null;
    onCardTouch: ((state: boolean) => void) | null;
    _peripheral: BleRemotePeripheral | null;
    ondisconnect?: (reason: any) => void;
    private _authenticated;
    private masterKey;
    private sessionKey;
    private randomDeviceNumber;
    private randomNumber;
    private _uuids;
    private readData;
    private readChar;
    constructor(peripheral: BleRemotePeripheral | null);
    connectWait(): Promise<void>;
    disconnectWait(): Promise<void>;
    write(data: number[]): Promise<void>;
    setMasterKey(key: number[]): void;
    setAutoPollingWait(enable: boolean): Promise<void>;
    writeADPU(data: number[]): Promise<void>;
    private readPacket;
    private encrypt;
    private decrypt;
    private parseBlePacket;
    private writeBle;
    private arrayMatch;
}
