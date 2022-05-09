# UT201BLE
This is a thermometer from A&D Corporation.  

In order to measure body temperature, the device must first be paired to get a pairing key.  

![](./image.jpg)

## isDevice(peripheral)

Judges whether or not it is UT201BLE based on the advertised information received by the BLE.
```javascript
// Javascript Example
await obniz.ble.initWait();
const UT201BLE = Obniz.getPartsClass("UT201BLE");
obniz.ble.scan.onfind = async (peripheral) => {
  if (UT201BLE.isDevice(peripheral)) {
    console.log("device find");
  }
};
await obniz.ble.scan.startWait();

```

## new UT201BLE(peripheral)

Instances are created based on the advertised information received by the BLE.

```javascript
// Javascript Example
await obniz.ble.initWait();
const UT201BLE = Obniz.getPartsClass("UT201BLE");
obniz.ble.scan.onfind = async (peripheral) => {
  if (UT201BLE.isDevice(peripheral) ) {
    console.log("device find");
    const device = new UT201BLE(peripheral);
  }
};
await obniz.ble.scan.startWait();

```

## isPairingMode()

Based on the advertisement information received by BLE, it determines whether it is in pairing mode or measurement mode.  
In case of pairing mode, true is returned.

```javascript
// Javascript Example
await obniz.ble.initWait();
const UT201BLE = Obniz.getPartsClass("UT201BLE");
let key;
obniz.ble.scan.onfind = async (peripheral) => {
  if (UT201BLE.isDevice(peripheral)) {
    console.log("device find");
    const device = new UT201BLE(peripheral);
    console.log(device.isPairingMode());
  }
};
await obniz.ble.scan.startWait();
```

## [await]pairingWait()

Pair with UT201BLE and obtain a pairing key.

```javascript
// Javascript Example
await obniz.ble.initWait();
const UT201BLE = Obniz.getPartsClass("UT201BLE");
let key;
obniz.ble.scan.onfind = async (peripheral) => {
  if (UT201BLE.isDevice(peripheral) ) {
    console.log("device find");
    const device = new UT201BLE(peripheral);
    if(device.isPairingMode()){
      key = await device.pairingWait();
      console.log(key);
    };
  }
};
await obniz.ble.scan.startWait();

```


## [await]getDataWait()

Connects to the device and collects data in batches.  
The only data that can be retrieved is the data that the device has not yet sent.  

A pairing key is required to get data.  

After the data is sent, the connection to the device is automatically terminated.  

```javascript
// Javascript Example
await obniz.ble.initWait();
const UT201BLE = Obniz.getPartsClass("UT201BLE");
let key = "pairing key here";
obniz.ble.scan.onfind = async (peripheral) => {
  if (UT201BLE.isDevice(peripheral)) {
    console.log("find");
    const device = new UT201BLE(peripheral);
    if(key){
      const data = await device.getDataWait(key);
      console.log(data);
    }
    // {
    //     fahrenheit?: number;
    //     celsius?: number;
    //     date?: {
    //       year: number;
    //       month: number;
    //       day: number;
    //       hour: number;
    //       minute: number;
    //       second: number;
    //     };
    //     temperatureType?: string;
    //   }
  }
};

await obniz.ble.scan.startWait();

```


Output format is here. temperature data is in fahrenheit or celsius.

```json
{
  fahrenheit?: number;
  celsius?: number;
  date?: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
  };
  temperatureType?: string;
}
```
