# Logtta AD

BLE経由で利用できるAD変換器です。

![](image.jpg)




## isDevice(BleRemotePeripheral)

デバイスを発見した場合、trueを返します。

```javascript
// Javascript Example
const LOGTTA_AD = Obniz.getPartsClass('Logtta_AD');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (LOGTTA_AD.isDevice(p)) {
        let data = LOGTTA_AD.getData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait(null, { duplicate: true, duration: null });
```

## new LOGTTA_AD(peripheral)

BLEが受信した広告情報に基づいてインスタンスを作成します。


```javascript
// Javascript Example
const LOGTTA_AD = Obniz.getPartsClass('Logtta_AD');
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
  if (LOGTTA_AD.isDevice(peripheral) ) {
    console.log("device find");
    const device = new LOGTTA_AD(peripheral);
  }
};
await obniz.ble.scan.startWait();

```


## [await]connectWait()

デバイスに接続します。

```javascript
// Javascript Example
const LOGTTA_AD = Obniz.getPartsClass('Logtta_AD');
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
  if (LOGTTA_AD.isDevice(peripheral)) {
    console.log("find");
    const device = new LOGTTA_AD(peripheral);
    device.ondisconnect = (reason) => {
      console.log(reason)
    }
    await device.connectWait();
    console.log("connected");
  }
};
await obniz.ble.scan.startWait();

```


## [await]disconnectWait()

デバイスとの接続を切断します。

```javascript
// Javascript Example
const LOGTTA_AD = Obniz.getPartsClass('Logtta_AD');
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
  if (LOGTTA_AD.isDevice(peripheral) ) {
    console.log("find");
    const device = new LOGTTA_AD(peripheral);
    await device.connectWait();
    console.log("connected");
    await device.disconnectWait();
    console.log("disconnected");
  }
};
await obniz.ble.scan.startWait();

```


## onNotify =  function (data){}

データを受信したら、そのデータをコールバック関数で返します。

``startNotifyWait()``を開始した後にデバイスからデータが来るたびに呼び出されます。

```javascript
// Javascript Example
const LOGTTA_AD = Obniz.getPartsClass('Logtta_AD');
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
  if (LOGTTA_AD.isDevice(peripheral)) {
    console.log("find");
    const device = new LOGTTA_AD(peripheral);
    await device.connectWait();
    console.log("connected");
    device.onNotify = (data) => {
        console.log( `ampere:${data.ampere} volt:${data.volt} count:${data.count}` );
    };
    device.startNotifyWait();
  }
};
await obniz.ble.scan.startWait();
```

## startNotifyWait()

センサーデータを送信を開始するように指示をします。

```javascript
// Javascript Example
const LOGTTA_AD = Obniz.getPartsClass('Logtta_AD');
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
  if (LOGTTA_AD.isDevice(peripheral)) {
    console.log("find");
    const device = new LOGTTA_AD(peripheral);
    await device.connectWait();
    console.log("connected");
    device.onNotify = (data) => {
        console.log( `ampere:${data.ampere} volt:${data.volt} count:${data.count}` );
    };
    device.startNotifyWait();
  }
};
await obniz.ble.scan.startWait();
```


## [await]getAllWait()

デバイスからすべてのセンサーデータを取得します。

```javascript
// Javascript Example
const LOGTTA_AD = Obniz.getPartsClass('Logtta_AD');
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
  if (LOGTTA_AD.isDevice(peripheral)) {
    console.log("find");
    const device = new LOGTTA_AD(peripheral);
    await device.connectWait();
    console.log("connected");
    
    const data = await device.getAllWait();
    console.log(`AD get volt ${data.volt} or ampere ${data.ampere} count ${data.count}`);
  }
};
await obniz.ble.scan.startWait();
```

取得できるデータフォーマットは次の通りです。

```json
// example response
{
  "ampere": 5, // mA
  "volt": 3,   // mV
  "count": 10  // count
}
```

## [await]getAmpereWait()

デバイスから電流値を取得します。

4mA - 20mAの間で取得できます。

```javascript
// Javascript Example
const LOGTTA_AD = Obniz.getPartsClass('Logtta_AD');
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
  if (LOGTTA_AD.isDevice(peripheral)) {
    console.log("find");
    const device = new LOGTTA_AD(peripheral);
    await device.connectWait();
    console.log("connected");
    
    const data = await device.getAmpereWait();
    console.log(`AD data ${data}`);
  }
};
await obniz.ble.scan.startWait();
```


## [await]getVoltWait()

デバイスから電圧値を取得します。

1V - 5Vの間でデータを取得できます。

```javascript
// Javascript Example
const LOGTTA_AD = Obniz.getPartsClass('Logtta_AD');
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
  if (LOGTTA_AD.isDevice(peripheral)) {
    console.log("find");
    const device = new LOGTTA_AD(peripheral);
    await device.connectWait();
    console.log("connected");
    
    const data = await device.getVoltWait();
    console.log(`AD data ${data}`);
  }
};
await obniz.ble.scan.startWait();
```


## [await]getCountWait()

デバイスからカウント情報を取得できます。

```javascript
// Javascript Example
const LOGTTA_AD = Obniz.getPartsClass('Logtta_AD');
await obniz.ble.initWait();
obniz.ble.scan.onfind = async (peripheral) => {
  if (LOGTTA_AD.isDevice(peripheral)) {
    console.log("find");
    const device = new LOGTTA_AD(peripheral);
    await device.connectWait();
    console.log("connected");
    
    const data = await device.getCountWait();
    console.log(`AD data ${data}`);
  }
};
await obniz.ble.scan.startWait();
```
