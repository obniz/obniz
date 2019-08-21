import { I2C } from '../../../../obniz/libs/io_peripherals/i2c';
export interface AM2320ptions {
  vcc?: number;
  gnd?: number;
  sda?: number;
  scl?: number;
  i2c?: I2C;
}

export interface AM2320 {
  getAllWait(): Promise<{ temperature: number; humidity: number }>;
  getTempWait(): Promise<number>;
  getHumdWait(): Promise<number>;
}
