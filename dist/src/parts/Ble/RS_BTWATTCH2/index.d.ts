/**
 * @packageDocumentation
 * @module Parts.RS_BTWATTCH2
 */
import Obniz from "../../../obniz";
import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface RS_BTWATTCH2Options {
    /** by default, this parts will set date at connectWait() */
    rtcAutoset: boolean;
}
export interface RS_BTWATTCH2RealtimeData {
    /** Voltage (unit v) 計測された電圧(v) */
    vrms: number;
    /** Amp (unit A) 消費電流(A) */
    irms: number;
    /** Watt (unit W) 消費電力(W) */
    wa: number;
    /** Current Power State (Relay State) */
    powerState: boolean;
    /** Reported time from device */
    date: Date;
}
export default class RS_BTWATTCH2 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    /**
     * Check found peripheral is part of this parts
     * @param peripheral
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean | "" | null;
    keys: string[];
    requiredKeys: string[];
    params: any;
    _peripheral: BleRemotePeripheral;
    ondisconnect?: (reason: any) => void;
    private _txToTargetCharacteristic;
    private _rxFromTargetCharacteristic;
    private _totalSize;
    private _received;
    private _waitings;
    /**
     * Constructor. Provide option at this time
     * @param peripheral
     * @param options
     */
    constructor(peripheral: BleRemotePeripheral, options?: RS_BTWATTCH2Options);
    wired(obniz: Obniz): void;
    /**
     * Check if device is under paring mode(over 3 seconds button pressing)
     */
    isPairingMode(): boolean;
    /**
     * get pairing key
     */
    firstPairingWait(): Promise<string>;
    /**
     * Connect to the target device regarding pairing key
     */
    connectWait(keys: string): Promise<void>;
    /**
     * Disconnect from the device
     */
    disconnectWait(): Promise<void>;
    /**
     * Seting Time on device clock
     * @param date
     */
    setRTC(date?: Date): Promise<void>;
    /**
     * Set Relay ON/OFF
     * @param isOn
     */
    setPowerStateWait(isOn: boolean): Promise<void>;
    /**
     * Getting Current Relay State;
     */
    getPowerStateWait(): Promise<boolean>;
    /**
     * Getting All of realtime data
     */
    getRealTimeDataWait(): Promise<RS_BTWATTCH2RealtimeData>;
    private _pushData;
    private _onRecieved;
    private _transaction;
    private _createData;
    private _GetCRC8;
}
