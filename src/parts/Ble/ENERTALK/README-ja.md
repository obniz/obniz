# ENERTALK_TOUCH
エンコアード ジャパン株式会社製のマルチセンサです

- 温度
- 湿度
- 照度
- 加速度(3軸)

を計測できます。

![](./image.jpg)

## isDevice(peripheral)

BLEで受信したアドバタイズ情報をもとに、ENERTALK_TOUCH かどうかを判定します

```javascript
// Javascript Example
await obniz.ble.initWait();
const ENERTALK_TOUCH = Obniz.getPartsClass("ENERTALK_TOUCH");
obniz.ble.scan.onfind = async (peripheral) => {
  if (ENERTALK_TOUCH.isDevice(peripheral)) {
    console.log("find");
  
  }
};
await obniz.ble.scan.startWait();

```

## new ENERTALK_TOUCH(peripheral)

BLEで受信したアドバタイズ情報をもとに、インスタンスを作成します。

```javascript
// Javascript Example
await obniz.ble.initWait();
const ENERTALK_TOUCH = Obniz.getPartsClass("ENERTALK_TOUCH");
obniz.ble.scan.onfind = async (peripheral) => {
  if (ENERTALK_TOUCH.isDevice(peripheral)) {
    console.log("find");
    const device = new ENERTALK_TOUCH(peripheral);
  }
};
await obniz.ble.scan.startWait();

```


## [await]connectWait()
デバイスに接続します。


```javascript
// Javascript Example
await obniz.ble.initWait();
const ENERTALK_TOUCH = Obniz.getPartsClass("ENERTALK_TOUCH");
obniz.ble.scan.onfind = async (peripheral) => {
  if (ENERTALK_TOUCH.isDevice(peripheral)) {
    console.log("find");
    const device = new ENERTALK_TOUCH(peripheral);
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
センサから切断します

```javascript
// Javascript Example
await obniz.ble.initWait();
const ENERTALK_TOUCH = Obniz.getPartsClass("ENERTALK_TOUCH");
obniz.ble.scan.onfind = async (peripheral) => {
  if (ENERTALK_TOUCH.isDevice(peripheral)) {
    console.log("find");
    const device = new ENERTALK_TOUCH(peripheral);
    await device.connectWait();
    console.log("connected");
    await device.disconnectWait();
    console.log("disconnected");
  }
};
await obniz.ble.scan.startWait();


```


## getTemperatureWait()
温度を計測します。

```javascript

// Javascript Example
await obniz.ble.initWait();
const ENERTALK_TOUCH = Obniz.getPartsClass("ENERTALK_TOUCH");
obniz.ble.scan.onfind = async (peripheral) => {
  if (ENERTALK_TOUCH.isDevice(peripheral)) {
    console.log("find");
    const device = new ENERTALK_TOUCH(peripheral);
    await device.connectWait();
    console.log("connected");
    const temperature = await device.getTemperatureWait();
    console.log(temperature);
  }
};
await obniz.ble.scan.startWait();

```

## getHumidityWait()
湿度を計測します。

```javascript

// Javascript Example
await obniz.ble.initWait();
const ENERTALK_TOUCH = Obniz.getPartsClass("ENERTALK_TOUCH");
obniz.ble.scan.onfind = async (peripheral) => {
  if (ENERTALK_TOUCH.isDevice(peripheral)) {
    console.log("find");
    const device = new ENERTALK_TOUCH(peripheral);
    await device.connectWait();
    console.log("connected");
    const humid = await device.getHumidityWait();
    console.log(humid);
  }
};
await obniz.ble.scan.startWait();

```



## getIlluminationWait()
照度を計測します。

```javascript

// Javascript Example
await obniz.ble.initWait();
const ENERTALK_TOUCH = Obniz.getPartsClass("ENERTALK_TOUCH");
obniz.ble.scan.onfind = async (peripheral) => {
  if (ENERTALK_TOUCH.isDevice(peripheral)) {
    console.log("find");
    const device = new ENERTALK_TOUCH(peripheral);
    await device.connectWait();
    console.log("connected");
    const lux = await device.getIlluminationWait();
    console.log(lux);
  }
};
await obniz.ble.scan.startWait();

```


## getAccelerometerWait()
加速度を計測します。

```javascript

// Javascript Example
await obniz.ble.initWait();
const ENERTALK_TOUCH = Obniz.getPartsClass("ENERTALK_TOUCH");
obniz.ble.scan.onfind = async (peripheral) => {
  if (ENERTALK_TOUCH.isDevice(peripheral)) {
    console.log("find");
    const device = new ENERTALK_TOUCH(peripheral);
    await device.connectWait();
    console.log("connected");
    const accel = await device.getAccelerometerWait();
    console.log(accel.x, accel.y, accel.z );
  }
};
await obniz.ble.scan.startWait();

```


## [await]batteryService.getBatteryLevelWait()

Get battery level. 0-100 [%] will be returned according to the remaining level.


```javascript
// Javascript Example
await obniz.ble.initWait();
const ENERTALK_TOUCH = Obniz.getPartsClass("ENERTALK_TOUCH");
obniz.ble.scan.onfind = async (peripheral) => {
  if (ENERTALK_TOUCH.isDevice(peripheral)) {
    console.log("find");
    const device = new ENERTALK_TOUCH(peripheral);
    await device.connectWait();
    console.log("connected");
    const batteryLevel = await device.batteryService.getBatteryLevelWait();
    console.log(`batteryLevel ${batteryLevel}% `);

  }
};
await obniz.ble.scan.startWait();
```

