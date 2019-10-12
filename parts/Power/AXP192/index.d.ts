export interface AXP192Options {
  scl: number;
  sda: number;
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
}
