import { MESH_js } from '.';
export declare class MESH_js_TH extends MESH_js {
    onNotify: ((accele: MESH_js_TH['response']) => void) | null;
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
    get getResponse(): MESH_js_TH['response'];
    parseSetmodeCommand(temperature_range_upper: number, temperature_range_bottom: number, temperature_condition: number, humidity_range_upper: number, humidity_range_bottom: number, humidity_condision: number, type: number, request_id?: number): number[];
    private num2array;
    private complemnt;
    private invcomplemnt;
}
