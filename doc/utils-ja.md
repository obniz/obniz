# Utils
obnizをプログラムから使う上で便利な関数を用意しています。

## reset()
強制的にobnizを電源を入れた時と同じ状態に出来ます。

```Javascript
// Example
obniz = new Obniz("1234-5678");
obniz.onconnect = function() {
  obniz.reset();
}
```

## repeat(callback)
obnizがつながっている間に繰り返し実行したい関数を渡すと実行します。
obniz切断時には呼ばれなくなります。
待つための関数を呼ばなくてもスレッドがフリーズすることはありません。
javascript言語から考えると、無限にループするよりはcallback関数を利用することをおすすめします。
```Javascript
// Example
obniz.ad0.start();
obniz.repeat(function(){
  if (obniz.ad0.value > 2.5) {
    obniz.io0.output(true);
  } else {
    obniz.io0.output(false);
  }
})
```
## [await] wait(ms)
ms(ミリ秒)で指定された値だけ停止します。
await を利用することでその時間だけ実際にプログラムを停止させることが可能です。
```Javascript
// Example
console.log("before");
await obniz.wait(1000);
console.log("after 1 second");
```
## freeze(ms)
obnizをmsだけ停止させます。
wait()との違いはwait()ではjavascriptの方がmsだけ停止しますが、freeze()ではobnizの方がmsだけ停止します。
なのでfreeze(1000)を呼び出してもプログラムはその関数をすぐに抜けます。

For example
```Javascript
console.log("before");
obniz.io0.output(true);
obniz.freeze(1000);
obniz.io0.output(false);
console.log("after 0 second");
```
"After 0 second"はbeforeが表示されてからすぐに表示されます。1秒後ではありません。
しかし、obnizは止まるのでio0を1秒だけonにすることになります。

## keepWorkingAtOffline(working)
obnizがWifiから切断した時に、ioの状態などをリセットするかどうかを設定できます。
通常はリセットするので、出力されている電圧などももとに戻り、pwmなども全て停止します。
この関数でそれを無効にし、リセットしないようにできます。
この設定はobnizの電源が切れない限りはずっと保持されます。
```Javascript
// Example
obniz.keepWorkingAtOffline(false);
```

## resetOnDisconnect(reset)
obnizはユーザーがobniz cloudへのwebsocketを切断するとリセットするようになっています。
通常はリセットするので、出力されている電圧などももとに戻り、pwmなども全て停止します。
この関数でそれを無効にし、リセットしないようにできます。
この設定はユーザーのwebsocketが切断されるまで保持されます。
```Javascript
// Example
obniz.resetOnDisconnect(false);
```

## util.createCanvasContext(width, height);
CanvasContextを作成します。
Canvas DOMをbodyに追加してcontextを返却します(htmlにおいて)

```Javascript
// Example
const ctx = obniz.util.createCanvasContext(128, 64);
ctx.font = "9px sans-serif";
ctx.fillText('Hello', 0, 7);
```

## debugprint
obniz.jsの内部のログを出力するかどうかを設定できます。デフォルトでfalseです。

```Javascript
// Example
obniz = new Obniz("1234-5678");
obniz.debugprint = true;
obniz.onconnect = function() {
  obniz.reset();
}
```