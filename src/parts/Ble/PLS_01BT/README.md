# PLS_01BT
It's an oxygen saturation meter made by Custom Co.
![](./image.jpg)

## isDevice(peripheral)

Determines whether PLS_01BT is a PLS_01BT based on the advertisement information received by the BLE.

```javascript
// Javascript Example
await obniz.ble.initWait();
const PLS_01BT = Obniz.getPartsClass("PLS_01BT");
obniz.ble.scan.onfind = async (peripheral) => {
  if (PLS_01BT.isDevice(peripheral)) {
    console.log("find");
  }
};
await obniz.ble.scan.startWait();

```

## new PLS_01BT(peripheral)

Instances are created based on the advertised information received by the BLE.

```javascript
// Javascript Example

await obniz.ble.initWait();
const PLS_01BT = Obniz.getPartsClass("PLS_01BT");
obniz.ble.scan.onfind = async (peripheral) => {
  if (PLS_01BT.isDevice(peripheral)) {
    console.log("find");
    const device = new PLS_01BT(peripheral);
  }
};
await obniz.ble.scan.startWait();

```


## [await]connectWait()
Connect to the device.


```javascript
// Javascript Example

await obniz.ble.initWait();
const PLS_01BT = Obniz.getPartsClass("PLS_01BT");
obniz.ble.scan.onfind = async (peripheral) => {
  if (PLS_01BT.isDevice(peripheral)) {
    console.log("find");
    const device = new PLS_01BT(peripheral);
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

Disconnect from the device.

```javascript
// Javascript Example
await obniz.ble.initWait();
const PLS_01BT = Obniz.getPartsClass("PLS_01BT");
obniz.ble.scan.onfind = async (peripheral) => {
  if (PLS_01BT.isDevice(peripheral)) {
    console.log("find");
    const device = new PLS_01BT(peripheral);
    await device.connectWait();
    console.log("connected");
    await device.disconnectWait();
    console.log("disconnected");
  }
};
await obniz.ble.scan.startWait();

```


## onmesured
Called when the measurement is complete. Usually called once a second.

```javascript
// Javascript Example
await obniz.ble.initWait();
const PLS_01BT = Obniz.getPartsClass("PLS_01BT");
obniz.ble.scan.onfind = async (peripheral) => {
  if (PLS_01BT.isDevice(peripheral)) {
    console.log("find");
    const device = new PLS_01BT(peripheral);
    await device.connectWait();
    console.log("connected");
    device.onmesured = (data) => {
      console.log(data);
    };
  }
};
await obniz.ble.scan.startWait();

```

Output format is here.

```
 {
  pulseRate: number; [bpm]
  bloodOxygenLevel: number; [%]
  perfusionIndex: number; 
}
```
