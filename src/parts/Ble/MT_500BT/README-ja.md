# MT_500BT
日本精密測器社製の非接触温度センサです。
![](image.jpg)

## isDevice(peripheral)

BLEで受信したアドバタイズ情報をもとに、MT_500BTかどうかを判定します

```javascript
// Javascript Example
await obniz.ble.initWait();
const MT_500BT = Obniz.getPartsClass("MT_500BT");
obniz.ble.scan.onfind = async (peripheral) => {
  if (MT_500BT.isDevice(peripheral)) {
    console.log("device find");
  }
};
await obniz.ble.scan.startWait();

```

## new MT_500BT(peripheral)

BLEで受信したアドバタイズ情報をもとに、インスタンスを作成します。

```javascript
// Javascript Example
await obniz.ble.initWait();
const MT_500BT = Obniz.getPartsClass("MT_500BT");
obniz.ble.scan.onfind = async (peripheral) => {
  if (MT_500BT.isDevice(peripheral) ) {
    console.log("device find");
    const device = new MT_500BT(peripheral);
  }
};
await obniz.ble.scan.startWait();

```


## [await]connectWait()
デバイスに接続します。接続後、デバイスとの認証まで行います。


```javascript
// Javascript Example
await obniz.ble.initWait();
const MT_500BT = Obniz.getPartsClass("MT_500BT");
obniz.ble.scan.onfind = async (peripheral) => {
  if (MT_500BT.isDevice(peripheral)) {
    console.log("find");
    const device = new MT_500BT(peripheral);
    device.ondisconnect = (reason) => {
      console.log(reason)
    }
    await device.connectWait();
    console.log("connected");
    const tempInfo = await device.getTemperatureWait();
    console.log(tempInfo);
  }
};
await obniz.ble.scan.startWait();

```


## [await]disconnectWait()
センサから切断します

```javascript
// Javascript Example
await obniz.ble.initWait();
const MT_500BT = Obniz.getPartsClass("MT_500BT");
obniz.ble.scan.onfind = async (peripheral) => {
  if (MT_500BT.isDevice(peripheral) ) {
    console.log("find");
    const device = new MT_500BT(peripheral);
    await device.connectWait();
    console.log("connected");
    await device.disconnectWait();
    console.log("disconnected");
  }
};
await obniz.ble.scan.startWait();

```

## getTemperatureWait
デバイス内臓の温湿度センサの情報を取得します。

```javascript
// Javascript Example
await obniz.ble.initWait();
const MT_500BT = Obniz.getPartsClass("MT_500BT");
obniz.ble.scan.onfind = async (peripheral) => {
  if (MT_500BT.isDevice(peripheral)) {
    console.log("find");
    const device = new MT_500BT(peripheral);
    device.ondisconnect = (reason) => {
      console.log(reason)
    }
    await device.connectWait();
    console.log("connected");
    const tempInfo = await device.getTemperatureWait();
    console.log(tempInfo);
  }
};
await obniz.ble.scan.startWait();

```

返り値のフォーマットは下記の通りです。

```javascript
{ timestamp: {
     year: 2020,
     month: 8,
     day: 25,
     hour: 10,
     minute: 21,
     second: 32 
   },
  temperature: {
    body: 36.4,
    material: undefined,
    air: 28.9
  } 
}
```


デバイスに日付が設定されていない場合は、timestamp内のyear~secondはすべてundefinedになります。
