import { MESH_js } from '.';
export declare class MESH_js_LE extends MESH_js {
    static readonly Pattern: {
        readonly BLICK: 1;
        readonly FUWA: 2;
    };
    parseLightupCommand(red: number, green: number, blue: number, time: number, cycle_on: number, cycle_off: number, pattern: number): number[];
}
