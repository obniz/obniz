# CT10

Groveコネクタで利用できる磁気センサーです。磁石と一緒に使うことでドアが開いたかどうかなどの検知に利用できます。

![](image.jpg)

## wired(obniz,  { signal [, vcc, gnd]});


name | type | required | default | description
--- | --- | --- | --- | ---
signal | `number(obniz Board io)` | yes |  &nbsp; | signal 地場の状態を示す端子(4 pin of Grove)
vcc | `number(obniz Board io)` | no |  &nbsp; | VCC端子(2 pin of Grove)
gnd | `number(obniz Board io)` | no |  &nbsp; | GND端子(0 pin of Grove)


```Javascript
// Javascript Example
var ct10 = obniz.wired("CT10", {gnd:0, vcc:1, signal: 3});
ct10.onchange = function(voltage) {
  console.log(voltage);
}
```

## onchange = function(detect){}

磁場の検知状態の変化で呼ばれます。
検知したた場合は`detect=true`となります。

```Javascript
// Javascript Example
var ct10 = obniz.wired("CT10", {gnd:0, vcc:1, signal: 3});
ct10.onchange = function(detect){
  console.log("magnet field detect:" + detect)
};
```

## [await] isPressedWait()

現在の状態を取得します。

```Javascript
// Javascript Example
var ct10 = obniz.wired("CT10", {gnd:0, vcc:1, signal: 3});
var detect = await ct10.isNearWait();
console.log("exist = " + detect);
```


## [await] stateWait()

検知/非検知の状態になるまで待ちます。

```Javascript
// Javascript Example
var ct10 = obniz.wired("CT10", {gnd:0, vcc:1, signal: 3});
await ct10.stateWait(true); 
console.log("ct10 detect magnet field!");
await ct10.stateWait(false); 
console.log("ct10 miss magnet field");
```