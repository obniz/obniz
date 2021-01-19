# HEM_9200T
This is a blood pressure sensor from OMRON Corporation.

![](./image.jpg)
## isDevice(peripheral)

Judges whether or not it is HEM_9200T based on the advertised information received by the BLE.
```javascript
// Javascript Example
await obniz.ble.initWait();
const HEM_9200T = Obniz.getPartsClass("HEM_9200T");
obniz.ble.scan.onfind = async (peripheral) => {
  if (HEM_9200T.isDevice(peripheral)) {
    console.log("device find");
  }
};
await obniz.ble.scan.startWait();

```

## new HEM_9200T(peripheral,  {timezoneOffsetMinute, passkey})

Instances are created based on the advertised information received by the BLE.

```javascript
// Javascript Example
await obniz.ble.initWait();
const HEM_9200T = Obniz.getPartsClass("HEM_9200T");
obniz.ble.scan.onfind = async (peripheral) => {
  if (HEM_9200T.isDevice(peripheral) ) {
    console.log("device find");
    const device = new HEM_9200T(peripheral, {timezoneOffsetMinute: 9*60, passkey: 208729 });
  }
};
await obniz.ble.scan.startWait();

```


## [await]getDataWait()

Connects to the device and collects data in batches.
The only data that can be retrieved is the data that the device has not yet sent.

After the data is sent, the connection to the device is automatically terminated.



```javascript
// Javascript Example
await obniz.ble.initWait();
const HEM_9200T = Obniz.getPartsClass("HEM_9200T");
obniz.ble.scan.onfind = async (peripheral) => {
  if (HEM_9200T.isDevice(peripheral)) {
    console.log("find");
    const device = new HEM_9200T(peripheral, {timezoneOffsetMinute: 9*60, passkey: 208729 });
    
    const data = await device.getDataWait();
    
    console.log(data);
   
  }
};
await obniz.ble.scan.startWait();

```


Output format is here. 

```json
 {
  bloodPressure?: {
    systolic: number;
    diastolic: number;
    meanArterialPressure: number;
    unit: "mmHg";
  };
  date?: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
  };
  pulseRate?: number;
  userId?: number;
  measurementStatus?: HEM_9200TMesurementStatus[];
}
```
