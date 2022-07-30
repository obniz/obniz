import { MeshJs } from './MeshJs';
export declare class MeshJsPa extends MeshJs {
    onSensorEvent: ((proximity: number, brightness: number, requestId: number) => void) | null;
    static readonly NotifyMode: {
        readonly STOP: 0;
        readonly UPDATE_PROXIMITY: 4;
        readonly UPDATE_BRIGHTNESS: 8;
        readonly ONCE: 16;
        readonly ALWAYS: 32;
    };
    private readonly MESSAGE_TYPE_ID_;
    private readonly EVENT_TYPE_ID_;
    /**
     *
     * @param data
     * @returns
     */
    notify(data: number[]): void;
    /**
     *
     * @param notifyType
     * @param opt_requestId
     * @returns command
     */
    parseSetmodeCommand(notifyMode: number, opt_requestId?: number): number[];
    private checkNotifyMode_;
}
