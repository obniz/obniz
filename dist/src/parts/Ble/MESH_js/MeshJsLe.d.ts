import { MeshJs } from './MeshJs';
export declare class MeshJsLe extends MeshJs {
    static readonly Pattern: {
        readonly Blink: 1;
        readonly Soft: 2;
    };
    parseLightupCommand(red: number, green: number, blue: number, total_time: number, cycle_on_time: number, cycle_off_time: number, pattern: number): number[];
}
