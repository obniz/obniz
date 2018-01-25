# Temperature Sensor - S-5851A
温度センサS-5851Aです。センサで取得した温度を知ることができます。

## wired(obniz, vcc, gnd, sda, scl, addr0, addr1, AddrSelect)
Obnizに温度センサをつなぎます。
vcc,gnd,sda,scl,addr0,addr1はそれぞれ温度センサの電源,GND,SDA,SCL,AD0, AD1 ピンへ接続してください。
AddrSelectはI2Cアドレスです。
AddrSelectに指定した数値とアドレスの対応は以下の通りです。(指定数値:アドレス)
AddrSelectを省略した場合、アドレスは0x48になります。
8:0x48
9:0x49
A:0x4A
B:0x4B
C:0x4C
D:0x4D
E:0x4E
F:0x4F


```javascript
var sensor = obniz.wired("S5851A", 0, 2, 3, 1, 4, 5);
```
## [await] getTempWait()
現在の温度を計測して返します。単位は摂氏(℃)です。

## [await] getHumdWait()
現在の湿度を計測して返します。単位は%です。
```javascript
var sensor = obniz.wired("S5851A", 0, 1, 2, 3, 4, 5);
var temp = await sensor.getTempWait();
var humd = await sensor.getHumdWait();
console.log('temperature:' + temp);
console.log('humidity:' + humd);
```
