/**
 * @packageDocumentation
 * @module Parts.TT_MSK1508
 */
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInterface, ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface TT_MSK1508Options {
}
export interface TT_MSK1508Data {
    patientId: number;
    operatingMode: typeof TT_MSK1508['OperatingMode'][keyof typeof TT_MSK1508['OperatingMode']];
    flowRateStatus: typeof TT_MSK1508['FlowRateStatus'][keyof typeof TT_MSK1508['FlowRateStatus']];
    batteryStatus: typeof TT_MSK1508['FlowRateStatus'][keyof typeof TT_MSK1508['FlowRateStatus']];
    model: typeof TT_MSK1508['Model'][keyof typeof TT_MSK1508['Model']];
    totalDoseVolume: number;
    totalDoseTime: number;
    infusionType: typeof TT_MSK1508['InfusionType'][keyof typeof TT_MSK1508['InfusionType']];
    sensorId: number;
    errors: typeof TT_MSK1508['Error'][keyof typeof TT_MSK1508['Error']][];
    battery: number;
}
/** TT-MSK1508 management class TT-MSK1508を管理するクラス */
export default class TT_MSK1508 implements ObnizPartsBleInterface {
    static OperatingMode: {
        0: string;
        2: string;
    };
    static FlowRateStatus: {
        0: string;
        1: string;
        2: string;
        3: string;
    };
    static BatteryStatus: {
        0: string;
        1: string;
    };
    static Model: {
        0: string;
        1: string;
    };
    static InfusionType: {
        0: string;
    };
    static Error: {
        0: string;
        1: string;
    };
    static info(): ObnizPartsBleInfo;
    /**
     * Verify that the received peripheral is from the TT-MSK1508
     *
     * 受け取ったPeripheralがTT-MSK1508のものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the TT-MSK1508
     *
     * TT-MSK1508かどうか
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Get a data from the TT-MSK1508
     *
     * TT-MSK1508からデータを取得
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns received data from the TT-MSK1508 TT-MSK1508から受け取ったデータ
     */
    static getData(peripheral: BleRemotePeripheral): TT_MSK1508Data | null;
    private static _deviceAdvAnalyzer;
    _peripheral: BleRemotePeripheral | null;
}
