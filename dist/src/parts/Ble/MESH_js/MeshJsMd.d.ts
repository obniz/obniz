import { MeshJs } from './MeshJs';
export declare class MeshJsMd extends MeshJs {
    readonly DetectionMode: {
        readonly DETECTED: 1;
        readonly NOTDETECTED: 2;
        readonly ONESHOT: 16;
        readonly CONTINUOUS: 32;
    };
    readonly MotionState: {
        readonly SETUP: 0;
        readonly DETECTED: 1;
        readonly NOTDETECTED: 2;
    };
    onNotify: ((response: MeshJsMd['response']) => void) | null;
    private readonly MessageTypeID;
    private readonly EventTypeID;
    private response;
    notify(data: number[]): void;
    get getResponse(): MeshJsMd['response'];
    parseSetmodeCommand(detection_mode: number, detection_time?: number, response_time?: number, request_id?: number): number[];
}
