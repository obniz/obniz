import {I2C} from "../../../obniz/libs/io_peripherals/i2c";

export interface AXP192Options {
  scl?: number;
  sda?: number;
  i2c?: I2C
}

export interface AXP192 {
  set(address:number, data:number): void;
  getWait(address:number): number;
  set3VLDO2_3():void;
  enableLDO2_3():void;
  setLDO2Voltage(voltage:number): void;
  setLDO3Voltage(voltage:number): void;
  toggleLDO2(val:number): void;
  toggleLDO3(val:number): void;
  initM5StickC():void;
  getVbat():Promise<number>;
}
