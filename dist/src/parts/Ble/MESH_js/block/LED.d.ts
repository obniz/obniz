import { Base } from './Base';
export declare class LED extends Base {
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
     * parseLedCommand
     *
     * @param colors
     * @param totalTime
     * @param cycleOnTime
     * @param cycleOffTime
     * @param pattern
     * @returns
     */
    parseLedCommand(colors: LED['colors'], totalTime: number, cycleOnTime: number, cycleOffTime: number, pattern: number): number[];
}
