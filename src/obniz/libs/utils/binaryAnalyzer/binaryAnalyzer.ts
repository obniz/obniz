/* eslint-disable @typescript-eslint/no-explicit-any */

export type BinaryAnalyzerKey = keyof any;

export type BinaryAnalyzerParserResultType = {
  Ascii: string;
  Hex: string;
  UIntBE: number;
  UIntLE: number;
  RawArray: number[];
};
export type BinaryAnalyzerParserType = keyof BinaryAnalyzerParserResultType;

type BinaryAnalyzerParserPostProcessFunc<
  Type extends BinaryAnalyzerParserType,
  Result = any
> = (data: BinaryAnalyzerParserResultType[Type]) => Result;

export interface BinaryAnalyzerParserRow<
  Key extends BinaryAnalyzerKey,
  Type extends BinaryAnalyzerParserType
> {
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

export type BinaryAnalyzerRow<
  Key extends BinaryAnalyzerKey,
  Type extends BinaryAnalyzerParserType
> = BinaryAnalyzerNestRow<Key> | BinaryAnalyzerParserRow<Key, Type>;

export class BinaryAnalyzer<
  // eslint-disable-next-line @typescript-eslint/ban-types
  OUTPUT extends Record<BinaryAnalyzerKey, any> = {}
> {
  private _target: BinaryAnalyzerRow<keyof OUTPUT, any>[] = [];

  addTarget<N extends BinaryAnalyzerKey, Type extends BinaryAnalyzerParserType>(
    name: N,
    filter: number[],
    type: Type
  ): BinaryAnalyzer<
    { [key in N]: BinaryAnalyzerParserResultType[Type] } & OUTPUT
  >;

  addTarget<
    N extends BinaryAnalyzerKey,
    Type extends BinaryAnalyzerParserType,
    Result
  >(
    name: N,
    filter: number[],
    type: Type,
    postProcess?: BinaryAnalyzerParserPostProcessFunc<Type, Result>
  ): BinaryAnalyzer<{ [key in N]: Result } & OUTPUT>;

  addTarget<
    N extends BinaryAnalyzerKey,
    Type extends BinaryAnalyzerParserType,
    Result
  >(
    name: N,
    filter: number[],
    type: Type,
    postProcess?: BinaryAnalyzerParserPostProcessFunc<Type, Result>
  ): BinaryAnalyzer<{ [key in N]: Result } & OUTPUT> {
    this._target.push({
      name,
      filter,
      type,
      postProcess,
      __type: 'BinaryAnalyzerParserRow',
    });
    return this as BinaryAnalyzer<{ [key in N]: number[] } & OUTPUT>;
  }

  addTargetByLength<
    N extends BinaryAnalyzerKey,
    Type extends BinaryAnalyzerParserType
  >(
    name: N,
    length: number,
    type: Type
  ): BinaryAnalyzer<
    { [key in N]: BinaryAnalyzerParserResultType[Type] } & OUTPUT
  >;

  addTargetByLength<
    N extends BinaryAnalyzerKey,
    Type extends BinaryAnalyzerParserType,
    Result
  >(
    name: N,
    length: number,
    type: Type,
    postProcess?: BinaryAnalyzerParserPostProcessFunc<Type, Result>
  ): BinaryAnalyzer<{ [key in N]: Result } & OUTPUT>;

  addTargetByLength<
    N extends BinaryAnalyzerKey,
    Type extends BinaryAnalyzerParserType,
    Result
  >(
    name: N,
    length: number,
    type: Type,
    postProcess?: BinaryAnalyzerParserPostProcessFunc<Type, Result>
  ): BinaryAnalyzer<{ [key in N]: Result } & OUTPUT> {
    return this.addTarget(name, new Array(length).fill(-1), type, postProcess);
  }

  addGroup<
    N extends BinaryAnalyzerKey,
    NEST extends Record<BinaryAnalyzerKey, any>
  >(
    name: N,
    fnOrAnalyzer:
      | BinaryAnalyzer<NEST>
      | ((analyzer: BinaryAnalyzer) => BinaryAnalyzer<NEST>)
  ): BinaryAnalyzer<
    {
      [key in N]: NonNullable<ReturnType<BinaryAnalyzer<NEST>['getAllData']>>;
    } &
      OUTPUT
  > {
    const analyzer =
      fnOrAnalyzer instanceof BinaryAnalyzer
        ? fnOrAnalyzer
        : fnOrAnalyzer(new BinaryAnalyzer());
    this._target.push({
      name,
      filter: analyzer,
      __type: 'BinaryAnalyzerNestRow',
    });
    return this as BinaryAnalyzer<
      { [key in N]: ReturnType<BinaryAnalyzer<NEST>['getAllData']> } & OUTPUT
    >;
  }

  /**
   * 登録済みbinaryAnarlyzerのGroupを解除して、Flatな条件Arrayを作る
   */
  flat(): number[] {
    return this._target.reduce(
      (acc: number[], val: BinaryAnalyzerRow<any, any>) => {
        if (val.filter instanceof BinaryAnalyzer) {
          return [...acc, ...val.filter.flat()];
        }
        return [...acc, ...val.filter];
      },
      []
    );
  }

  length(): number {
    return this.flat().length;
  }

  validate(target: number[] | string | Buffer): boolean {
    const targetArray = this._convertToNumberArray(target);
    const flat = this.flat();
    if (flat.length > targetArray.length) {
      return false;
    }
    for (let index = 0; index < flat.length; index++) {
      if (flat[index] === -1) {
        continue;
      }
      if (targetArray[index] === flat[index]) {
        continue;
      }
      return false;
    }
    return true;
  }

  getAllData(target: number[] | string | Buffer): OUTPUT | null {
    const targetArray = this._convertToNumberArray(target);
    if (!this.validate(targetArray)) {
      return null;
    }
    const result: any = {};

    let index = 0;
    for (const one of this._target) {
      if (one.__type === 'BinaryAnalyzerNestRow') {
        const newTarget = targetArray.slice(index, index + one.filter.length());
        result[one.name] = one.filter.getAllData(newTarget);
      } else {
        const raw = targetArray.slice(index, index + one.filter.length);
        const data = this._doTypeConvertProcess(one, raw);
        result[one.name] = one.postProcess ? one.postProcess(data) : data;
      }
      if (one.filter instanceof BinaryAnalyzer) {
        index += one.filter.length();
      } else {
        index += one.filter.length;
      }
    }

    return result;
  }

  private _convertToNumberArray(target: number[] | string | Buffer) {
    if (Array.isArray(target)) {
      return target;
    }
    const buf =
      typeof target === 'string' ? Buffer.from(target, 'hex') : target;
    return Array.from(buf);
  }

  // number[]を解析して、各Typeに変換する
  private _doTypeConvertProcess<
    Key extends BinaryAnalyzerKey,
    Type extends BinaryAnalyzerParserType
  >(
    config: BinaryAnalyzerParserRow<Key, Type>,
    data: number[]
  ): BinaryAnalyzerParserResultType[Type] {
    switch (config.type) {
      case 'Ascii':
        return Buffer.from(data).toString(
          'ascii'
        ) as BinaryAnalyzerParserResultType[Type];
      case 'UIntBE':
        return data.reduce(
          (acc, val) => (acc << 8) | val,
          0
        ) as BinaryAnalyzerParserResultType[Type];
      case 'UIntLE':
        return data
          .reverse()
          .reduce(
            (acc, val) => (acc << 8) | val,
            0
          ) as BinaryAnalyzerParserResultType[Type];
      case 'RawArray':
        return data as BinaryAnalyzerParserResultType[Type];
      case 'Hex':
        return Buffer.from(data).toString(
          'hex'
        ) as BinaryAnalyzerParserResultType[Type];
    }
    throw new Error();
  }
}
