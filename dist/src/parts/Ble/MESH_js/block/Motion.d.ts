import { Base } from './Base';
export declare class Motion extends Base {
    onSensorEvent: ((motionState: number, notifyMode: number, requestId: number) => void) | null;
    static readonly NotifyMode: {
        readonly DETECTED: 1;
        readonly NOT_DETECTED: 2;
        readonly ONCE: 16;
        readonly ALWAYS: 32;
    };
    readonly MotionState: {
        readonly SETUP: 0;
        readonly DETECTED: 1;
        readonly NOT_DETECTED: 2;
    };
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
     *
     * @param notifyMode
     * @param opt_detectionTime
     * @param opt_responseTime
     * @param opt_requestId
     * @returns
     */
    parseSetmodeCommand(notifyMode: number, opt_detectionTime?: number, opt_responseTime?: number, opt_requestId?: number): number[];
}
