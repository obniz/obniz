# Keyestudio_Buzzer

Keyestudio buzzer. It make a specified sound.

![](image.jpg)

## wired(obniz,  { signal [, vcc, gnd]});


name | type | required | default | description
--- | --- | --- | --- | ---
signal | `number(obniz Board io)` | yes |  &nbsp; | signal output pin(s pin of Keyestudio)
vcc | `number(obniz Board io)` | no |  &nbsp; | VCC(+ pin of Keyestudio)
gnd | `number(obniz Board io)` | no |  &nbsp; | GND(- pin of Keyestudio)


```Javascript
// Javascript Example
var speaker = obniz.wired("Keyestudio_Buzzer", {signal:0, vcc:1, gnd:2});
speaker.play(1000) // 1000 Hz
```

## play(frequency)

Specify the frequency of the sound from the speaker.

```Javascript
// Javascript Example
var speaker = obniz.wired("Keyestudio_Buzzer", {signal:0, vcc:1, gnd:2});
speaker.play(1000) // 1000 Hz
```

## stop()

再生を停止します。

```Javascript
// Javascript Example
var speaker = obniz.wired("Keyestudio_Buzzer", {signal:0, vcc:1, gnd:2});
speaker.play(1000) // 1000 Hz
await obniz.wait(1000);
speaker.stop();
```
