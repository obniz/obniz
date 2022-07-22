import { MeshJs } from './MeshJs';
export declare class MeshJsPa extends MeshJs {
    static readonly NotifyType: {
        readonly UpdateProximity: 4;
        readonly UpdateBrightness: 8;
        readonly Once: 16;
        readonly Always: 32;
    };
    onNotify: ((resp: MeshJsPa['response']) => void) | null;
    private readonly MessageTypeID;
    private readonly EventTypeID;
    private response;
    notify(data: number[]): void;
    get getResponse(): MeshJsPa['response'];
    /**
     *
     * @param notifyType
     * @param requestId
     * @returns command
     */
    parseSetmodeCommand(notifyType: number, requestId?: number): number[];
}
