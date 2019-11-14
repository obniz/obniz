# MQ6
高い感度で様々なガスに反応するセンサーで、特にLPG、イソブタン、プロパンに反応します。

単品で使用する場合は2kΩ程度のロード抵抗が追加で必要です。
抵抗付きのモジュール(下記写真のような)の場合は不要です。

このセンサーは加熱を必要とします。十分に加熱されないと値は安定しません（少なくとも2分程度）

このライブラリでは、出力値の電圧のみ取得できますので、ガスの濃度が上がるほど電圧が上がっていきます。また、実際のガスの濃度(ppm)に変換したい場合はキャリブレーションを行い、計算式で変換する必要があります。

このセンサーは二酸化炭素にも反応するため、息を吹きかけるだけでも電圧が上がるのを確認することができます。

![](./image.jpg)

## wired(obniz,  { vcc, gnd, do, ao});

name | type | required | default | description
--- | --- | --- | --- | ---
vcc | `number(obniz Board io)` | no |  &nbsp; | モジュールの場合はvcc, 単体の場合はHに接続します。別の電源につないでいる場合は指定する必要はありません。
gnd | `number(obniz Board io)` | no |  &nbsp; | モジュールの場合はgnd, 単体の場合はHに接続します。別の電源につないでいる場合は指定する必要はありません。
do | `number(obniz Board io)` | no |  &nbsp; | デジタル出力です。モジュールの場合doを接続して下さい。
ao | `number(obniz Board io)` | no | &nbsp;  | アナログ出力です。単体の場合はRLを接続したVoutを。モジュールの場合はaoを接続して下さい。


```Javascript
// Javascript Example
var mq6 = obniz.wired("MQ6", {vcc:3, gnd:2, do:1, ao:0});
await mq6.heatWait();
mq6.onchangeanalog = function(voltage) {
  console.log(voltage);
}
```

## startHeating()

加熱を開始します。

```Javascript
// Javascript Example
var mq6 = obniz.wired("MQ6", {vcc:3, gnd:2, do:1, ao:0});
mq6.startHeating();
```

## [await] heatWait(sec: number)

加熱を開始し、時間が経過するまで待ちます。引数を指定することで待ち時間をデフォルトの２分から変更できます。

name | type | required | default | description
--- | --- | --- | --- | ---
sec | `number` | no | 120 | 待機する時間(秒)

```Javascript
// Javascript Example
var mq6 = obniz.wired("MQ6", {vcc:3, gnd:2, do:1, ao:0});
await mq6.heatWait();
mq6.onchangeanalog = function(voltage) {
  console.log(voltage);
}
```

## onchangeanalog = function(voltage: number)

電圧が変化した時に呼ばれる関数を指定できます。

```Javascript
// Javascript Example
var mq6 = obniz.wired("MQ6", {vcc:3, gnd:2, do:1, ao:0});
await mq6.heatWait();
mq6.onchangeanalog = function(voltage) {
  console.log(voltage);
}
```

## onexceedvoltage = function(voltage: number)

voltageLimit変数で指定した電圧を超えているときだけ呼ばれる関数を指定できます。

```Javascript
// Javascript Example
var mq6 = obniz.wired("MQ6", {vcc:3, gnd:2, do:1, ao:0});
await mq6.heatWait();
mq6.voltageLimit = 1.0
mq6.onexceedvoltage = function(voltage) {
  console.log(voltage);
}
```

## voltageLimit = number

onexceedvoltageを呼ぶしきい値を電圧で指定します。

```Javascript
// Javascript Example
var mq6 = obniz.wired("MQ6", {vcc:3, gnd:2, do:1, ao:0});
await mq6.heatWait();
mq6.voltageLimit = 1.0
mq6.onexceedvoltage = function(voltage) {
  console.log(voltage);
}
```

## onchangedigital = function(voltage: number)

wired関数でdoを指定したときのみ利用できます。
モジュールで電圧を比較し、あるレベル以上になったら出力が下がるのがdo端子です。
上がったとき、下がった時にこの関数は呼ばれます。

```Javascript
// Javascript Example
var mq6 = obniz.wired("MQ6", {vcc:3, gnd:2, do:1, ao:0});
await mq6.heatWait();
mq6.onchangedigital = function(value) {
  console.log(value);
}
```