import { Base } from './Base';
export declare class Brightness extends Base {
    /**
     * Sensing event
     */
    onSensorEvent: ((proximity: number, brightness: number, requestId: number) => void) | null;
    static readonly NotifyMode: {
        readonly STOP: 0;
        readonly UPDATE_PROXIMITY: 4;
        readonly UPDATE_BRIGHTNESS: 8;
        readonly ONCE: 16;
        readonly ALWAYS: 32;
    };
    private readonly NOTIFY_MODE_MIN_;
    private readonly NOTIFY_MODE_MAX_;
    private readonly MESSAGE_TYPE_INDEX_;
    private readonly EVENT_TYPE_INDEX_;
    private readonly MESSAGE_TYPE_ID_;
    private readonly EVENT_TYPE_ID_;
    private readonly LX_;
    /**
     * notify
     *
     * @param data
     * @returns
     */
    notify(data: number[]): void;
    /**
     * Parse to set-mode command
     *
     * @param notifyMode
     * @param opt_requestId
     * @returns command
     */
    parseSetmodeCommand(notifyMode: number, opt_requestId?: number): number[];
}
