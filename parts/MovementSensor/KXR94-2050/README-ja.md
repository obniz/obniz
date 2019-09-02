# KXR94-2050

x,y,zの3軸加速度センサ
重力の向きや，どちらの方向に動いているかを知ることができます．

![](./image.jpg)


## obniz.wired(obniz, {x, y, z [, vcc, gnd, enable, self_test]})

部品のピンをobniz Boardに接続し、どこに接続したかなどを設定します。

name | type | required | default | description
--- | --- | --- | --- | ---
x | `number(obniz Board io)` | yes | &nbsp; | X軸の加速度の値が電圧として出力されます。
y | `number(obniz Board io)` | yes | &nbsp; | Y軸の加速度の値が電圧として出力されます。
z | `number(obniz Board io)` | yes | &nbsp; | Z軸の加速度の値が電圧として出力されます。
vcc | `number(obniz Board io)` | &nbsp; | &nbsp; | 電源です。5V。
gnd | `number(obniz Board io)` | &nbsp; | &nbsp; | 電源です。GND
self_test | `number(obniz Board io)` | &nbsp; | &nbsp; | highにするとセルフテストモードになります。
enable | `number(obniz Board io)` | &nbsp; | &nbsp; | lowにすると加速度の計測を無効化出来ます。

```javascript

// Javascript Example
var sensor = obniz.wired("KXR94-2050", { vcc:0, gnd:1, x:2, y:3, z:4, enable:5, self_test:6 });

sensor.onChange = function(values){
  console.log("x:" + values.x);
  console.log("y:" + values.y);
  console.log("z:" + values.z);
}
   
```

## onChange = function({x: y: z:})

x,y,zいずれかの値が更新された場合に呼び出される関数を指定できます。
xyzはセンサーの出力値を元に計算された重力加速度となります。1であれば9.8m^2です。値の範囲は-2以上+2以下となります。

```javascript

// Javascript Example
var sensor = obniz.wired("KXR94-2050", { vcc:0, gnd:1, x:2, y:3, z:4, enable:5, self_test:6 });

sensor.onChange = function(values){
  console.log("x:" + values.x);
  console.log("y:" + values.y);
  console.log("z:" + values.z);
}
   
```

## onChangeX = function(value)

## onChangeY = function(value)

## onChangeZ = function(value)

X,Y,Z軸、それぞれの加速度が変わったときにのみ呼び出されます。
ある１つの軸方向の値しかいらない場合に利用すると便利です。

## get()

今の加速度を３つとも取得します。
obniz Boardに問い合わせることなく、obniz Boardから届いた最後の値を取得します。

無限ループで実行する場合はwaitを入れる必要があります。


```javascript
// Javascript Example
var sensor = obniz.wired("KXR94-2050", { vcc:0, gnd:1, x:2, y:3, z:4, enable:5, self_test:6 });
  
while (true) {
  let values = sensor.get();
  console.log("x:" + values.x);
  console.log("y:" + values.y);
  console.log("z:" + values.z);
  await obniz.wait(30);
}
```


## [await] getWait()

３軸の加速度情報を取得します。
obniz Boardに問い合わせることで最新の値を取得します。

```javascript
// Javascript Example
var sensor = obniz.wired("KXR94-2050", { vcc:0, gnd:1, x:2, y:3, z:4, enable:5, self_test:6 });
  
while (true) {
  let values = await sensor.getWait();
  console.log("x:" + values.x);
  console.log("y:" + values.y);
  console.log("z:" + values.z);
}
```