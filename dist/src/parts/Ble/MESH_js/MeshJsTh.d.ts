import { MeshJs } from './MeshJs';
export declare class MeshJsTh extends MeshJs {
    onNotify: ((accele: MeshJsTh['response_']) => void) | null;
    static readonly NOTIFY_TYPE: {
        readonly UPDATE_TEMPERATURE: 4;
        readonly UPDATE_HUMIDITY: 8;
        readonly ONCE: 16;
        readonly ALWAYS: 32;
    };
    private readonly MESSAGE_TYPE_ID_;
    private readonly EVENT_TYPE_ID_;
    private readonly MAX_TEMPERATURE_;
    private readonly MIN_TEMPERATURE_;
    private readonly MAX_HUMIDITY_;
    private readonly MIN_HUMIDITY_;
    private response_;
    get getResponse(): MeshJsTh['response_'];
    /**
     *
     * @param data
     * @returns
     */
    notify(data: number[]): void;
    /**
     *
     * @param temperatureRangeUpper
     * @param temperatureRangeBottom
     * @param temperatureCondition
     * @param humidityRangeUpper
     * @param humidityRangeBottom
     * @param humidityCondision
     * @param type
     * @param opt_requestId
     * @returns
     */
    parseSetmodeCommand(temperatureRangeUpper: number, temperatureRangeBottom: number, temperatureCondition: number, humidityRangeUpper: number, humidityRangeBottom: number, humidityCondision: number, type: number, opt_requestId?: number): number[];
    private num2array_;
    private complemnt_;
    private invcomplemnt_;
}
