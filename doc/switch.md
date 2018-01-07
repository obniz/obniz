# Switch
Embeded switch on obniz.

# switch.onchange = function(){}
When switch state changed, This function will be called.
If you press and release a switch, callbacked two times("push" and "none").

The states is below.

1. none
2. push
3. left
4. right

```Javascript
// Example
obniz.display.clear();
obniz.switch.onchange = function(state) {
  if (state === "push") {
    obniz.display.print("Pushing");
  } else {
    obniz.display.clear();
  }
}
```

# [await] switch.getWait()
Determine current state with waiting response.

```Javascript
// Example
obniz.display.clear();
var state = await obniz.switch.getWait();
if (state === "push") {
  obniz.display.print("Now Pressed");
}
```