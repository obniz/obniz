/// <reference types="node" />
/// <reference types="node" />
export declare type BinaryAnalyzerKey = keyof any;
export declare type BinaryAnalyzerParserResultType = {
    Ascii: string;
    Hex: string;
    UIntBE: number;
    UIntLE: number;
    RawArray: number[];
};
export declare type BinaryAnalyzerParserType = keyof BinaryAnalyzerParserResultType;
declare type BinaryAnalyzerParserPostProcessFunc<Type extends BinaryAnalyzerParserType, Result = any> = (data: BinaryAnalyzerParserResultType[Type]) => Result;
export interface BinaryAnalyzerParserRow<Key extends BinaryAnalyzerKey, Type extends BinaryAnalyzerParserType> {
    __type: 'BinaryAnalyzerParserRow';
    name: Key;
    filter: number[];
    type: Type;
    postProcess?: BinaryAnalyzerParserPostProcessFunc<Type>;
}
export interface BinaryAnalyzerNestRow<Key extends BinaryAnalyzerKey> {
    __type: 'BinaryAnalyzerNestRow';
    name: Key;
    filter: BinaryAnalyzer<any>;
}
export declare type BinaryAnalyzerRow<Key extends BinaryAnalyzerKey, Type extends BinaryAnalyzerParserType> = BinaryAnalyzerNestRow<Key> | BinaryAnalyzerParserRow<Key, Type>;
export declare class BinaryAnalyzer<OUTPUT extends Record<BinaryAnalyzerKey, any> = {}> {
    private _target;
    addTarget<N extends BinaryAnalyzerKey, Type extends BinaryAnalyzerParserType>(name: N, filter: number[], type: Type): BinaryAnalyzer<{
        [key in N]: BinaryAnalyzerParserResultType[Type];
    } & OUTPUT>;
    addTarget<N extends BinaryAnalyzerKey, Type extends BinaryAnalyzerParserType, Result>(name: N, filter: number[], type: Type, postProcess?: BinaryAnalyzerParserPostProcessFunc<Type, Result>): BinaryAnalyzer<{
        [key in N]: Result;
    } & OUTPUT>;
    addTargetByLength<N extends BinaryAnalyzerKey, Type extends BinaryAnalyzerParserType>(name: N, length: number, type: Type): BinaryAnalyzer<{
        [key in N]: BinaryAnalyzerParserResultType[Type];
    } & OUTPUT>;
    addTargetByLength<N extends BinaryAnalyzerKey, Type extends BinaryAnalyzerParserType, Result>(name: N, length: number, type: Type, postProcess?: BinaryAnalyzerParserPostProcessFunc<Type, Result>): BinaryAnalyzer<{
        [key in N]: Result;
    } & OUTPUT>;
    addGroup<N extends BinaryAnalyzerKey, NEST extends Record<BinaryAnalyzerKey, any>>(name: N, fnOrAnalyzer: BinaryAnalyzer<NEST> | ((analyzer: BinaryAnalyzer) => BinaryAnalyzer<NEST>)): BinaryAnalyzer<{
        [key in N]: NonNullable<ReturnType<BinaryAnalyzer<NEST>['getAllData']>>;
    } & OUTPUT>;
    /**
     * 登録済みbinaryAnarlyzerのGroupを解除して、Flatな条件Arrayを作る
     */
    flat(): number[];
    length(): number;
    validate(target: number[] | string | Buffer): boolean;
    getAllData(target: number[] | string | Buffer): OUTPUT | null;
    private _convertToNumberArray;
    private _doTypeConvertProcess;
}
export {};
