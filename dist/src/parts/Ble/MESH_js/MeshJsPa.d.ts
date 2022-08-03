import { MeshJs } from './MeshJs';
export declare class MeshJsPa extends MeshJs {
    onSensorEvent: ((proximity: number, brightness: number, requestId: number) => void) | null;
    static readonly EmitCondition: {
        ABOVE_UPPER_AND_BELOW_BOTTOM: 0;
        ABOVE_UPPER_AND_ABOVE_BOTTOM: 1;
        BELOW_UPPER_AND_BELOW_BOTTOM: 16;
        BELOW_UPPER_AND_ABOVE_BOTTOM: 17;
    };
    static readonly NotifyMode: {
        readonly STOP: 0;
        readonly EMIT_PROXIMITY: 1;
        readonly EMIT_BRIGHTNESS: 2;
        readonly UPDATE_PROXIMITY: 4;
        readonly UPDATE_BRIGHTNESS: 8;
        readonly ONCE: 16;
        readonly ALWAYS: 32;
    };
    private readonly RANGE_MIN;
    private readonly RANGE_MAX;
    private readonly NOTIFY_MODE_MIN_;
    private readonly NOTIFY_MODE_MAX_;
    private readonly MESSAGE_TYPE_ID_;
    private readonly EVENT_TYPE_ID_;
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
     * @param notifyMode
     * @param opt_requestId
     * @returns command
     */
    parseSetmodeCommand(proximityRangeUpper: number, proximityRangeBottom: number, brightnessRangeUpper: number, brightnessRangeBottom: number, proximityCondition: number, brightnessCondition: number, notifyMode: number, opt_requestId?: number): number[];
    private checkRange_;
    private checkEmitCondition_;
    private checkNotifyMode_;
    private num2array_;
}
