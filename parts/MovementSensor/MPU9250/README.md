#MPU9250

This is a 9-axis sensor module that combines the acceleration / gyro sensor 'MPU6050' and the magnetic sensor 'AK8963'.

[datasheet : play-zone](https://www.play-zone.ch/en/mpu-9250-accelerometer-gyro-kompass.html)

[datasheet : Kyoritu products](http://www.kyohritsu.jp/eclib/PROD/MANUAL/kp9250.pdf)
-> only available in japanese, but this module's figures are easy to understand.

A total of 9 axes consisted of 3 axes of acceleration, 3 axes of gyro, 3 axes of geomagnetic (magnetic field) are detected.

![](./image.jpg)

## Wiring diagram and sample program
Since the 3V pin setting on obniz is not enough power, please drop 5V pin setting to 2.4-3.6V with a regulator!!
Specifically, put the regulator as follows.
![](./connect.jpg)
```html
<html>
<head>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<script src="../MPU9250/index.js"></script>
	<script src="https://obniz.io/js/jquery-3.2.1.min.js"></script>
	<script src="https://unpkg.com/obniz@2.2.0/obniz.js"></script>
</head>
<body>
	<div id="obniz-debug"></div>
	<script>
		Obniz.PartsRegistrate(MPU9250);
		var obniz = new Obniz("obniz ID here");
		obniz.onconnect = async function () {
			var mpu = obniz.wired("MPU9250", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
			var Accel_range = 16;
			var Gyro_range = 2000;
			var ADC_cycle = 100;
			mpu.init(Accel_range, Gyro_range, ADC_cycle);
			accel_temp_gyro = await mpu.get_MPU6050(Accel_range, Gyro_range, 1);
			magnet = await mpu.get_AK8963(1);
		};
	</script>
</body>
</html>
```

## wired("MPU9250", { gnd , vcc , sda , scl })

```javascript
	var mpu = obniz.wired("MPU9250", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
```
Set gnd, vcc, sda and scl to your favorite pins.

## init(accel_range, gyro_range, ADC_cycle)
Initial settings of MPU9250.

### **accel_range**
You can select from the range of ±2, 4, 8, 16 [g].

Range large: A wide range can be measured.
Range small: The value can be measured in detail.

### ** gyro_range **
You can select from the range of ±250, 500, 1000, 2000 [deg / s].

Range large: A wide range can be measured.
Range small: The value can be measured in detail.

### ** ADC_cycle **
You can choose from 8, 100 [Hz].

8 [Hz]: Although the amount of data is small, the value becomes more stable.
100 [Hz]: More data can be measured.

## [await] get_MPU6050(accel_range, gyro_range, output_flag)

Data from MPU 6050 can be acquired only once in 7 arrays. If you want to know the correspondence of x, y and z, please see
[Data sheet: Kyoritsu Products](http://www.kyohritsu.jp/eclib/PROD/MANUAL/kp9250.pdf).
But if you tilt MPU9250, you can see it right away!

```javascript
accel_temp_gyro = await get_MPU6050();
var accel_x, accel_y, accel_z, temp_tip, gyro_x, gyro_y, gyro_z;

accel_x	= accel_temp_gyro[0];
accel_y = accel_temp_gyro[1];
accel_z = accel_temp_gyro[2];

temp_tip = accel_temp_gyro[3];

gyro_x = accel_temp_gyro[4];
gyro_y = accel_temp_gyro[5];
gyro_z = accel_temp_gyro[6];
```
### ** accel_range, gyro_range **
Please enter the value set in init again.

### ** output_flag **
When this is 1, all values will be displayed in the browser. You can use this for check data value.

## [await] get_AK8963 ()
Data from AK8963 can be acquired only once with 3 arrays. If you want to know the correspondence of x, y and z, please see [Data sheet: Kyoritsu Products](http://www.kyohritsu.jp/eclib/PROD/MANUAL/kp9250.pdf). But if you move a magnet to MPU9250, you can see it right away!

```javascript
magnet = await mpu.get_AK8963();
var magnet_x, magnet_y, magnet_z;

magnet_x = magnet[0];
magnet_y = magnet[1];
magnet_z = magnet[2];
```

### **output_flag**
When this is 1, all values will be displayed in the browser. You can use this for check data value.