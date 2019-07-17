# MPU9250

加速度・ジャイロセンサーのMPU6050, 磁気センサーのAK8963を複合した9軸センサーモジュールです．

[データシート：共立プロダクツ](http://www.kyohritsu.jp/eclib/PROD/MANUAL/kp9250.pdf)

[データシート：ストロベリーリナックス](https://strawberry-linux.com/pub/mpu-9250-manual.pdf)

加速度3軸，ジャイロ3軸，地磁気(磁界)3軸の計9軸を検出します．

![](./image.jpg)

## 配線図とサンプルプログラム
obnizの3Vピン設定は十分な電力ではないので、レギュレータで5Vピン設定を2.4-3.6Vに落としてください！
具体的には以下の様にレギュレータを入れます．
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
gnd , vcc , sda , sclを好きなピンに設定しましょう．

## init(accel_range, gyro_range, ADC_cycle)

MPU9250の各種初期設定をします．

### **accel_range**
 ±2, 4, 8, 16[g]のレンジから選べます．

レンジ大	: 広いレンジが測れる．
レンジ小	: 値が細かく測れる．

### **gyro_range**
±250, 500, 1000, 2000[deg/s]のレンジから選べます．

レンジ大	: 広いレンジが測れる．
レンジ小	: 値が細かく測れる．

### **ADC_cycle**
8, 100[Hz]から選べます．

8[Hz]	: データ量は少ないが，値がより安定する．
100[Hz]	: データをより多く測定出来る．

## [await] get_MPU6050(accel_range, gyro_range, output_flag)

MPU6050からのデータを配列7個で1度だけ取得できます．x, y, zの対応は[データシート：共立プロダクツ](http://www.kyohritsu.jp/eclib/PROD/MANUAL/kp9250.pdf)をご覧ください．
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

### **accel_range, gyro_range**
initで設定した値をもう一度入れてください．

### **output_flag**
1にすると各種値がブラウザに表示されます．チェックにどうぞ．

## [await] get_AK8963()
AK8963からのデータを配列3個で1度だけ取得できます．x, y, zの対応は[データシート：共立プロダクツ](http://www.kyohritsu.jp/eclib/PROD/MANUAL/kp9250.pdf)をご覧ください．磁石を近づけても確認出来ます．

```javascript
magnet = await mpu.get_AK8963();
var magnet_x, magnet_y, magnet_z;

magnet_x = magnet[0];
magnet_y = magnet[1];
magnet_z = magnet[2];
```

### **output_flag**
1にすると地磁気値がブラウザに表示されます．チェックにどうぞ．