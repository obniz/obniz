/**
 * @packageDocumentation
 * @module Parts.PLAYBULB_candle
 */
import { BleConnectSetting, BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInterface, ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
import { BleAdvBinaryAnalyzer } from '../utils/advertisement/advertismentAnalyzer';
import { BleBatteryService } from '../utils/services/batteryService';
export interface PLAYBULB_candleOptions {
}
export declare const PLAYBULB_candle_MODE: {
    readonly Fade: 1;
    readonly JumpRGB: 2;
    readonly FadeRGB: 3;
    readonly CandleEffect: 4;
    readonly NoEffect: 5;
};
export declare type PLAYBULB_candle_MODE_TYPE = typeof PLAYBULB_candle_MODE[keyof typeof PLAYBULB_candle_MODE];
export declare const PLAYBULB_candle_SPEED: {
    readonly ReallySlow: 0;
    readonly ReallyFast: 1;
    readonly Slower: 2;
    readonly Faster: 255;
};
export declare type PLAYBULB_candle_SPEED_TYPE = typeof PLAYBULB_candle_SPEED[keyof typeof PLAYBULB_candle_SPEED];
/** PLAYBULB_candle management class PLAYBULB_candleを管理するクラス */
export default class PLAYBULB_candle implements ObnizPartsBleInterface {
    _peripheral: BleRemotePeripheral;
    static info(): ObnizPartsBleInfo;
    /**
     * Verify that the received peripheral is from the PLAYBULB_candle
     *
     * 受け取ったPeripheralがPLAYBULB_candleのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the PLAYBULB_candle
     *
     * PLAYBULB_candleかどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    ondisconnect?: (reason: any) => void;
    constructor(_peripheral: BleRemotePeripheral);
    private _candleDeviceNameCharacteristics;
    private _candleColorCharacteristics;
    private _candleEffectCharacteristics;
    batteryService?: BleBatteryService;
    static CANDLE_SERVICE_UUID: string;
    static CANDLE_DEVICE_NAME_UUID: string;
    static CANDLE_COLOR_UUID: string;
    static CANDLE_EFFECT_UUID: string;
    connectWait(setting?: Pick<BleConnectSetting, 'retry' | 'forceConnect'>): Promise<void>;
    getBatteryLevelWait(): Promise<number | null>;
    getDeviceNameWait(): Promise<string | null>;
    setCandleEffectColorWait(red: number, green: number, blue: number): Promise<boolean>;
    setFlashingColorWait(red: number, green: number, blue: number): Promise<boolean>;
    setEffectWait(color: {
        white: number;
        red: number;
        green: number;
        blue: number;
    }, mode: PLAYBULB_candle_MODE_TYPE, speed: PLAYBULB_candle_SPEED_TYPE): Promise<boolean>;
    setColorWait(r: number, g: number, b: number): Promise<boolean>;
    static _deviceAdvAnalyzerType: BleAdvBinaryAnalyzer<"" | "length" | "type" | "flag" | "candle_service_uuid", "" | "manufacture">;
}
