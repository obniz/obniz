export declare class MESH_parse {
    private _pattern;
    parseFeature(): number[];
    parseLightup(red: number, green: number, blue: number, time: number, cycle_on: number, cycle_off: number, pattern: number): number[];
    private checkSum;
    private errorMessage;
    private errorOutOfRange;
}
