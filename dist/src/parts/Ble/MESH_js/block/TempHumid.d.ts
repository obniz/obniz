import { Base } from './Base';
export declare class TempHumid extends Base {
    onSensorEvent: ((temperature: number, humidity: number, requestId: number) => void) | null;
    static readonly EmitCondition: {
        ABOVE_UPPER_AND_BELOW_BOTTOM: 0;
        ABOVE_UPPER_AND_ABOVE_BOTTOM: 1;
        BELOW_UPPER_AND_BELOW_BOTTOM: 16;
        BELOW_UPPER_AND_ABOVE_BOTTOM: 17;
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
     * notify
     *
     * @param data
     * @returns
     */
    notify(data: number[]): void;
    /**
     * parseSetmodeCommand
     *
     * @param temperatureRangeUpper
     * @param temperatureRangeBottom
     * @param humidityRangeUpper
     * @param humidityRangeBottom
     * @param temperatureCondition
     * @param humidityCondision
     * @param notifyMode
     * @param opt_requestId
     * @returns
     */
    parseSetmodeCommand(temperatureRangeUpper: number, temperatureRangeBottom: number, humidityRangeUpper: number, humidityRangeBottom: number, temperatureCondition: number, humidityCondision: number, notifyMode: number, opt_requestId?: number): number[];
    private num2array_;
    private checkEmitCondition_;
}
