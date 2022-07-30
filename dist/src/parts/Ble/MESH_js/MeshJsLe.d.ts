import { MeshJs } from './MeshJs';
export declare class MeshJsLe extends MeshJs {
    static readonly PATTERN: {
        readonly BLINK: 1;
        readonly FIREFLY: 2;
    };
    protected colors: {
        red: number;
        green: number;
        blue: number;
    };
    /**
     *
     * @param colors
     * @param totalTime
     * @param cycleOnTime
     * @param cycleOffTime
     * @param pattern
     * @returns
     */
    parseLedCommand(colors: MeshJsLe['colors'], totalTime: number, cycleOnTime: number, cycleOffTime: number, pattern: number): number[];
}
