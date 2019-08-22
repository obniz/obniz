export interface MPU9250Options {
	gnd?: number;
	vcc?: number;
	sda?: number;
	scl?: number;
	i2c?: any;
	address?: any;
}

export interface MPU9250 {
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
