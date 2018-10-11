# CircularSoftPotentiometer
Adafruitの環状可変抵抗です。
タッチしている位置に応じた値を出力します。

## obniz.wired(obniz, {outer, middle})
CircularSoftPotを接続します。
CircularSoftPotの3つの端子のうち、中央の端子と外側の端子1つを接続してください。
3つすべての端子を接続する必要はありませんが、中央の端子は必ず接続してください。

```Javascript
var softpot = obniz.wired("CircularSoftPot", {outer:0, middle:1});
```
## onchange
値が変化したときにcallback関数を呼び出します。
おおむね0~5の範囲で値が返されます。

```javascript
var softpot = obniz.wired("CircularSoftPot", {outer:0, middle:1});

softpot.onchange =function(press){
  console.log(press)
}
```
