# μPRISM
エレックス工業株式会社製の極小IoTセンサーモジュールです

BLEデバイスのため、`wired`は使わずに`isDevice`を使います

## isDevice(peripheral)

BLEで受信したアドバタイズ情報をもとに、μPRISMかどうかを判定します

```javascript
// Javascript Example
await obniz.ble.initWait();
const U_PRISM = Obniz.getPartsClass("uPRISM");
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (U_PRISM.isDevice(peripheral)) {
    console.log("device find");
  }
};

```

## new U_PRISM(peripheral)

BLEで受信したアドバタイズ情報をもとに、インスタンスを作成します。

```javascript
// Javascript Example
await obniz.ble.initWait();
const U_PRISM = Obniz.getPartsClass("uPRISM");
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (U_PRISM.isDevice(peripheral) ) {
    console.log("device find");
    const device = new U_PRISM(peripheral);
  }
};

```


## [await]connectWait()

デバイスに接続します。


```javascript
// Javascript Example
await obniz.ble.initWait();
const U_PRISM = Obniz.getPartsClass("uPRISM");
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (U_PRISM.isDevice(peripheral)) {
    console.log("find");
    const device = new U_PRISM(peripheral);
    await device.connectWait();
    console.log("connected");
    device.onNotify = (r) => {
        console.log(
          `accel x:${r.acceleration.x} y:${r.acceleration.y} z:${r.acceleration.z}\n` +
            `geo x:${r.geomagnetic.x} y:${r.geomagnetic.y} z:${r.geomagnetic.z}\n` +
            `temp:${r.temperature}℃ humid:${r.humidity}% light:${r.ambient_light}lx pressure:${r.pressure}Pa UV index:${r.uvi} index:${r.index}\n` +
            `date ${r.time.year}/${r.time.month}/${r.time.day} ${r.time.hour}:${r.time.minute}:${r.time.second}:${r.time.micro_second}`,
        );
    };
    device.startNotifyWait();
  }
};

```


## [await]disconnectWait()
センサから切断します

```javascript
// Javascript Example
await obniz.ble.initWait();
const U_PRISM = Obniz.getPartsClass("uPRISM");
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (U_PRISM.isDevice(peripheral) ) {
    console.log("find");
    const device = new U_PRISM(peripheral);
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
await obniz.ble.initWait();
const U_PRISM = Obniz.getPartsClass("uPRISM");
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (U_PRISM.isDevice(peripheral)) {
    console.log("find");
    const device = new U_PRISM(peripheral);
    await device.connectWait();
    console.log("connected");
    device.onNotify = (r) => {
        console.log(
          `accel x:${r.acceleration.x} y:${r.acceleration.y} z:${r.acceleration.z}\n` +
            `geo x:${r.geomagnetic.x} y:${r.geomagnetic.y} z:${r.geomagnetic.z}\n` +
            `temp:${r.temperature}℃ humid:${r.humidity}% light:${r.ambient_light}lx pressure:${r.pressure}Pa UV index:${r.uvi} index:${r.index}\n` +
            `date ${r.time.year}/${r.time.month}/${r.time.day} ${r.time.hour}:${r.time.minute}:${r.time.second}:${r.time.micro_second}`,
        );
    };
    device.startNotifyWait();
  }
};
```



## startNotifyWait()

センサーデータを送信を開始するように指示をします。

```javascript
// Javascript Example
await obniz.ble.initWait();
const U_PRISM = Obniz.getPartsClass("uPRISM");
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (U_PRISM.isDevice(peripheral)) {
    console.log("find");
    const device = new U_PRISM(peripheral);
    await device.connectWait();
    console.log("connected");
    device.onNotify = (r) => {
        console.log(
          `accel x:${r.acceleration.x} y:${r.acceleration.y} z:${r.acceleration.z}\n` +
            `geo x:${r.geomagnetic.x} y:${r.geomagnetic.y} z:${r.geomagnetic.z}\n` +
            `temp:${r.temperature}℃ humid:${r.humidity}% light:${r.ambient_light}lx pressure:${r.pressure}Pa UV index:${r.uvi} index:${r.index}\n` +
            `date ${r.time.year}/${r.time.month}/${r.time.day} ${r.time.hour}:${r.time.minute}:${r.time.second}:${r.time.micro_second}`,
        );
    };
    device.startNotifyWait();
  }
};
```

