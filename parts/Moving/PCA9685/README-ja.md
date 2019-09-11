# PCA9685

PCA9685は16の独立したPWMを出力できるチップです。周波数は16全てで共通となります。
サーボモーターの駆動に最適で、16のサーボモーターをそれぞれ別々に動かすことが出来ます。

出力電流はそれほど強くないのでDCモーターを直接つなぐことは出来ません。

![](./image.jpg)

各社からサーボモーター用のピンヘッダもついたモジュール販売されています。
上の写真はAdafruitのものです。
[https://www.adafruit.com/product/815](https://www.adafruit.com/product/815)


## wired(obniz, {[gnd, vcc, oe, scl, sda, i2c, enabled, address, drive]})

チップの各ピンをどのobniz Boardのioに接続したか設定します。

サーボモーターに供給する電源（AdafruitのモジュールではV+と表示されています。）はobniz Boardからではなく、別の電源を利用して下さい。

name | type | required | default | description
--- | --- | --- | --- | ---
scl | `number(obniz Board io)` | no |  &nbsp; | つないだobniz Boardのioを指定してください。
sda | `number(obniz Board io)` | no | &nbsp;  | つないだobniz Boardのioを指定してください。
i2c | `i2c object` | no | &nbsp;  | 設定済みのi2cに接続している場合に利用できます。
vcc | `number(obniz Board io)` | no |  &nbsp; | 別の電源につないでいる場合は指定する必要はありません。vcc/gndどちらかでも指定されている場合は、電源投入後にこの関数の中でwaitが入ります。
gnd | `number(obniz Board io)` | no |  &nbsp; | 別の電源につないでいる場合は指定する必要はありません。vcc/gndどちらかでも指定されている場合は、電源投入後にこの関数の中でwaitが入ります。
oe | `number(obniz Board io)` | no |  &nbsp; | 出力ピンすべてをonでもoffでもないハイインピーダンスに切り替えるためのピンです。指定した場合はsetEnable()関数が使えるようになります。enabled=falseを指定しない限りenabledが初期状態となります。
enabled | `boolean` | no | true  | oeが指定されていた場合、初期状態をどちらにするか指定できます。
address | `number` | no | 0x40 | モジュールのアドレスです。初期設定(0x40)から変更している場合は指定して下さい。
drive | `boolean` | no |  'push-pull' | 標準で出力はプッシュプル出力ですが、'open-drain'を指定することでオープンドレイン出力にできます。


```Javascript
// Javascript Example
var driver = obniz.wired("PCA9685", {gnd:0, oe:1, scl:2, sda:3, vcc:4});
var pwm0 = driver.getPWM(0);
pwm0.freq(1000);
pwm0.duty(50);
```

### Multiple on single i2c

このモジュールはI2Cのアドレスを比較的自由に設定できます。
そのため同じI2Cバスライン上に複数のモジュールを置くことが出来ます。

```Javascript
// Javascript Example

var i2c = obniz.getFreeI2C();
i2c.start({mode:"master", sda:3, scl:2, clock:400 * 1000, pull:"5v"}); 

var driver0 = obniz.wired("PCA9685", {gnd:0, oe:1, i2c:i2c, vcc:4, address:0x40});
var driver1 = obniz.wired("PCA9685", {i2c:i2c, address:0x41});

var pwm0 = driver0.getPWM(0);
pwm0.freq(1000);
pwm0.duty(50);

var pwm16 = driver1.getPWM(0);
pwm16.freq(1000);
pwm16.duty(50);
```

## getPWM(num)

16あるpwmモジュールのうちいずれか1つをpwmオブジェクトとして取得できます。0~15が指定できます。

pwmオブジェクトはobniz.pwmXと同じく以下の関数を持っています。

 - pwm.freq()
 - pwm.duty()
 - pwm.pulse()

ただし、周波数だけはモジュール全体で共通なので、他のPWMと違う値を指定すると他のPWMに影響があります。pwm0だけ1khzでほかは500hzといった使い方はできません。

```Javascript
// Javascript Example
var driver = obniz.wired("PCA9685", {gnd:0, oe:1, scl:2, sda:3, vcc:4});
var pwm0 = driver.getPWM(0);
pwm0.freq(1000);
pwm0.duty(50);
```

また、[ServoMotor](../ServoMotor)もこのpwmオブジェクトを受け付けられるようになっています。

```Javascript
// Javascript Example
var driver = obniz.wired("PCA9685", {gnd:0, oe:1, scl:2, sda:3, vcc:4});
var servo0 = obniz.wired("ServoMotor", {pwm: driver.getPWM(0)});
var servo1 = obniz.wired("ServoMotor", {pwm: driver.getPWM(1)});
var servo2 = obniz.wired("ServoMotor", {pwm: driver.getPWM(2)});
servo0.angle(90);
servo1.angle(95);
servo2.angle(100);
```

## freq(frequency)

モジュールの周波数を指定します。
16あるPWMは独立していますが、周波数だけは共通となります。

24~1526Hzが指定できます。

また、このモジュールはパルス出力にDuty比を重要視しますので、出力中のpwmの周波数を変更してもDuty比には影響はありません。

```Javascript
// Javascript Example
var driver = obniz.wired("PCA9685", {gnd:0, oe:1, scl:2, sda:3, vcc:4});
driver.freq(1000);
```

## duty(index, duty)

indexで指定したpwmのDuty比を変更できます。

```Javascript
// Javascript Example
var driver = obniz.wired("PCA9685", {gnd:0, oe:1, scl:2, sda:3, vcc:4});
driver.freq(1000);
driver.duty(0, 50);
driver.duty(1, 60);
```

## pulse(index, pulse_width)

indexで指定したpwmのパルス出力幅をmsecで指定します。

```Javascript
// Javascript Example
var driver = obniz.wired("PCA9685", {gnd:0, oe:1, scl:2, sda:3, vcc:4});
driver.freq(100); // 100hz = 10msec interval
driver.pulse(0, 5);
driver.pulse(1, 6);
```

## setEnable(enabled)
oe端子をobniz Boardにつないでいる場合にのみ使えます。
出力ピンをすべてハイインピーダンスにします。

```Javascript
// Javascript Example
var driver = obniz.wired("PCA9685", {gnd:0, oe:1, scl:2, sda:3, vcc:4, enabled: false});
driver.setEnable(true);
```