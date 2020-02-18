# Keyestudio_TrafficLight
Keyestudio社製の、緑、黄、赤色の3つのLEDを備えた信号機型モジュールです。  

![]()

## obniz.wired("Keyestudio_TrafficLight", {green, yellow, red [, gnd]})
obniz Boardに接続します。

name | type | required | default | description
--- | --- | --- | --- | ---
green | `number(obniz Board io)` | yes |  &nbsp; | 緑色LED(G pin of Keyestudio)
yellow | `number(obniz Board io)` | yes |  &nbsp; | 黄色LED(Y pin of Keyestudio)
red | `number(obniz Board io)` | yes |  &nbsp; | 赤色LED(R pin of Keyestudio)
gnd | `number(obniz Board io)` | no |  &nbsp; | GND端子(GND pin of Keyestudio)


```javascript
// JavaScript Example
var light = obniz.wired("Keyestudio_TrafficLight", {gnd:0, geeen:1, yellow:2, red:3});
```

## on(led)
LEDを点灯します。  
`led`引数で`green`、`yellow`、`red`のいずれかを指定してください。  

```javascript
// JavaScript Example
var light = obniz.wired("Keyestudio_TrafficLight", {gnd:0, geeen:1, yellow:2, red:3});
light.on("green");
```


## off(led)
LEDを消灯します。  
`led`引数で`green`、`yellow`、`red`のいずれかを指定してください。  

```javascript
// JavaScript Example
var light = obniz.wired("Keyestudio_TrafficLight", {gnd:0, geeen:1, yellow:2, red:3});
light.on("green");
await obniz.wait(1000);
light.off("green");
```


## exclusive_on(led)
LEDを排他的に点灯します(指定したLEDを、他のLEDを消灯した上で点灯します)。  
この関数を使えばLEDが一つだけ点灯していることが保証されるため、信号機のように使う時に役立ちます。  
`led`引数で`green`、`yellow`、`red`のいずれかを指定してください。  

```javascript
// JavaScript Example
var light = obniz.wired("Keyestudio_TrafficLight", {gnd:0, geeen:1, yellow:2, red:3});
light.exclusive_on("green");
await obniz.wait(1000);
light.exclusive_on("yellow");
await obniz.wait(1000);
light.exclusive_on("red");
```
