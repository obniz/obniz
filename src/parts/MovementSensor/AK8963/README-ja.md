# AK8963

磁気センサーモジュールです。

地磁気(磁界)3軸を検出します。

![](./image.jpg)

## wired("AK8963", { [gnd , vcc , sda , scl , i2c, address]})
obniz Boardにセンサーを接続します。

obniz Boardからの3V出力はセンサーを動かすのに十分な電力ではないので、レギュレータなどで2.4-3.6Vを生成してください。

```javascript
var sensor = obniz.wired("AK8963", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
```

## setConfig(ADC_cycle)

AK8963の設定をします。

- ADC_cycle

8, 100[Hz]から選べます。

8[Hz]	: データ量は少ないが，値がより安定する。
100[Hz]	: データをより多く測定出来る。

```javascript
var sensor = obniz.wired("AK8963", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
sensor.setConfig(8);
```


## [await] getWait()

磁気センサーのデータを取得して、JSONで返します。

```javascript
var sensor = obniz.wired("AK8963", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
const data = await sensor.getWait();
console.log('compass: %o', data);
```
