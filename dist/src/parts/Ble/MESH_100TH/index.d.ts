/**
 * @packageDocumentation
 * @module Parts.MESH_100TH
 */
import { MESH } from '../utils/abstracts/MESH';
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
    static readonly PREFIX = "MESH-100TH";
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
        ABOVE_UPPER_AND_BELOW_BOTTOM: 0;
        ABOVE_UPPER_AND_ABOVE_BOTTOM: 1;
        BELOW_UPPER_AND_BELOW_BOTTOM: 16;
        BELOW_UPPER_AND_ABOVE_BOTTOM: 17;
    };
    onSensorEvent: ((temperature: number, humidity: number) => void) | null;
    protected readonly staticClass: typeof MESH_100TH;
    private retTemperature_;
    private retHumidity_;
    private temperatureUpper_;
    private temperatureBottom_;
    private humidityUpper_;
    private humidityBottom_;
    private temperatureCondition_;
    private humidityCondision_;
    private notifyMode_;
    getDataWait(): Promise<{
        name: string;
        address: string;
    }>;
    /**
     * getSensorDataWait
     *
     * @returns
     */
    getSensorDataWait(): Promise<{
        temperature: number;
        humidity: number;
    }>;
    /**
     * setMode
     *
     * @param temperatureUpper
     * @param temperatureBottom
     * @param humidityUpper
     * @param humidityBottom
     * @param temperatureCondition
     * @param humidityCondision
     * @param notifyMode
     */
    setMode(temperatureUpper: number, temperatureBottom: number, humidityUpper: number, humidityBottom: number, temperatureCondition: number, humidityCondision: number, notifyMode: number): void;
    protected static _isMESHblock(name: string): boolean;
    protected prepareConnect(): void;
    protected beforeOnDisconnectWait(reason: unknown): Promise<void>;
    private setMode_;
    private setHandler_;
}
