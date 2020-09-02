# Linking Devices

[Linking Devices](https://ssl.braveridge.com/store/html/products/list.php?category_id=7) の共通ライブラリです。

![](image.jpg)

このライブラリはForkされたプロジェクトです。Thanks for [https://github.com/futomi/node-linking](https://github.com/futomi/node-linking).

## 使い方

ライブラリの詳しい使い方は親プロジェクトを参照ください [https://github.com/futomi/node-linking/blob/master/README_ja.md](https://github.com/futomi/node-linking/blob/master/README_ja.md).

## サンプルプログラム

Tomoru [https://codesandbox.io/s/linking-tomoru-l89lu](https://codesandbox.io/s/linking-tomoru-l89lu)

Sizuku 6x [https://codesandbox.io/s/linking-acc-406cj](https://codesandbox.io/s/linking-acc-406cj)

## wired(obniz)

Linkingの親クラスをobnizのデバイスに登録し、Linkingデバイスの検索・接続ができるようにします。

```javascript
// Javascript Example
const linking = obniz.wired("Linking");
await linking.init();
const device_list = await linking.discover({
  duration: 5000,
  nameFilter: "Tomoru"
});
if (device_list.length == 0) {
  console.log("not found");
  return;
}
device = device_list[0];
device.onconnectprogress = obj => {
  console.log(obj);
};
await device.connect();
await device.services.led.turnOn("Red", "Pattern1");
```



## pairing

デバイスとのペアリングは必要に応じて自動で行われます。
ペアリングキーを保存する場合は、onPairedCallbackを使用してください


```javascript
// Javascript Example
const linking = obniz.wired("Linking");
await linking.init();
const device_list = await linking.discover({
  duration: 5000,
  nameFilter: "Tomoru"
});
if (device_list.length == 0) {
  console.log("not found");
  return;
}
device = device_list[0];
device.onconnectprogress = obj => {
  console.log(obj);
};
await device.connect({
  pairingOption : {
    onPairedCallback : (keys) =>{
       //store key 
       console.log(keys);
    }
  }
});
```

また、２回目以降の接続でペアリングキーを使用する場合はconnectの際にkeyを指定して下さい

```javascript
// Javascript Example
const keys = "xxxxxx"; //stored keys

const linking = obniz.wired("Linking");
await linking.init();
const device_list = await linking.discover({
  duration: 5000,
  nameFilter: "Tomoru"
});
if (device_list.length == 0) {
  console.log("not found");
  return;
}
device = device_list[0];
device.onconnectprogress = obj => {
  console.log(obj);
};
await device.connect({
  pairingOption : {
    keys : keys  
  }
});
```
