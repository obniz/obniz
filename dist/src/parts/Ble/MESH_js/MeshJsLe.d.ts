import { MeshJs } from './MeshJs';
export declare class MeshJsLe extends MeshJs {
    static readonly PATTERN: {
        readonly BLINK: 1;
        readonly FIREFLY: 2;
    };
    /**
     *
     * @param red
     * @param green
     * @param blue
     * @param totalTime
     * @param cycleOnTime
     * @param cycleOffTime
     * @param pattern
     * @returns
     */
    parseLightupCommand(red: number, green: number, blue: number, totalTime: number, cycleOnTime: number, cycleOffTime: number, pattern: number): number[];
}
