# Grove_MicroSwitch

Grove connectable Micro Switch.

![](image.jpg)

## wired(obniz,  { signal [, vcc, gnd, grove]});

name | type | required | default | description
--- | --- | --- | --- | ---
signal | `number(obniz Board io)` | yes |  &nbsp; | Signal pin of state output(4 pin of Grove)
vcc | `number(obniz Board io)` | no |  &nbsp; | VCC for button(2 pin of Grove)
gnd | `number(obniz Board io)` | no |  &nbsp; | GND for button(0 pin of Grove)
grove | `object` | no | &nbsp;  | grove interface object if a device has

```Javascript
// Javascript Example
var button = obniz.wired("Grove_MicroSwitch", {gnd:0, vcc:1, signal: 3});
button.onchange = function(voltage) {
  console.log(voltage);
}
```

If the device has a grove interface, it can be connected with just the parameter {grove: obniz.grove0}.

```Javascript
// Javascript Example
var button = obniz.wired("Grove_MicroSwitch", {grove: obniz.grove0});
button.onchange = function(voltage) {
  console.log(voltage);
}
``` 

## onchange = function(pressed){}

called when micro switch pressed/released.

```Javascript
// Javascript Example
var button = obniz.wired("Grove_MicroSwitch", {gnd:0, vcc:1, signal: 3});
button.onchange = function(pressed){
  console.log("pressed:" + pressed)
};
```

## [await] isPressedWait()

Check current micro switch with waiting result.

```Javascript
// Javascript Example
var button = obniz.wired("Grove_MicroSwitch", {gnd:0, vcc:1, signal: 3});
var pressed = await button.isPressedWait();
console.log("Pressed = " + pressed);
```


## [await] stateWait()

Wait until push/release micro switch.

```Javascript
// Javascript Example
var button = obniz.wired("Grove_MicroSwitch", {gnd:0, vcc:1, signal: 3});
await button.stateWait(true); 
console.log("micro switch pushed!");
await button.stateWait(false); 
console.log("micro switch released");
```
