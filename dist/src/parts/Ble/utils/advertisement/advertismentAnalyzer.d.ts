/**
 * @packageDocumentation
 * @module Parts.utils.advertisement
 */
export interface BleAdvBinaryAnalyzerRow {
    name: string;
    filter: number[] | BleAdvBinaryAnalyzer;
}
export declare class BleAdvBinaryAnalyzer {
    private _target;
    private readonly _parent?;
    constructor(parent?: BleAdvBinaryAnalyzer);
    addTarget(name: string, filter: number[]): this;
    addTargetByLength(name: string, length: number): this;
    addGroup(name: string, group: BleAdvBinaryAnalyzer): this;
    groupStart(name: string): BleAdvBinaryAnalyzer;
    groupEnd(): BleAdvBinaryAnalyzer;
    flat(): number[];
    length(): number;
    validate(target: number[]): boolean;
    getData(target: number[], ...names: string[]): number[] | null;
    getAllData(target: number[]): any | null;
}
