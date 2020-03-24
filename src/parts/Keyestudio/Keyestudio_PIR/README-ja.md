# Keyestudio PIR

Keyestudio社製のモーションセンサ(PIRセンサ)です。人や動物が近くにいるかを検出できます。

![](image.jpg)


## wired(obniz, {signal [,vcc, gnd]})

obniz Boardと接続します。
name | type | required | default | description
--- | --- | --- | --- | ---
signal | `number(obniz Board io)` | yes |  &nbsp; | signal センサの値を示す端子(s pin of Keyestudio)
vcc | `number(obniz Board io)` | no |  &nbsp; | VCC端子(+ pin of Keyestudio)
gnd | `number(obniz Board io)` | no |  &nbsp; | GND端子(- pin of Keyestudio)


```Javascript
// Javascript Example
var sensor = obniz.wired("Keyestudio_PIR", {signal:0, vcc:1, gnd:2});
sensor.onchange = function(val){
  console.log(val ? 'Moving Something!' : 'Nothing moving');
}
```

## onchange = function(value)

何かが変化した時に呼ばれる関数を設定します。
人が近づいてきたときに関数が呼ばれ、値`true`が引数に入っています。
もし、人がいなくなったり、人の動きが止まると再度呼ばれ`false`が引数に入ります。
`true`のあと、基本的にはすぐに`false`になります。

```Javascript
// Javascript Example
var sensor = obniz.wired("Keyestudio_PIR", {signal:0, vcc:1, gnd:2});
sensor.onchange = function(val){
  console.log(val ? 'Moving Something!' : 'Nothing moving');
}
```
