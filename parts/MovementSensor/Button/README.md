# Button
Button turn on/off electricity. Just monitor voltage to check button pressed or not.

# obniz.wired("Button", {signal:0, gnd:1})

![photo of wired](./wired.png)
Connect two pins to obniz. Many buttons has no pin direction. you can connect each one to signal,gnd.

```Javascript
// Javascript Example
var button = obniz.wired("Button", {signal:0, gnd:1})
```


```Javascript
// Javascript Example
var button = obniz.wired("Button",  {signal:0, gnd:1});
```

## onchange = function(pressed){}
called when button pressed/released.

```Javascript
// Javascript Example
var button = obniz.wired("Button",  {signal:0, gnd:1});
button.onchange = function(pressed){
  console.log("pressed:" + pressed)
};
```

## [async] isPressedWait
Check current button with waiting result.
```Javascript
// Javascript Example
var button = obniz.wired("Button",  {signal:0, gnd:1});
var pressed = await button.isPressedWait();
console.log("Pressed = " + pressed);
```


## [async] stateWait
Wait until push/release button.
```Javascript
// Javascript Example
var button = obniz.wired("Button",  {signal:0, gnd:1});
await button.stateWait(false); 
console.log("button released");
await button.stateWait(true); 
console.log("button pushed");
```