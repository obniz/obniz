import { I2C } from '../../../obniz/libs/io_peripherals/i2c';
export interface AK8963Options {
	gnd?: number;
	vcc?: number;
	sda?: number;
	scl?: number;
	i2c?: I2C;
	address?: number;
	adb_cycle?: number;
}

export interface AK8963 {
	setConfig(ADC_cycle: number): void;
	getWait(): Promise<{
		x: number,
		y: number,
		z: number,
	}>;
}
