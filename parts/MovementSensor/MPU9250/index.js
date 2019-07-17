class MPU9250 {
	constructor() {
		this.keys = ['gnd', 'vcc', 'sda', 'scl'];
		this.required = ['sda', 'scl'];
	}

	static info() {
		return {
			name: 'MPU9250',
		};
	}

	wired(obniz) {
		this.obniz = obniz;
		obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
		this.params.clock = 100000;
		this.params.pull = '3v';
		this.params.mode = 'master';
		this.i2c = obniz.getI2CWithConfig(this.params);
		this.obniz.wait(100);
	}

	init(accel_range, gyro_range, ADC_cycle) {
		this.i2c.write(0x68, [0x6B, 0x00]);		//activate MPU9250
		this.i2c.write(0x68, [0x37, 0x02]);    	//activate AK8963 (bypass)
		this.i2c.write(0x68, [0x1A, 0x06]);    	//activate LPF (search datasheet_p.13)
		this.i2c.write(0x68, [0x1D, 0x02]);    	//accel LPF set
		switch (accel_range) {					//accel range set (0x00:2g, 0x08:4g, 0x10:8g, 0x18:16g)
			case (2):
				this.i2c.write(0x68, [0x1C, 0x00]);
				break;
			case (4):
				this.i2c.write(0x68, [0x1C, 0x08]);
				break;
			case (8):
				this.i2c.write(0x68, [0x1C, 0x10]);
				break;
			case (16):
				this.i2c.write(0x68, [0x1C, 0x18]);
				break;
		}
		switch (gyro_range) {	//gyro range & LPF set (0x00:250, 0x08:500, 0x10:1000, 0x18:2000[deg/s])
			case (250):
				this.i2c.write(0x68, [0x1B, 0x00]);
				break;
			case (500):
				this.i2c.write(0x68, [0x1B, 0x08]);
				break;
			case (1000):
				this.i2c.write(0x68, [0x1B, 0x10]);
				break;
			case (2000):
				this.i2c.write(0x68, [0x1B, 0x18]);
				break;
		}
		switch (ADC_cycle) {    //AK8963 ADC start & 16bit output & output cycle set (0x12:8Hz, 0x16:100Hz)
			case (8):
				this.i2c.write(0x0C, [0x0A, 0x12]);
			case (100):
				this.i2c.write(0x0C, [0x0A, 0x16]);
		}
	}

	async get_MPU6050(accel_range, gyro_range, output_flag) {
		this.i2c.write(0x68, [0x3B]);        						//request MPU6050 data
		let raw_data_MPU6050 = await this.i2c.readWait(0x68, 14);	//read 14byte
		let data_MPU6050 = new Int16Array(7);
		let data_out = new Array(7);
		for (let i = 0; i < 7; i++) {
			data_MPU6050[i] = (raw_data_MPU6050[2 * i] << 8) | raw_data_MPU6050[2 * i + 1];
		}

		//calc value
		for (var i = 0; i < 3; i++) {
			data_out[i] = data_MPU6050[i] * accel_range / 32768;       	//reset range 16bit(±32768) to ±[accel_range]
		}
		data_out[3] = (data_MPU6050[i] / 333.87) + 21; 					//(TEMP_OUT / Temp_Sensitivity) + 21degC
		for (var i = 4; i < 7; i++) {
			data_out[i] = data_MPU6050[i] * gyro_range / 32768;       	//reset range 16bit(±32768) to ±[gyro_range]
		}

		if (output_flag) {
			//print to browzer
			document.write("Accel =", data_out[0].toFixed(2).fontcolor("red"), ' ', data_out[1].toFixed(2).fontcolor("blue"), ' ', data_out[2].toFixed(2).fontcolor("fuchsia"), ' ');
			document.write("gyro =", data_out[4].toFixed(2).fontcolor("red"), ' ', data_out[5].toFixed(2).fontcolor("blue"), ' ', data_out[6].toFixed(2).fontcolor("fuchsia"), ' ');
			document.write("T_tip =", data_out[3].toFixed(2).fontcolor("red"));
			document.write("<br>");
			window.scroll(0, $(document).height()); //auto scroll (x,y)
		}

		return data_out;
	}

	async get_AK8963(output_flag) {
		let raw_data_AK8963 = new Int16Array(3);
		this.i2c.write(0x68, [0x02]);        						//request AK8983 data
		let ST1 = await this.i2c.readWait(0x68, 1); 				//confirm magnet value readable
		if (ST1 & 0x01) {
			this.i2c.write(0x0C, [0x03]);      						//request AK8963 data
			raw_data_AK8963 = await this.i2c.readWait(0x0c, 7);		//read 7byte(read mag_data[6] to refresh)
		}
		let data_AK8963 = new Int16Array(3);
		for (let i = 0; i < 3; i++) {
			data_AK8963[i] = (raw_data_AK8963[2 * i + 1] << 8) | raw_data_AK8963[2 * i];
		}

		if (output_flag) {
			//print to browzer
			document.write("magnet =", data_AK8963[0].toFixed(0).fontcolor("red"), ' ', data_AK8963[1].toFixed(0).fontcolor("blue"), ' ', data_AK8963[2].toFixed(0).fontcolor("fuchsia"), "<br>");
			window.scroll(0, $(document).height()); //auto scroll (x,y)
		}

		return data_AK8963;
	}
}

if (typeof module === 'object') {
	module.exports = MPU9250;
}