/**
 * @packageDocumentation
 * @module Parts.utils.advertisement
 */

export interface BleAdvBinaryAnalyzerRow<Key extends string> {
  name: Key;
  filter: number[] | BleAdvBinaryAnalyzer;
}

export class BleAdvBinaryAnalyzer<
  Keys extends string = '',
  Groups extends string = ''
> {
  private _target: BleAdvBinaryAnalyzerRow<Keys | string>[] = [];
  private readonly _parent?: BleAdvBinaryAnalyzer;

  constructor(parent?: BleAdvBinaryAnalyzer) {
    this._parent = parent;
  }

  addTarget<N extends string>(
    name: N,
    filter: number[]
  ): BleAdvBinaryAnalyzer<Keys | N, Groups> {
    this._target.push({ name, filter });
    return this as BleAdvBinaryAnalyzer<Keys | N, Groups>;
  }

  addTargetByLength<N extends string>(
    name: N,
    length: number
  ): BleAdvBinaryAnalyzer<Keys | N, Groups> {
    this._target.push({ name, filter: new Array(length).fill(-1) });
    return this as BleAdvBinaryAnalyzer<Keys | N, Groups>;
  }

  addGroup<N extends string>(
    name: N,
    group: BleAdvBinaryAnalyzer
  ): BleAdvBinaryAnalyzer<Keys, Groups | N> {
    this._target.push({ name, filter: group });
    return this as BleAdvBinaryAnalyzer<Keys, Groups | N>;
  }

  groupStart<N extends string>(
    name: N
  ): BleAdvBinaryAnalyzer<Keys, Groups | N> {
    const filter = new BleAdvBinaryAnalyzer(this as BleAdvBinaryAnalyzer);
    this._target.push({ name, filter: filter as any });
    return filter as BleAdvBinaryAnalyzer<Keys, Groups | N>;
  }

  groupEnd(): BleAdvBinaryAnalyzer<Keys, Groups> {
    if (!this._parent) {
      throw new Error('Cannot call parent of root');
    }
    return this._parent as BleAdvBinaryAnalyzer<Keys, Groups>;
  }

  flat(): number[] {
    return this._target.reduce(
      (acc: number[], val: BleAdvBinaryAnalyzerRow<Keys | string>) => {
        if (val.filter instanceof BleAdvBinaryAnalyzer) {
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

  validate(target: number[]): boolean {
    const flat = this.flat();
    if (flat.length > target.length) {
      return false;
    }
    for (let index = 0; index < flat.length; index++) {
      if (flat[index] === -1) {
        continue;
      }
      if (target[index] === flat[index]) {
        continue;
      }
      return false;
    }
    return true;
  }

  getData(target: number[], ...names: (Groups | Keys)[]): number[] | null {
    if (!this.validate(target)) {
      return null;
    }
    if (!names || names.length === 0) {
      return target;
    }
    let index = 0;
    for (const one of this._target) {
      if (one.name === names[0]) {
        if (one.filter instanceof BleAdvBinaryAnalyzer) {
          const newTarget = target.slice(index, index + one.filter.length());
          return one.filter.getData(newTarget, ...(names.slice(1) as any));
        } else {
          const newTarget = target.slice(index, index + one.filter.length);
          return newTarget;
        }
      }
      if (one.filter instanceof BleAdvBinaryAnalyzer) {
        index += one.filter.length();
      } else {
        index += one.filter.length;
      }
    }

    return null;
  }

  getAllData(
    target: number[]
  ):
    | ({ [key in Keys]: number[] } &
        { [group in Groups]: { [key in Keys]: number[] } })
    | null {
    if (!this.validate(target)) {
      return null;
    }
    const result: any = {};

    let index = 0;
    for (const one of this._target) {
      if (one.filter instanceof BleAdvBinaryAnalyzer) {
        const newTarget = target.slice(index, index + one.filter.length());
        result[one.name] = one.filter.getAllData(newTarget);
      } else {
        result[one.name] = target.slice(index, index + one.filter.length);
      }
      if (one.filter instanceof BleAdvBinaryAnalyzer) {
        index += one.filter.length();
      } else {
        index += one.filter.length;
      }
    }

    return result;
  }
}
