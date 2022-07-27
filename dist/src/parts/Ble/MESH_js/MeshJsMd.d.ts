import { MeshJs } from './MeshJs';
export declare class MeshJsMd extends MeshJs {
    onNotify: ((response: MeshJsMd['response_']) => void) | null;
    readonly DETECTION_MODE: {
        readonly DETECTED: 1;
        readonly NOT_DETECTED: 2;
        readonly ONESHOT: 16;
        readonly CONTINUOUS: 32;
    };
    readonly MOTION_STATE: {
        readonly SETUP: 0;
        readonly DETECTED: 1;
        readonly NOT_DETECTED: 2;
    };
    private readonly MESSAGE_TYPE_ID_;
    private readonly EVENT_TYPE_ID_;
    private response_;
    get getResponse(): MeshJsMd['response_'];
    /**
     * notify
     *
     * @param data
     * @returns
     */
    notify(data: number[]): void;
    /**
     *
     * @param detectionMode
     * @param opt_detectionTime
     * @param opt_responseTime
     * @param opt_requestId
     * @returns
     */
    parseSetmodeCommand(detectionMode: number, opt_detectionTime?: number, opt_responseTime?: number, opt_requestId?: number): number[];
}
