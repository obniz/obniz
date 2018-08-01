# Peripherals PWM
PWMを出力します。
流せる電流はObnizによりますが、基本的に最大1Aまでです。詳しくはioのページを御覧ください。
PWMは6チャンネル利用可能です。
pwm0からpwm5までが利用できます。

PWMは繰り返しパルスを生成します。
次の２つのパラメーターで設定できます。

1. freq: 繰り返し間隔
2. pulse_width or duty: パルス幅

![](./images/pwm_0.png)

PWMはDCモーターの制御によく使われます。DUTY比を変えることで電圧を変えたようにモーターの強弱を変えられます。

![](./images/pwm_1.png)


## obniz.getFreePwm()
obnizが利用していないpwmモジュールを取得します。
pwmはpwm０〜pwm５の６つが利用できますが、
この関数を呼ぶことで利用中でないpwmを取得することが出来ます。

```Javascript
// Example
var pwm = obniz.getFreePwm();
```
もし利用できるpwmがない場合は例外が発生しプログラムは停止します。
```Javascript
// Example
var pwm0 = obniz.getFreePwm();
var pwm1 = obniz.getFreePwm();
var pwm2 = obniz.getFreePwm();
var pwm3 = obniz.getFreePwm();
var pwm4 = obniz.getFreePwm();
var pwm5 = obniz.getFreePwm();
var pwm6 = obniz.getFreePwm(); // Error
```


## start({io, [,drive, pull]})

pwmをnumberで指定したピンで開始します。
開始直後はfreq=1khz, duty=0%となっています。

ioのdriveとpullも設定可能です。詳しくは[io](./io)を御覧ください。

```Javascript
// Javascript Example
var pwm = obniz.getFreePwm();
pwm.start({io:0}); // start pwm. output at io0
pwm.freq(1000);
pwm.duty(50);

var pwm2 = obniz.getFreePwm();
pwm2.start({io:1, drive:"open-drain", pull:"5v"});
```
## freq(frequency)

PWMの発振周波数を指定します。
パルスの幅ではなくパルスの出る間隔を規定します。
DCモーターなどでは1khzなどが一般的です。

```Javascript
// Javascript Example
var pwm = obniz.getFreePwm();
pwm.start({io:0});
pwm.freq(1000); // set pwm. frequency to 1khz
```
## pulse(width ms)

PWMのパルス幅をミリ秒で指定します。

```Javascript
// Javascript Example
var pwm = obniz.getFreePwm();
pwm.start({io:0});
pwm.freq(1000); // set pwm frequency to 1khz
pwm.pulse(0.5) // set pwm pulse 0.5ms.  so this is  50% ratio.
```
## duty(ratio)

PWMのパルス幅をデューティー比で指定します。

```Javascript
// Javascript Example
var pwm = obniz.getFreePwm();
pwm.start({io:0});
pwm.freq(1000); // set pwm frequency to 1khz
pwm.duty(50) // set pwm pulse width 50%
```

## modulate(modulation type, interval ms, data)

PWMの出力をarrayのデータにより変調します。
変調方式は以下より選べます。

1. "am"

am変調は1であれば現在の周波数によりpwmの出力をONにして、duty比50%で出力し、０のときは出力しなくなります。
信号のシンボル長も指定できます。

![](./images/pwm_modu.png)

リモコンに使われる赤外線信号を出力するのに使えます。38khzの周波数を信号で変調します。


```Javascript
// Javascript Example
var pwm = obniz.getFreePwm();
pwm.start({io:0});
pwm.freq(38000); // set pwm frequency to 38khz

// signal for room heater's remote signal
var arr = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1];

pwm.modulate("am", 0.07, arr); // am modulate. symbol length = 70us.
```
## end();

PWMの発振を停止します。
出力で使われていたピンは開放されて入力になります。

```Javascript
// Javascript Example
var pwm = obniz.getFreePwm();
pwm.start({io:0});
pwm.end();
```