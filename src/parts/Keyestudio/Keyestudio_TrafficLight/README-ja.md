# Keyestudio_TrafficLight
Keyestudio社製の、緑、黄、赤色の3つのLEDを備えた信号機型モジュールです。  

![](image.jpg)

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
var light = obniz.wired("Keyestudio_TrafficLight", {gnd:0, green:1, yellow:2, red:3});
```

## single(led)
指定されたLEDのみを点灯させ、それ以外のLEDは消灯します。
`led`引数で`green`、`yellow`、`red`のいずれかを指定してください。  

```javascript
// JavaScript Example
var light = obniz.wired("Keyestudio_TrafficLight", {gnd:0, green:1, yellow:2, red:3});
light.single("green");
```


## next()
青、黄、赤の順番に点灯します。

```javascript
// JavaScript Example
var light = obniz.wired("Keyestudio_TrafficLight", {gnd:0, green:1, yellow:2, red:3});
while (true){
    light.next();
    await obniz.wait(1000);
}
```

## LED制御

パーツライブラリのLEDを内包しており、LEDで使用できる関数を使用できます。

[https://obniz.io/ja/sdk/parts/LED/README.md](https://obniz.io/ja/sdk/parts/LED/README.md)

個別のLEDの指定は、`green`か`yellow`か`red`を指定してください。

- on()

LEDを点灯します。  

```javascript
// JavaScript Example
var light = obniz.wired("Keyestudio_TrafficLight", {gnd:0, green:1, yellow:2, red:3});
light.green.on();
light.yellow.on();
light.red.on();
```

- off()

LEDを消灯します。  

```javascript
// JavaScript Example
var light = obniz.wired("Keyestudio_TrafficLight", {gnd:0, green:1, yellow:2, red:3});
light.green.off();
light.yellow.off();
light.red.off();
```

- blink(interval_ms)

LEDを点滅します。  

```javascript
// JavaScript Example
var light = obniz.wired("Keyestudio_TrafficLight", {gnd:0, green:1, yellow:2, red:3});
light.yellow.blink();
```

