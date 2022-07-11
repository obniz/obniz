import { MESH_js } from '.';
export declare class MESH_js_PA extends MESH_js {
    /**
     * MessageTypeID
     * command header
     */
    private readonly MessageTypeID;
    /**
     * EventTypeID
     * command header
     */
    private readonly EventTypeID;
    private response;
    onNotify: ((resp: MESH_js_PA['response']) => void) | null;
    notify(data: number[]): void;
    get getResponse(): MESH_js_PA['response'];
    /**
     * setMode
     *
     * @param type
     * @returns
     */
    parseSetmodeCommand(notifyType: number, requestId?: number): number[];
}
