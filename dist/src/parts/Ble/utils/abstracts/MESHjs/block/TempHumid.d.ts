import { Base } from './Base';
export declare class TempHumid extends Base {
    /**
     * Sensing event
     */
    onSensorEvent: ((temperature: number, humidity: number, requestId: number) => void) | null;
    static readonly EmitCondition: {
        ABOVE_UPPER_OR_BELOW_LOWER: 0;
        ABOVE_UPPER_OR_ABOVE_LOWER: 1;
        BELOW_UPPER_OR_BELOW_LOWER: 16;
        BELOW_UPPER_OR_ABOVE_LOWER: 17;
    };
    static readonly NotifyMode: {
        readonly STOP: 0;
        readonly EMIT_TEMPERATURE: 1;
        readonly EMIT_HUMIDITY: 2;
        readonly UPDATE_TEMPERATURE: 4;
        readonly UPDATE_HUMIDITY: 8;
        readonly ONCE: 16;
        readonly ALWAYS: 32;
    };
    private readonly MESSAGE_TYPE_ID_;
    private readonly EVENT_TYPE_ID_;
    private readonly TEMPERATURE_MAX_;
    private readonly TEMPERATURE_MIN_;
    private readonly HUMIDITY_MAX_;
    private readonly HUMIDITY_MIN_;
    private readonly NOTIFY_MODE_MIN_;
    private readonly NOTIFY_MODE_MAX_;
    /**
     * Verify that the device is MESH block
     *
     * @param name
     * @param opt_serialnumber
     * @returns
     */
    static isMESHblock(name: string | null, opt_serialnumber?: string): boolean;
    /**
     * Parse data that received from MESH block, and emit event
     *
     * @param data
     * @returns void
     */
    notify(data: number[]): void;
    /**
     * Create command of set-mode
     *
     * @param temperatureRangeUpper
     * @param temperatureRangeLower
     * @param humidityRangeUpper
     * @param humidityRangeLower
     * @param temperatureCondition
     * @param humidityCondition
     * @param notifyMode
     * @param opt_requestId
     * @returns
     */
    createSetmodeCommand(temperatureRangeUpper: number, temperatureRangeLower: number, humidityRangeUpper: number, humidityRangeLower: number, temperatureCondition: number, humidityCondition: number, notifyMode: number, opt_requestId?: number): number[];
    private num2array_;
    private checkEmitCondition_;
}
