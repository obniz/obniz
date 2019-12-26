import {I2cPartsOptions} from "../../../i2cParts";

export interface DHT12Options  extends  I2cPartsOptions{}

export interface DHT12 {
  getAllDataWait(): Promise<{humidity:number,temperature:number}>;
  getTempWait(): Promise<number>;
  getHumdWait(): Promise<number>;
}
