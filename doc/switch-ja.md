# Switch
obniz組み込みスイッチの使い方です

# switch.onchange = function(){}
スイッチの状態が変更されたときのコールバックです．
もしスイッチを押して，離した場合，"push" と "none"の２回呼ばれます.

状態は書き４つです

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
現在のスイッチの状態を取得します

```Javascript
// Example
obniz.display.clear();
var state = await obniz.switch.getWait();
if (state === "push") {
  obniz.display.print("Now Pressed");
}
```