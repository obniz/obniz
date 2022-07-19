import { MESH_js } from '.';
export declare class MESH_js_MD extends MESH_js {
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
    onNotify: ((response: MESH_js_MD['response']) => void) | null;
    private readonly MessageTypeID;
    private readonly EventTypeID;
    private response;
    notify(data: number[]): void;
    get getResponse(): MESH_js_MD['response'];
    parseSetmodeCommand(detection_mode: number, detection_time?: number, response_time?: number, request_id?: number): number[];
}
