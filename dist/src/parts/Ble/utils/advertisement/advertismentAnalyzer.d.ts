/**
 * @packageDocumentation
 * @module Parts.utils.advertisement
 */
export interface BleAdvBinaryAnalyzerRow<Key extends string> {
    name: Key;
    filter: number[] | BleAdvBinaryAnalyzer;
}
export declare class BleAdvBinaryAnalyzer<Keys extends string = '', Groups extends string = ''> {
    private _target;
    private readonly _parent?;
    constructor(parent?: BleAdvBinaryAnalyzer);
    addTarget<N extends string>(name: N, filter: number[]): BleAdvBinaryAnalyzer<Keys | N, Groups>;
    addTargetByLength<N extends string>(name: N, length: number): BleAdvBinaryAnalyzer<Keys | N, Groups>;
    addGroup<N extends string>(name: N, group: BleAdvBinaryAnalyzer): BleAdvBinaryAnalyzer<Keys, Groups | N>;
    groupStart<N extends string>(name: N): BleAdvBinaryAnalyzer<Keys, Groups | N>;
    groupEnd(): BleAdvBinaryAnalyzer<Keys, Groups>;
    flat(): number[];
    length(): number;
    validate(target: number[]): boolean;
    getData(target: number[], ...names: (Groups | Keys)[]): number[] | null;
    getAllData(target: number[]): ({
        [key in Keys]: number[];
    } & {
        [group in Groups]: {
            [key in Keys]: number[];
        };
    }) | null;
}
