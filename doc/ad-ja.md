# Peripheral AD
ピンの電圧読み取りができます。
obnizにあるピン全てで利用可能です。
ad0(io0)からad11まであります。

adは他のペリフェラルとは独立しています。
adはioのoutputやpwmなどが使われていても同じピンで同時につかうことができます。


## start(callback)
X番ピンでの電圧計測を開始します。
X番ピンの電圧が変わったときはコールバック関数を呼び出します。

```Javascript
// Javascript Example
obniz.ad0.start(function(voltage){
  console.log("changed to "+voltage+" v")
});
```
callbackはなくても大丈夫です。
後で設定することも可能です。

```Javascript
// Javascript Example
obniz.ad0.start();
obniz.ad0.onchange = function(voltage){
  console.log("changed to "+voltage+" v")
}
```

また、関数を使わなくても値は```value```に保存されるので、それを読み出すこともできます。

```Javascript
// Javascript Example
obniz.ad0.start();
while(true) {
  console.log("changed to "+obniz.ad0.value+" v")
  await obniz.wait(1); // 1msec wait
}
```
## [await] getWait()
adを１度だけ実行して値を受け取ります。

```Javascript
// Javascript Example
// get voltage applied to io1 every seconds
var voltage = await obniz.ad0.getWait();
console.log("voltage = "+voltage+" v");
```
## end()
Xピンでの電圧計測を停止します。

```Javascript
// Javascript Example
obniz.ad0.start();
obniz.ad0.end();
```
## onchange
startした後に電圧が変化したら呼び出されるコールバック関数です。

```Javascript
// Javascript Example
obniz.ad0.start(); // start a/d at io0
obniz.ad0.onchange = function(voltage) {
  console.log("voltage = "+voltage);
}
```