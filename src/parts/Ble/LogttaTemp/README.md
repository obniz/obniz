# Logtta TH
Look for Logtta TH and get the data.

![](image.jpg)



## getPartsClass(name)

```javascript
// Javascript Example
const Logtta_TH = Obniz.getPartsClass('Logtta_TH');
```

## isDevice(BleRemotePeripheral)

Returns true if a device was found.

```javascript
// Javascript Example
const Logtta_TH = Obniz.getPartsClass('Logtta_TH');
await obniz.ble.initWait();
obniz.ble.scan.start(null, { duplicate: true, duration: null });
obniz.ble.scan.onfind = (p) => {
    if (Logtta_TH.isDevice(p)) {
        console.log("find");
    }
};
```

## new Logtta_TH(peripheral)

Create an instance based on the advertisement information received by BLE.

```javascript
// Javascript Example
const Logtta_TH = Obniz.getPartsClass('Logtta_TH');
await obniz.ble.initWait();
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (Logtta_TH.isDevice(peripheral) ) {
    console.log("device find");
    const device = new Logtta_TH(peripheral);
  }
};

```


## [await]connectWait()

Connect to the device.

```javascript
// Javascript Example
const Logtta_TH = Obniz.getPartsClass('Logtta_TH');
await obniz.ble.initWait();
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (Logtta_TH.isDevice(peripheral)) {
    console.log("find");
    const device = new Logtta_TH(peripheral);
    await device.connectWait();
    console.log("connected");
  }
};

```


## [await]disconnectWait()

Disonnect to the device.

```javascript
// Javascript Example
const Logtta_TH = Obniz.getPartsClass('Logtta_TH');
await obniz.ble.initWait();
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (Logtta_TH.isDevice(peripheral) ) {
    console.log("find");
    const device = new Logtta_TH(peripheral);
    await device.connectWait();
    console.log("connected");
    await device.disconnectWait();
    console.log("disconnected");
  }
};

```


## onNotify =  function (data){}

When data is received, return the data in a callback function.

Called every time data comes from the device after starting `` startNotifyWait () ``.

```javascript
// Javascript Example
const Logtta_TH = Obniz.getPartsClass('Logtta_TH');
await obniz.ble.initWait();
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (Logtta_TH.isDevice(peripheral)) {
    console.log("find");
    const device = new Logtta_TH(peripheral);
    await device.connectWait();
    console.log("connected");
    device.onNotify = (data) => {
        console.log(`temperature ${data.temperature} humidity ${data.humidity}`);
    };
    device.startNotifyWait();
  }
};
```

## startNotifyWait()

Instructs to start sending sensor data.

```javascript
// Javascript Example
const Logtta_TH = Obniz.getPartsClass('Logtta_TH');
await obniz.ble.initWait();
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (Logtta_TH.isDevice(peripheral)) {
    console.log("find");
    const device = new Logtta_TH(peripheral);
    await device.connectWait();
    console.log("connected");
    device.onNotify = (data) => {
        console.log(`temperature ${data.temperature} humidity ${data.humidity}`);
    };
    device.startNotifyWait();
  }
};
```


## [await]getAllWait()

Get All Data from device.

```javascript
// Javascript Example
const Logtta_TH = Obniz.getPartsClass('Logtta_TH');
await obniz.ble.initWait();
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (Logtta_TH.isDevice(peripheral)) {
    console.log("find");
    const device = new Logtta_TH(peripheral);
    await device.connectWait();
    console.log("connected");
    
    const data = await device.getAllWait();
    console.log(`temperature ${data.temperature} humidity ${data.humidity}`);
  }
};
```

The format is below.

```json
// example response
{
  "temperature": 20,
  "humidity": 30, 
}
```

## [await]getTemperatureWait()

Get temperature Data from device.

```javascript
// Javascript Example
const LOGTTA_AD = Obniz.getPartsClass('Logtta_AD');
await obniz.ble.initWait();
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (LOGTTA_AD.isDevice(peripheral)) {
    console.log("find");
    const device = new LOGTTA_AD(peripheral);
    await device.connectWait();
    console.log("connected");
    
    const temperature = await device.getTemperatureWait();
    console.log(`temperature ${temperature}`);
  }
};
```


## [await]getHumidityWait()

Get humidity Data from device.

```javascript
// Javascript Example
const LOGTTA_AD = Obniz.getPartsClass('Logtta_AD');
await obniz.ble.initWait();
obniz.ble.scan.start();
obniz.ble.scan.onfind = async (peripheral) => {
  if (LOGTTA_AD.isDevice(peripheral)) {
    console.log("find");
    const device = new LOGTTA_AD(peripheral);
    await device.connectWait();
    console.log("connected");
    
    const humidity = await device.getHumidityWait();
    console.log(`humidity ${humidity}`);
  }
};
```

