# MH_Z19B


UARTで値を取得するCO2濃度センサーです。

このセンサーは加熱を必要とします。加熱後約3分間は値が安定しません。

また、工場出荷時に自動キャリブレーション機能が自動でONになっています。この機能は、24時間毎の最低値を400ppmとして設定するものなので、屋内使用の場合は`setDetectionRange()`関数より自動キャリブレーション機能をOFFにすることを推奨します。

詳しくは[データシート](https://www.winsen-sensor.com/d/files/infrared-gas-sensor/mh-z19b-co2-ver1_0.pdf)をご覧ください。


## wired(obniz,  { sensor_tx, sensor_rx [,vcc, gnd]});

name | type | required | default | description
--- | --- | --- | --- | ---
sensor_tx | `number(obniz Board io)` | yes | &nbsp; | センサー側のtx端子
sensor_rx | `number(obniz Board io)` | yes | &nbsp; | センサー側のrx端子
vcc | `number(obniz Board io)` | no | &nbsp; | VCC端子(V+端子)
gnd |`number(obniz Board io)` | no | &nbsp; | GND端子

```Javascript
// Javascript Example
var sensor = obniz.wired("MH_Z19B", {vcc:0, gnd:1, sensor_tx:2, sensor_rx:3});
await sensor.heatWait();
obniz.repeat(async()=>{
  console.log(await sensor.getWait());
}, 10000);
```


## [await] heatWait(sec: number)
加熱を開始し、時間が経過するまで待ちます。引数を指定することで待ち時間をデフォルトの3分から変更できます(3分以上推奨です)。  
他の関数を実行する前に、必ずこの関数を実行してください。

name | type | required | default | description
--- | --- | --- | --- | ---
sec | `number` | no | 180 | 待機する時間(秒)

```Javascript
// Javascript Example
var sensor = obniz.wired("MH_Z19B", {vcc:0, gnd:1, sensor_tx:2, sensor_rx:3});
await sensor.heatWait();
console.log(await sensor.getWait());
```

## [await] getWait()
UARTでセンサーの値を取得します。センサーからの返答がなかった場合は `undefind` が返されます。

```Javascript
// Javascript Example
var sensor = obniz.wired("MH_Z19B", {vcc:0, gnd:1, sensor_tx:2, sensor_rx:3});
await sensor.heatWait();
obniz.repeat(async()=>{
  console.log(await sensor.getWait());
}, 10000);
```

## calibrateZero()
ゼロキャリブレーションを実施します。屋外(400ppm)での精度を高めるためのものです。  
屋外(400ppm環境下)で最低20分以上起動させた後に、この関数を実行してください。

```Javascript
// Javascript Example
var sensor = obniz.wired("MH_Z19B", {vcc:0, gnd:1, sensor_tx:2, sensor_rx:3});
await sensor.heatWait();
setTimeout(sensor.calibrateZero(), 1200000);
```

## calibrateSpan(ppm: number)

name | type | required | default | description
--- | --- | --- | --- | ---
ppm | `number` | no | 2000 | CO2濃度(ppm)

スパンキャリブレーションを実施します。1000〜2000ppm環境下での精度を高めるためのものです。    
2000ppm程度(1000ppm以上推奨)の環境下で最低20分以上起動させた後に、この関数を実行してください。引数を指定することで実施する際のCO2濃度を変更できますが、引数が1000ppm未満の場合は実行されません。  
また、スパンキャリブレーションの前にゼロキャリブレーションを実行してください。

```Javascript
// Javascript Example
var sensor = obniz.wired("MH_Z19B", {vcc:0, gnd:1, sensor_tx:2, sensor_rx:3});
await sensor.heatWait();
setTimeout(sensor.calibrateZero(), 1200000);
setTimeout(sensor.calibrateSpan(), 1200000);
```

## setAutoCalibration(autoCalibration: boolean)

name | type | required | default | description
--- | --- | --- | --- | ---
autoCalibration | `boolean` | no | true | 自動キャリブレーションの有無


自動キャリブレーションのON/OFFを設定する関数です。工場出荷時にはデフォルトでONになっており、24時間毎の最低値が400ppmとしてキャリブレーションされます。  
屋内で使用する場合は、この関数より自動キャリブレーションをOFFにすることを推奨します。

```Javascript
// Javascript Example
var sensor = obniz.wired("MH_Z19B", {vcc:0, gnd:1, sensor_tx:2, sensor_rx:3});
await sensor.heatWait();
sensor.setAutoCalibration(false);
console.log(await sensor.getWait());
```

## setDetectionRange(range: number)

name | type | required | default | description
--- | --- | --- | --- | ---
range | `number` | yes | &nbsp; | 測定範囲上限[2000,5000,10000]のいずれか

測定範囲の上限を変更します。引数に2000, 5000, 10000ppmのいずれかを設定することで変更できます。  
これ以外の値を引数に取った場合は自動的に上限が5000ppmになります。

```Javascript
// Javascript Example
var sensor = obniz.wired("MH_Z19B", {vcc:0, gnd:1, sensor_tx:2, sensor_rx:3});
await sensor.heatWait();
sensor.setDetectionRange(5000);
console.log(await sensor.getWait());
```

