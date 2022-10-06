/**
 * @packageDocumentation
 * @module Parts.MESH_100TH
 */
import { MESH } from '../utils/abstracts/MESH';
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
export interface MESH_100THOptions {
}
/**
 * advertisement data from MESH_100TH
 */
export interface MESH_100TH_Data {
    name: string;
    address: string;
}
/** MESH_100TH management class */
export default class MESH_100TH extends MESH<MESH_100TH_Data> {
    static readonly PartsName = "MESH_100TH";
    static readonly LocalName: RegExp;
    static readonly NotifyMode: {
        readonly STOP: 0;
        readonly EMIT_TEMPERATURE: 1;
        readonly EMIT_HUMIDITY: 2;
        readonly UPDATE_TEMPERATURE: 4;
        readonly UPDATE_HUMIDITY: 8;
        readonly ONCE: 16;
        readonly ALWAYS: 32;
    };
    static readonly EmitCondition: {
        ABOVE_UPPER_OR_BELOW_LOWER: 0;
        ABOVE_UPPER_OR_ABOVE_LOWER: 1;
        BELOW_UPPER_OR_BELOW_LOWER: 16;
        BELOW_UPPER_OR_ABOVE_LOWER: 17;
    };
    onSensorEvent: ((temperature: number, humidity: number) => void) | null;
    protected readonly staticClass: typeof MESH_100TH;
    private retTemperature_;
    private retHumidity_;
    private temperatureUpper_;
    private temperatureLower_;
    private humidityUpper_;
    private humidityLower_;
    private temperatureCondition_;
    private humidityCondition_;
    private notifyMode_;
    /**
     * Check MESH block
     *
     * @param peripheral
     * @param opt_serialnumber
     * @returns
     */
    static isMESHblock(peripheral: BleRemotePeripheral, opt_serialnumber?: string): boolean;
    getDataWait(): Promise<{
        temperature: number;
        humidity: number;
        name: string;
        address: string;
    }>;
    /**
     * getSensorDataWait
     *
     * @returns
     */
    getSensorDataWait(opt_timeoutMsec?: 5000): Promise<{
        temperature: number;
        humidity: number;
    }>;
    /**
     * setMode
     *
     * @param temperatureUpper
     * @param temperatureLower
     * @param humidityUpper
     * @param humidityLower
     * @param temperatureCondition
     * @param humidityCondition
     * @param notifyMode
     */
    setMode(temperatureUpper: number, temperatureLower: number, humidityUpper: number, humidityLower: number, temperatureCondition: number, humidityCondition: number, notifyMode: number): void;
    protected prepareConnect(): void;
    protected beforeOnDisconnectWait(reason: unknown): Promise<void>;
    private setMode_;
    private setHandler_;
}
