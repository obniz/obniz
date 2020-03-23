# ENERTALK_TOUCH
BLE Multi sensor made by Encoard Techonologies Inc.

For BLE devices, use `isDevice` instead of` wired`

## isDevice(peripheral)

Check whether it is ENERTALK_TOUCH based on the advertisement information

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

Create an instance based on the advertisement information.

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

Connect to device.



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

Disconnect from device.

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

Get temperature value.


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

Get humidity value.


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
Get illumination value.


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

Get accelerometer value.

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