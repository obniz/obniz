# IPM-165

Doppler module for moving obstacle detection.

Below image is InnoSent's module using IPM-165.

[Datasheet](https://manualzz.com/doc/15328561/ist2011-001-r2)

![](image.jpg)

## wired(obniz, { signal[, vcc, gnd]});

name | type | required | default | description
--- | --- | --- | --- | ---
signal | `number(obniz Board io)` | yes |  &nbsp; | output pin. 
vcc | `number(obniz Board io)` | no |  &nbsp; | vcc
gnd | `number(obniz Board io)` | no |  &nbsp; | gnd

See pin assign at [Datasheet](https://manualzz.com/doc/15328561/ist2011-001-r2)

```Javascript
// Javascript Example
var IPM165 = obniz.wired("IPM-165", {vcc:0, signal:1, gnd:2});
IPM165.onchange = function(voltage) {
  console.log(voltage);
}
```

## onchange = function(voltage)

Change callback of output.
It change regarding moving detectino.

```Javascript
// Javascript Example
var IPM165 = obniz.wired("IPM-165", {vcc:0, signal:1, gnd:2});
IPM165.onchange = function(voltage) {
  console.log(voltage);
}
```

## [await] getWait()

Read output voltage at onece.

```Javascript
// Javascript Example
var IPM165 = obniz.wired("IPM-165", {vcc:0, signal:1, gnd:2});
const voltage = await IPM165.getWait();
console.log(voltage);
```