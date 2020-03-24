# Logtta CO2

Logtta CO2 を使用できます。

CO2濃度を取得できます。

![](image.jpg)



## getPartsClass(name)

```javascript
// Javascript Example
const LOGTTA_CO2 = Obniz.getPartsClass('Logtta_CO2');
```

## isDevice(BleRemotePeripheral)

デバイスを発見した場合、trueを返します。

```javascript
// Javascript Example
const LOGTTA_CO2 = Obniz.getPartsClass('Logtta_CO2');
await obniz.ble.initWait();
obniz.ble.scan.start(null, { duplicate: true, duration: null });
obniz.ble.scan.onfind = (p) => {
    if (LOGTTA_CO2.isDevice(p)) {
        console.log("find");
    }
};
```

## new Logtta_CO2(peripheral)

BLEが受信した広告情報に基づいてインスタンスを作成します。


```javascript
// Javascript Example
const LOGTTA_CO2 = Obniz.getPartsClass('Logtta_CO2');
await obniz.ble.initWait();
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (LOGTTA_CO2.isDevice(peripheral) ) {
    console.log("device find");
    const device = new LOGTTA_CO2(peripheral);
  }
};

```


## [await]connectWait()

デバイスに接続します。


```javascript
// Javascript Example
const LOGTTA_CO2 = Obniz.getPartsClass('Logtta_CO2');
await obniz.ble.initWait();
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (LOGTTA_CO2.isDevice(peripheral)) {
    console.log("find");
    const device = new LOGTTA_CO2(peripheral);
    await device.connectWait();
    console.log("connected");
  }
};

```


## [await]disconnectWait()

デバイスとの接続を切断します。

```javascript
// Javascript Example
const LOGTTA_CO2 = Obniz.getPartsClass('Logtta_CO2');
await obniz.ble.initWait();
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (LOGTTA_CO2.isDevice(peripheral) ) {
    console.log("find");
    const device = new LOGTTA_CO2(peripheral);
    await device.connectWait();
    console.log("connected");
    await device.disconnectWait();
    console.log("disconnected");
  }
};

```


## onNotify =  function (data){}

データを受信したら、そのデータをコールバック関数で返します。

``startNotifyWait()``を開始した後にデバイスからデータが来るたびに呼び出されます。

```javascript
// Javascript Example
const LOGTTA_CO2 = Obniz.getPartsClass('Logtta_CO2');
await obniz.ble.initWait();
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (LOGTTA_CO2.isDevice(peripheral)) {
    console.log("find");
    const device = new LOGTTA_CO2(peripheral);
    await device.connectWait();
    console.log("connected");
        device.onNotify = (co2) => {
            console.log(`CO2 ${co2}ppm`);
        };
    device.startNotifyWait();
  }
};
```

## startNotifyWait()

Notifyを開始します。

```javascript
// Javascript Example
const LOGTTA_CO2 = Obniz.getPartsClass('Logtta_CO2');
await obniz.ble.initWait();
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (LOGTTA_CO2.isDevice(peripheral)) {
    console.log("find");
    const device = new LOGTTA_CO2(peripheral);
    await device.connectWait();
    console.log("connected");
    device.onNotify = (co2) => {
        console.log(`CO2 ${co2}ppm`);
    };
    device.startNotifyWait();
  }
};
```


## [await]getWait()

CO2濃度を取得できます。

```javascript
// Javascript Example
const LOGTTA_CO2 = Obniz.getPartsClass('Logtta_CO2');
await obniz.ble.initWait();
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (LOGTTA_CO2.isDevice(peripheral)) {
    console.log("find");
    const device = new LOGTTA_CO2(peripheral);
    await device.connectWait();
    console.log("connected");
    
    const co2 = await device.getWait();
    console.log(`CO2 ${co2}ppm`);
  }
};
```
