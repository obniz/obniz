# UA651BLE
This is a blood pressure meter from A&D Corporation.


In order to measure blood pressure, the device must first be paired to get a pairing key.  

![](./image.jpg)

## isDevice(peripheral)

Judges whether or not it is UA651BLE based on the advertised information received by the BLE.

* If communication errors occur frequently, try re-pairing the UA651BLE.

```javascript
// Javascript Example
await obniz.ble.initWait();
const UA651BLE = Obniz.getPartsClass("UA651BLE");
obniz.ble.scan.onfind = async (peripheral) => {
  if (UA651BLE.isDevice(peripheral)) {
    console.log("device find");
  }
};
await obniz.ble.scan.startWait();

```

## new UA651BLE(peripheral)

Instances are created based on the advertised information received by the BLE.

```javascript
// Javascript Example
await obniz.ble.initWait();
const UA651BLE = Obniz.getPartsClass("UA651BLE");
obniz.ble.scan.onfind = async (peripheral) => {
  if (UA651BLE.isDevice(peripheral) ) {
    console.log("device find");
    const device = new UA651BLE(peripheral);
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
const UA651BLE = Obniz.getPartsClass("UA651BLE");
let key;
obniz.ble.scan.onfind = async (peripheral) => {
  if (UA651BLE.isDevice(peripheral)) {
    console.log("device find");
    const device = new UA651BLE(peripheral);
    console.log(device.isPairingMode());
  }
};
await obniz.ble.scan.startWait();
```

## [await]pairingWait()

Pair with UA651BLE and obtain a pairing key.

```javascript
// Javascript Example
await obniz.ble.initWait();
const UA651BLE = Obniz.getPartsClass("UA651BLE");
let key;
obniz.ble.scan.onfind = async (peripheral) => {
  if (UA651BLE.isDevice(peripheral) ) {
    console.log("device find");
    const device = new UA651BLE(peripheral);
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
const UA651BLE = Obniz.getPartsClass("UA651BLE");
let key = "pairing key here";
obniz.ble.scan.onfind = async (peripheral) => {
  if (UA651BLE.isDevice(peripheral)) {
    console.log("find");
    const device = new UA651BLE(peripheral);
    if(key){
      const data = await device.getDataWait(key);
      console.log(data);
    }
  }
};

await obniz.ble.scan.startWait();

```


Output format is here. Blood pressure data is in mmHg or kPa format, and Pulse rate data is in pulse/min format.

[https://obniz.github.io/obniz/obnizjs/interfaces/parts.ua651ble.ua651bleresult.html](https://obniz.github.io/obniz/obnizjs/interfaces/parts.ua651ble.ua651bleresult.html)

```json
{
  SystolicPressure_mmHg?: number; // ex) 128mmHg → 0x80 = 128, 0x00
  DiastolicPressure_mmHg?: number;
  MeanArterialPressure_mmHg?: number;
  SystolicPressure_kPa?: number; // ex) 17.6Kpa → 0xB0 = 176, 0xF0
  DiastolicPressure_kPa?: number;
  MeanArterialPressure_kPa?: number;
  bodyMoved?: number;
  cuffFitLoose?: boolean;
  irregularPulseDetected?: boolean;
  improperMeasurement?: boolean;
  PulseRate?: number;
}
```