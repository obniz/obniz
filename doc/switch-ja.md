# Switch
obniz組み込みスイッチの使い方です

### switch.onchange = function(){}
スイッチの状態が変更されたときのコールバックです．
もしスイッチを押して，離した場合，"push" と "none"の２回呼ばれます.

状態は下記４つです

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
現在のスイッチの状態を取得します

```Javascript
// Javascript Example
obniz.display.clear();
var state = await obniz.switch.getWait();
if (state === "push") {
  obniz.display.print("Now Pressed");
}
```



## [await] switch.stateWait(state)
スイッチがstateの状態になるまで待ちます．

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
