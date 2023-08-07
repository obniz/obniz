# BST_01A
温湿度センサー

![](./image.jpg)

電源投入後20秒後からデータ送信を開始します。
advertisementは2秒ごとの間隔で1.5年の電池寿命があります。


## isDevice(peripheral)

BLEのadvertisementからこの機器かどうかの判定を行います

```javascript
// Javascript Example
await obniz.ble.initWait();
const BST_01A = Obniz.getPartsClass("BST_01A");
obniz.ble.scan.onfind = async (peripheral) => {
  if (BST_01A.isDevice(peripheral)) {
    console.log("device found");
  }
};
await obniz.ble.scan.startWait();

```


## getData()

温湿度などセンサーの値を取得します。

```javascript
// Javascript Example
await obniz.ble.initWait();
const BST_01A = Obniz.getPartsClass("BST_01A")
obniz.ble.scan.onfind = (peripheral) => {
  if (BST_01A.isDevice(peripheral)) {
    console.log(BST_01A.getData(peripheral)) 
  }
};
await obniz.ble.scan.startWait();
```

返り値は以下の通り。
センサー側でエラーを検出している場合は`'error'`という文字列が返ります

```javascript
{
  id: string
  battery: number;
  temperature: number | 'error';
  humidity: number | 'error';
}
```

