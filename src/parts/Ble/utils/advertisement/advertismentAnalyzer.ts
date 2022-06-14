/**
 * @packageDocumentation
 * @module Parts.utils.advertisement
 */

export interface BleAdvBinaryAnalyzerRow {
  name: string;
  filter: number[] | BleAdvBinaryAnalyzer;
}

export class BleAdvBinaryAnalyzer {
  private _target: BleAdvBinaryAnalyzerRow[] = [];
  private readonly _parent?: BleAdvBinaryAnalyzer;

  constructor(parent?: BleAdvBinaryAnalyzer) {
    this._parent = parent;
  }

  addTarget(name: string, filter: number[]): this {
    this._target.push({ name, filter });
    return this;
  }

  addTargetByLength(name: string, length: number): this {
    this._target.push({ name, filter: new Array(length).fill(-1) });
    return this;
  }

  addGroup(name: string, group: BleAdvBinaryAnalyzer): this {
    this._target.push({ name, filter: group });
    return this;
  }

  groupStart(name: string): BleAdvBinaryAnalyzer {
    const filter = new BleAdvBinaryAnalyzer(this);
    this._target.push({ name, filter });
    return filter;
  }

  groupEnd(): BleAdvBinaryAnalyzer {
    if (!this._parent) {
      throw new Error('Cannot call parent of root');
    }
    return this._parent;
  }

  flat(): number[] {
    return this._target.reduce(
      (acc: number[], val: BleAdvBinaryAnalyzerRow) => {
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

  getData(target: number[], ...names: string[]): number[] | null {
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
          return one.filter.getData(newTarget, ...names.slice(1));
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

  getAllData(target: number[]): any | null {
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
