# Grove_Buzzer

Grove connectable buzzer. It make a specified sound.

![](image.jpg)

## wired(obniz,  { signal [, vcc, gnd]});


name | type | required | default | description
--- | --- | --- | --- | ---
signal | `number(obniz Board io)` | yes |  &nbsp; | signal output pin(4 pin of Grove)
vcc | `number(obniz Board io)` | no |  &nbsp; | VCC(2 pin of Grove)
gnd | `number(obniz Board io)` | no |  &nbsp; | GND(0 pin of Grove)


```Javascript
// Javascript Example
var speaker = obniz.wired("Grove_Buzzer", {gnd:0, vcc:1, signal: 3});
speaker.play(1000) // 1000 Hz
```

## play(frequency)

Specify the frequency of the sound from the speaker.

```Javascript
// Javascript Example
var speaker = obniz.wired("Grove_Buzzer", {gnd:0, vcc:1, signal: 3});
speaker.play(1000) // 1000 Hz
```

## stop()

再生を停止します。

```Javascript
// Javascript Example
var speaker = obniz.wired("Grove_Buzzer", {gnd:0, vcc:1, signal: 3});
speaker.play(1000) // 1000 Hz
await obniz.wait(1000);
speaker.stop();
```