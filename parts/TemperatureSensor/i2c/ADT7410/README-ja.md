# Temperature Sensor - ADT7410
温度センサADT7410です。センサで取得した温度を知ることができます。

## wired(obniz, vcc, gnd, sda, scl, addressmode)
obniz Boardに温度センサをつなぎます。
vcc,gnd,sda,sclはそれぞれ温度センサの電源,GND,SDA,SCLピンへ接続してください。
addressmodeはI2Cアドレスを指定します。アドレスを0x48にする場合は8,0x49にする場合は9を入力してください。
秋月電子のモジュールキット(M-06708)を使用している場合のデフォルト（J3,J4をショートしないとき）は0x48です。
obniz Board内でプルアップされますので、J1,J2のシャンパははんだ付け不要です。
```javascript
// Javascript Example
var sensor = obniz.wired("ADT7410", {vcc:0, gnd:2, sda:3, scl:8, addressMode:8});
```
## [await] getTempWait()
現在の温度を計測して返します。単位は摂氏(℃)です。

```javascript
// Javascript Example
var sensor = obniz.wired("ADT7410", {vcc:0, gnd:2, sda:3, scl:8, addressMode:8});
var temp = await sensor.getTempWait();
console.log('temperature:' + temp);
```
