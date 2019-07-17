export interface MPU9250Options {
	gnd?: number;
	vcc?: number;
	sda: number;
	scl: number;
	i2c?: any;
	pull?: any;
}

export interface MPU9250 {
	init(arg0: number, arg1: number, arg2: number): any;
	get_MPU6050(arg0: number, arg1: number, arg2: boolean): Promise<number, number, number, number, number, number, number>;
	get_AK8963(arg0: number): Promise<number, number, number>;
}
