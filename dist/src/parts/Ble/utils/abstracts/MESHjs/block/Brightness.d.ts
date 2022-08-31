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
    private readonly MESSAGE_TYPE_ID_;
    private readonly EVENT_TYPE_ID_;
    private readonly LX_;
    /**
     * Verify that the device is MESH block
     *
     * @param name
     * @param opt_serialnumber
     * @returns
     */
    static isMESHblock(name: string | null, opt_serialnumber?: string): boolean;
    /**
     * notify
     *
     * @param data
     * @returns void
     */
    notify(data: number[]): void;
    /**
     * Create command of set-mode
     *
     * @param notifyMode
     * @param opt_requestId
     * @returns command
     */
    createSetmodeCommand(notifyMode: number, opt_requestId?: number): number[];
}
