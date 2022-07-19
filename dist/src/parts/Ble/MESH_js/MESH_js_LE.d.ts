import { MESH_js } from '.';
export declare class MESH_js_LE extends MESH_js {
    static readonly Pattern: {
        readonly Blink: 1;
        readonly Soft: 2;
    };
    parseLightupCommand(red: number, green: number, blue: number, total_time: number, cycle_on_time: number, cycle_off_time: number, pattern: number): number[];
}
