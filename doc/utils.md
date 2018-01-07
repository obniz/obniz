# Utils
obnizをプログラムから使う上で便利な関数を用意しています。

## reset()
obnizとの接続が切れても、obnizは最後の状態を保ちます。
例えばLEDをonにしたまま切れたとしてもLEDはついたままです。
もし、そういったすべての設定をもとに戻したい場合はobniz.reset()を呼ぶと
obnizを電源を入れた時と同じ状態に出来ます。

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
## resetOnDisconnect(mustReset)
obnizがWifiから切断した時に、ioの状態などをリセットするかどうかを設定できます。
通常はリセットするので、出力されている電圧などももとに戻り、pwmなども全て停止します。
この関数でそれを無効にし、リセットしないようにできます。
この設定はobnizの電源が切れない限りはずっと保持されます。
```Javascript
// Example
obniz.resetOnDisconnect(false);
```