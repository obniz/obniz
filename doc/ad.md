# Peripheral AD
ad変換モジュールです。
Obnizにあるピン全てで利用可能です。
ad0からad11まであります。

## start(callback)

X番ピンでのa/d変換をスタートします。
startを呼ぶと、ピンはa/d変換モードになり、end()により停止させるまで常にa/d変換を行います。
そして、値が変わるごとにcallbackを呼び出します。

```Javascript
// Example
// start a/d on IO0
obniz.ad0.start(function(voltage){
  console.log("changed to "+voltage+" v")
});
callbackはなくても大丈夫です。
その場合、値はvalueを読み出すか、後でonchangedにcallbackを登録することになります。
```



```Javascript
// Example
// start a/d on IO0
obniz.ad0.start();
obniz.ad0.onchange = function(voltage){
  console.log("changed to "+voltage+" v")
}
```


```Javascript
// Example
// start a/d on IO0
obniz.ad0.start();
while(true) {
  console.log("changed to "+obniz.ad0.value+" v")
  await obniz.wait(1); // 1msec wait
}
```
## [await] getWait()

adを１度だけ実行して値を受け取ります。

```Javascript
// Example
// get voltage applied to io1 every seconds
var voltage = await obniz.ad0.getWait();
console.log("voltage = "+voltage+" v");
```
## end()

Xピンでの常時ad変換を停止します。停止後そのピンは入力ピンとなります。

```Javascript
// Example
obniz.ad0.start();
obniz.ad0.stop();
```
## onchange

startした後に電圧が変化したら呼び出される。

```Javascript
// Example
obniz.ad0.start(); // start a/d at io0
obniz.ad0.onchange = function(voltage) {
  console.log("voltage = "+voltage);
}
```