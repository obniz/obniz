/**
 * @packageDocumentation
 * @module Parts.STM550B
 */
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizBleBeaconStruct, ObnizPartsBle, ObnizPartsBleMode } from '../../../obniz/ObnizPartsBleAbstract';
export interface STM550B_Options {
}
/**
 * advertisement data from STM550B
 *
 * STM550Bからのadvertisementデータ
 */
export interface STM550B_Data {
    /** temperature 温度 (Unit 単位: 0.01 degC)*/
    temperature?: number;
    /** battery 電源電圧 (Unit 単位: 0.5 mV) */
    voltage?: number;
    /** energy_level 電源レベル  (Unit 単位: 1 %) */
    energy_level?: number;
    /**
     * illumination_solar_cell ソーラーセルの明るさ (Unit 単位: 1 lux )
     */
    illumination_solar_cell?: number;
    /**
     * illumination_sensor センサの明るさ  (Unit 単位: 1 lux )
     */
    illumination_sensor?: number;
    /**
     * humidity 相対湿度  (Unit 単位: 0.5 % )
     */
    humidity?: number;
    /** 加速度 x,y,z (単位: g, -5.12g 〜 5.12g) */
    acceleration_vector?: {
        x: number;
        y: number;
        z: number;
    };
    /** magnet nearby or not 近くに磁石があるかどうか */
    magnet_contact?: boolean;
}
export default class STM550B extends ObnizPartsBle<STM550B_Data> {
    static readonly PartsName = "STM550B";
    static AvailableBleMode: "Beacon";
    static readonly BeaconDataStruct: ObnizBleBeaconStruct<STM550B_Data>;
    static readonly CompanyID: {
        Beacon: number[];
    };
    protected readonly staticClass: typeof STM550B;
    constructor(peripheral: BleRemotePeripheral, mode: ObnizPartsBleMode);
}
