/**
 * @packageDocumentation
 * @module Parts
 */

import i2cParts, { I2cPartsAbstractOptions, Xyz } from "./i2cParts";

export type compassUnit = "uT" | "G" | "mT" | "T" | "mG" | "kG" | "uG";

export interface I2cCompassAbstractOptions extends I2cPartsAbstractOptions {}

export default abstract class I2cCompassAbstract extends i2cParts {
  public static async calibrateWait() {
    throw new Error("Method not implemented.");
  }

  public static async headingWait() {
    throw new Error("Method not implemented.");
  }

  protected static unitScales = {
    G: 1,
    uT: 100,
    mT: 0.1,
    T: 0.0001,
    mG: 1000,
    kG: 0.001,
    uG: 1000 * 1000,
  };
  protected abstract so: number;
  protected abstract sf: compassUnit;
  protected abstract range: string;
  protected abstract defaultUnit: compassUnit;

  public abstract async getAdcWait(): Promise<Xyz>;

  public async getWait(): Promise<Xyz> {
    const adc = await this.getAdcWait();
    return {
      x: this.calcMag(adc.x),
      y: this.calcMag(adc.y),
      z: this.calcMag(adc.z),
    };
  }

  public async getAdcArrayWait(): Promise<number[]> {
    const obj = await this.getAdcWait();
    return [obj.x, obj.y, obj.z];
  }

  public async getArrayWait(): Promise<number[]> {
    const obj = await this.getWait();
    return [obj.x, obj.y, obj.z];
  }

  public getUnit(): compassUnit {
    return this.sf;
  }

  public getRange(): string {
    return this.range;
  }

  public setUnit(new_unit: compassUnit) {
    if (Object.keys(I2cCompassAbstract.unitScales).includes(new_unit)) {
      this.sf = new_unit;
    } else {
      throw new Error(`Invalid compass unit. Valid values are ${Object.keys(I2cCompassAbstract.unitScales).join()}`);
    }
  }

  private calcMag(data: number): number {
    return (data * this.so * I2cCompassAbstract.unitScales[this.sf]) / I2cCompassAbstract.unitScales[this.defaultUnit];
  }
}
