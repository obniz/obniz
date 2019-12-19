# Pressure Sensor - DPS310

気圧センサDPS310です。センサで取得した気圧を取得することができます。

(DPSの画像）
![DPS310 Shield 2Go](./image.png =100x)


## wired(obniz, {sda, scl, gnd})

obniz BoardにDPS310を接続します。3V駆動モードだとobnizの電流の規格を超えてしまうので、5V駆動モードで抵抗を用いて分圧して使用します。
Pin0, 1, 2, 9, 11を下図のように配線してください。

![](./wired-ja.png)

![](./wired2.jpg)

```javascript
//JavaScript example
obniz.setVccGnd(11, 9, '5v'); //vcc:11, drain:9
var sensor = obniz.wired("DPS310", { sda:0, scl:1, gnd:2 });
```

## [await] measurePressureOnce();
気圧の値を一度だけ取得します。

```javascript
//JavaScript example
var sensor = obniz.wired("DPS310", { sda:0, scl:1, gnd:2 });
await sensor.init(); //センサの初期化
var data = await sensor.measurePressureOnce();
console.log(data);
```