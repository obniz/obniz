import { Base } from './Base';
export declare class LED extends Base {
    static readonly PATTERN: {
        readonly BLINK: 1;
        readonly FIREFLY: 2;
    };
    private readonly COLOR_MIN_;
    private readonly COLOR_MAX_;
    private readonly TIME_MIN_;
    private readonly TIME_MAX_;
    protected colors: {
        red: number;
        green: number;
        blue: number;
    };
    /**
     * Convert parameters to command of LED
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
