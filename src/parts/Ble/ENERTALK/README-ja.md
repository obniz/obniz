# ENERTALK_TOUCH
エンコアード社製のマルチセンサです

BLEデバイスのため、`wired`は使わずに`isDevice`を使います

## isDevice(peripheral)

BLEで受信したアドバタイズ情報をもとに、ENERTALK_TOUCH かどうかを判定します

```javascript
// Javascript Example
await obniz.ble.initWait();
const ENERTALK_TOUCH = Obniz.getPartsClass("ENERTALK_TOUCH");
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (ENERTALK_TOUCH.isDevice(peripheral)) {
    console.log("find");
  
  }
};

```

## new ENERTALK_TOUCH(peripheral)

BLEで受信したアドバタイズ情報をもとに、インスタンスを作成します。

```javascript
// Javascript Example
await obniz.ble.initWait();
const ENERTALK_TOUCH = Obniz.getPartsClass("ENERTALK_TOUCH");
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (ENERTALK_TOUCH.isDevice(peripheral)) {
    console.log("find");
    const device = new ENERTALK_TOUCH(peripheral);
  }
};


```


## [await]connectWait()
デバイスに接続します。


```javascript
// Javascript Example
await obniz.ble.initWait();
const ENERTALK_TOUCH = Obniz.getPartsClass("ENERTALK_TOUCH");
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (ENERTALK_TOUCH.isDevice(peripheral)) {
    console.log("find");
    const device = new ENERTALK_TOUCH(peripheral);
    await device.connectWait();
    console.log("connected");
  }
};


```


## [await]disconnectWait()
センサから切断します

```javascript
// Javascript Example
await obniz.ble.initWait();
const ENERTALK_TOUCH = Obniz.getPartsClass("ENERTALK_TOUCH");
obniz.ble.scan.start();
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


```


## getTemperature
温度を計測します。

```javascript

// Javascript Example
await obniz.ble.initWait();
const ENERTALK_TOUCH = Obniz.getPartsClass("ENERTALK_TOUCH");
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (ENERTALK_TOUCH.isDevice(peripheral)) {
    console.log("find");
    const device = new ENERTALK_TOUCH(peripheral);
    await device.connectWait();
    console.log("connected");
    const temperature = await device.getTemperature();
    console.log(temperature);
  }
};

```

## getHumidity
湿度を計測します。

```javascript

// Javascript Example
await obniz.ble.initWait();
const ENERTALK_TOUCH = Obniz.getPartsClass("ENERTALK_TOUCH");
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (ENERTALK_TOUCH.isDevice(peripheral)) {
    console.log("find");
    const device = new ENERTALK_TOUCH(peripheral);
    await device.connectWait();
    console.log("connected");
    const humid = await device.getHumidity();
    console.log(humid);
  }
};

```



## getIllumination
湿度を計測します。

```javascript

// Javascript Example
await obniz.ble.initWait();
const ENERTALK_TOUCH = Obniz.getPartsClass("ENERTALK_TOUCH");
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (ENERTALK_TOUCH.isDevice(peripheral)) {
    console.log("find");
    const device = new ENERTALK_TOUCH(peripheral);
    await device.connectWait();
    console.log("connected");
    const lux = await device.getIllumination();
    console.log(lux);
  }
};

```


## getAccelerometer
加速度を計測します。

```javascript

// Javascript Example
await obniz.ble.initWait();
const ENERTALK_TOUCH = Obniz.getPartsClass("ENERTALK_TOUCH");
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (ENERTALK_TOUCH.isDevice(peripheral)) {
    console.log("find");
    const device = new ENERTALK_TOUCH(peripheral);
    await device.connectWait();
    console.log("connected");
    const accel = await device.getAccelerometer();
    console.log(accel.x, accel.y, accel.z );
  }
};

```