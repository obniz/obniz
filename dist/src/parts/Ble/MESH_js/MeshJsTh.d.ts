import { MeshJs } from './MeshJs';
export declare class MeshJsTh extends MeshJs {
    static readonly NotifyType: {
        readonly UpdateTemperature: 4;
        readonly UpdateHumidity: 8;
        readonly Once: 16;
        readonly Always: 32;
    };
    onNotify: ((accele: MeshJsTh['response']) => void) | null;
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
    private readonly MaxTemperature;
    private readonly MinTemperature;
    private readonly MaxHumidity;
    private readonly MinHumidity;
    private response;
    notify(data: number[]): void;
    get getResponse(): MeshJsTh['response'];
    parseSetmodeCommand(temperature_range_upper: number, temperature_range_bottom: number, temperature_condition: number, humidity_range_upper: number, humidity_range_bottom: number, humidity_condision: number, type: number, request_id?: number): number[];
    private num2array;
    private complemnt;
    private invcomplemnt;
}
