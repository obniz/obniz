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
     * Verify that the device is MESH block
     *
     * @param name
     * @param opt_serialnumber
     * @returns
     */
    static isMESHblock(name: string | null, opt_serialnumber?: string): boolean;
    /**
     * Create command of LED
     *
     * @param colors
     * @param totalTime
     * @param cycleOnTime
     * @param cycleOffTime
     * @param pattern
     * @returns command
     */
    createLedCommand(colors: LED['colors'], totalTime: number, cycleOnTime: number, cycleOffTime: number, pattern: number): number[];
}
