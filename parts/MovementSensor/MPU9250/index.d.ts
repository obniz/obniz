import { I2C } from '../../../obniz/libs/io_peripherals/i2c';
export interface MPU9250Options {
	gnd?: number;
	vcc?: number;
	sda?: number;
	scl?: number;
	i2c?: I2C;
	address?: number;
}

export interface MPU9250 {
	setConfig(accel_range: number, gyro_range: number, ADC_cycle: number): void;
	getAllWait(): Promise<{
		accelerometer: {
			x: number,
			y: number,
			z: number,
		},
		temp: number,
		gyroscope: {
			x: number,
			y: number,
			z: number,
		},
		compass: {
			x: number,
			y: number,
			z: number,
		},
	}>;

	getCompassWait(): Promise<{
		x: number,
		y: number,
		z: number,
	}>;

	getAccelerometerWait(): Promise<{
		x: number,
		y: number,
		z: number,
	}>;

	getGyroscopeWait(): Promise<{
		x: number,
		y: number,
		z: number,
	}>;
}
