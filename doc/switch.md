# Switch
Here we show how to use the embedded switch on obniz.

### switch.onchange = function(){}
When the switch state changes, this callback function will be called.
If you press and release a switch, it callbacks twice ("push" and "none").

The states are as below.

1. none
2. push
3. left
4. right

```Javascript
// Javascript Example
obniz.display.clear();
obniz.switch.onchange = function(state) {
  if (state === "push") {
    obniz.display.print("Pushing");
  } else {
    obniz.display.clear();
  }
}
```

## [await] switch.getWait()
This determines the current status of the switch.

```Javascript
// Javascript Example
obniz.display.clear();
var state = await obniz.switch.getWait();
if (state === "push") {
  obniz.display.print("Now Pressed");
}
```



## [await] switch.stateWait(state)
With this you wait until the switch status changes to state.

```Javascript
// Javascript Example
await obniz.switch.stateWait("push"); 
console.log("switch pushed");

await obniz.switch.stateWait("left"); 
console.log("switch left");

await obniz.switch.stateWait("right"); 
console.log("switch right");

await obniz.switch.stateWait("none"); 
console.log("switch none");

```