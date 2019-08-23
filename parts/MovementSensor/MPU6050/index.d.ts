import { I2C } from '../../../obniz/libs/io_peripherals/i2c';
export interface MPU6050Options {
	gnd?: number;
	vcc?: number;
	sda?: number;
	scl?: number;
	i2c?: I2C;
	address?: number;
	accelerometer_range?: number;
	gyroscope_range?: number;
}

export interface MPU6050 {
	setConfig(accel_range: number, gyro_range: number): void;
	getWait(): Promise<{
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
	}>;

}
