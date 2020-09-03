# CCS811

総揮発性有機化合物 （TVOC）と、それから計算される二酸化炭素相当物（eCO2）を計測するセンサーです。

- 総揮発性有機化合物 (TVOC):  0〜1,187 ppb
- eCO2: 400〜8,192 ppm

また、このセンサーは利用前にエージングが必要となります。詳しくはメーカーのデータシートをご覧ください。

## wired(obniz,  { vcc, gnd, do, ao});

name | type | required | default | description
--- | --- | --- | --- | ---
vcc | `number(obniz Board io)` | no |  &nbsp; | モジュールの場合はvcc, 単体の場合はHに接続します。別の電源につないでいる場合は指定する必要はありません。
gnd | `number(obniz Board io)` | no |  &nbsp; | モジュールの場合はgnd, 単体の場合はHに接続します。別の電源につないでいる場合は指定する必要はありません。
scl | `number(obniz Board io)` | no |  &nbsp; | I2Cのsclに接続したobnizのIOです
sda | `number(obniz Board io)` | no |  &nbsp; | I2Cのsdaに接続したobnizのIOです
nwak | `number(obniz Board io)` | no |  &nbsp; | センサーのnwak端子に接続したobnizのIOです
nwak | `number(obniz Board io)` | no |  &nbsp; | センサーのnwak端子に接続したobnizのIOです
nrst | `number(obniz Board io)` | no |  &nbsp; | センサーのnrst端子に接続したobnizのIOです
nrst | `number(obniz Board io)` | no |  &nbsp; | センサーのnrst端子に接続したobnizのIOです
nint | `number(obniz Board io)` | no |  &nbsp; | センサーのnint端子に接続したobnizのIOです
i2c | `number(obniz Board io)` | no |  &nbsp; | 初期化されたobnizのi2cオブジェクトです。i2cが存在する場合scl,sdaよりも優先的に利用されます。
add | `number(obniz Board io)` | no |  &nbsp; | アドレス指定端子です。接続したobnizのIOを指定します。指定することでaddressが0x5aならfalseにそれ以外ならtrueとして出力されます。
address | `number(obniz Board io)` | no | 0x5b | アドレス指定です。0x5bか0x5aのどちらかでそれ以外ではエラーとなります。

```Javascript
// Javascript Example
var sensor = obniz.wired("CCS811", {vcc:0, gnd:1, scl:2, sda:3});
await sensor.configWait();
obniz.repeat(async()=>{
  if (await sensor.checkAvailableDataWait()) {
    var data = await sensor.readAlgorithmResultsWait();
    console.log(data.TCOC, data.eCO2);
  }
})
```

## [await] configWait()

センサーに対して初期設定を行います。1秒ごとに計測するモードでスタートします。

```Javascript
// Javascript Example
var sensor = obniz.wired("CCS811", {vcc:0, gnd:1, scl:2, sda:3});
await sensor.configWait();
obniz.repeat(async()=>{
  if (await sensor.checkAvailableDataWait()) {
    var data = await sensor.readAlgorithmResultsWait();
    console.log(data.TCOC, data.eCO2);
  }
})

```

## [await] setDriveModeWait(mode)

DRIVE_MODEを指定します。configWait()により標準で1が指定されています。

- 0: Idle
- 1: 1秒ごと
- 2: 10秒ごと
- 3: 60秒ごと
- 4: raw mode

```Javascript
// Javascript Example
var sensor = obniz.wired("CCS811", {vcc:0, gnd:1, scl:2, sda:3});
await sensor.configWait();
obniz.repeat(async()=>{
  if (await sensor.checkAvailableDataWait()) {
    var data = await sensor.readAlgorithmResultsWait();
    console.log(data.TCOC, data.eCO2);
  }
})

```

## [await] setEnvironmentalDataWait(humidity, temperature)

センサー校正用の温度と湿度を送ります。
近くに設置した温湿度センサーの値をセットすることでより高い精度で計測することができます。

```Javascript
// Javascript Example
var sensor = obniz.wired("CCS811", {vcc:0, gnd:1, scl:2, sda:3});
await sensor.configWait();
await sensor.setEnvironmentalDataWait(50.1, 25.5); // 50.1%, 25.5 degree
obniz.repeat(async()=>{
  if (await sensor.checkAvailableDataWait()) {
    var data = await sensor.readAlgorithmResultsWait();
    console.log(data.TCOC, data.eCO2);
  }
})

```

## [await] checkAvailableDataWait()

計測値が利用できるかどうかを確認します。

```Javascript
// Javascript Example
var sensor = obniz.wired("CCS811", {vcc:0, gnd:1, scl:2, sda:3});
await sensor.configWait();
obniz.repeat(async()=>{
  if (await sensor.checkAvailableDataWait()) {
    var data = await sensor.readAlgorithmResultsWait();
    console.log(data.TCOC, data.eCO2);
  }
})

```

## [await] readAlgorithmResultsWait()

TVOCとeCO2を取得します。

```Javascript
// Javascript Example
var sensor = obniz.wired("CCS811", {vcc:0, gnd:1, scl:2, sda:3});
await sensor.configWait();
obniz.repeat(async()=>{
  if (await sensor.checkAvailableDataWait()) {
    var data = await sensor.readAlgorithmResultsWait();
    console.log(data.TCOC, data.eCO2);
  }
})

```

## wake()

nwakを利用しsleepから復帰させます。nwakがwiredで指定されている必要があります。

```Javascript
// Javascript Example
var sensor = obniz.wired("CCS811", {vcc:0, gnd:1, scl:2, sda:3});
sensor.sleep();
await obniz.wait(1000);
sensor.wake();
```

## sleep()

nwakを利用しスリープさせます。nwakがwiredで指定されている必要があります。

```Javascript
// Javascript Example
var sensor = obniz.wired("CCS811", {vcc:0, gnd:1, scl:2, sda:3});
sensor.sleep();
```


## [await] hwResetWait()

リセットピンを使いセンサーをリセットします。nrstがwiredで指定されている必要があります。

```Javascript
// Javascript Example
var sensor = obniz.wired("CCS811", {vcc:0, gnd:1, scl:2, sda:3});
await sensor.configWait();
var data = await sensor.readAlgorithmResultsWait();
console.log(data.TCOC, data.eCO2);
await sensor.hwResetWait();
await sensor.configWait();
data = await sensor.readAlgorithmResultsWait();
console.log(data.TCOC, data.eCO2);
```
