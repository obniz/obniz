import { MESH_js } from '.';
export declare class MESH_js_PA extends MESH_js {
    static NotifyType: {
        readonly UpdateProximity: 4;
        readonly UpdateBrightness: 8;
        readonly Once: 16;
        readonly Always: 32;
    };
    onNotify: ((resp: MESH_js_PA['response']) => void) | null;
    private readonly MessageTypeID;
    private readonly EventTypeID;
    private response;
    notify(data: number[]): void;
    get getResponse(): MESH_js_PA['response'];
    /**
     *
     * @param notifyType
     * @param requestId
     * @returns command
     */
    parseSetmodeCommand(notifyType: number, requestId?: number): number[];
}
