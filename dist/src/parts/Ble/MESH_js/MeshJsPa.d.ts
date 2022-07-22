import { MeshJs } from './MeshJs';
export declare class MeshJsPa extends MeshJs {
    onNotify: ((resp: MeshJsPa['response_']) => void) | null;
    static readonly NOTIFY_TYPE: {
        readonly UPDATE_PROXIMITY: 4;
        readonly UPDATE_BRIGHTNESS: 8;
        readonly ONCE: 16;
        readonly ALWAYS: 32;
    };
    private readonly MESSAGE_TYPE_ID_;
    private readonly EVENT_TYPE_ID_;
    private response_;
    get getResponse(): MeshJsPa['response_'];
    /**
     *
     * @param data
     * @returns
     */
    notify(data: number[]): void;
    /**
     *
     * @param notifyType
     * @param requestId
     * @returns command
     */
    parseSetmodeCommand(notifyType: number, requestId?: number): number[];
}
