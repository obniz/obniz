import { Base } from './Base';
export declare class Motion extends Base {
    /**
     * Sensing event
     */
    onSensorEvent: ((motionState: number, notifyMode: number, requestId: number) => void) | null;
    static readonly NotifyMode: {
        readonly DETECTED: 1;
        readonly NOT_DETECTED: 2;
        readonly ONCE: 16;
        readonly ALWAYS: 32;
    };
    static readonly MotionState: {
        readonly SETUP: 0;
        readonly DETECTED: 1;
        readonly NOT_DETECTED: 2;
    };
    private readonly MESSAGE_TYPE_ID_;
    private readonly EVENT_TYPE_ID_;
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
     * @param notifyMode
     * @param opt_holdingTime
     * @param opt_detectionTime
     * @param opt_requestId
     * @returns command
     */
    createSetmodeCommand(notifyMode: number, opt_holdingTime?: number, opt_detectionTime?: number, opt_requestId?: number): number[];
}
