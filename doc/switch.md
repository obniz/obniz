# Switch
Embedded switch on obniz.

# switch.onchange = function(){}
When switch state changed, This function will be called.
If you press and release a switch, callback two times("push" and "none").

The states is below.

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

# [await] switch.getWait()
Determine current state with waiting response.

```Javascript
// Javascript Example
obniz.display.clear();
var state = await obniz.switch.getWait();
if (state === "push") {
  obniz.display.print("Now Pressed");
}
```