# RS_SEEK3
Loss prevention tag made by RATOC Systems,Inc

![](./image.jpg)

## isDevice(peripheral)


Check whether it is RS_SEEK3 based on the advertisement information

```javascript
// Javascript Example
await obniz.ble.initWait();
const RS_Seek3 = Obniz.getPartsClass("RS_Seek3");
obniz.ble.scan.onfind = async (peripheral) => {
  if (RS_Seek3.isDevice(peripheral)) {
    console.log("device find");
  }
};
await obniz.ble.scan.startWait();

```

## new RS_Seek3(peripheral)

Create an instance based on the advertisement information.

```javascript
// Javascript Example
await obniz.ble.initWait();
const RS_Seek3 = Obniz.getPartsClass("RS_Seek3");
obniz.ble.scan.onfind = async (peripheral) => {
  if (RS_Seek3.isDevice(peripheral) ) {
    console.log("device find");
    const device = new RS_Seek3(peripheral);
  }
};
await obniz.ble.scan.startWait();

```


## [await]connectWait()

Connect to device.


```javascript
// Javascript Example
await obniz.ble.initWait();
const RS_Seek3 = Obniz.getPartsClass("RS_Seek3");
obniz.ble.scan.onfind = async (peripheral) => {
  if (RS_Seek3.isDevice(peripheral)) {
    console.log("find");
    const device = new RS_Seek3(peripheral);
    device.ondisconnect = (reason) => {
      console.log(reason)
    }
    await device.connectWait();
    console.log("connected");
    device.onpressed = () => {
      console.log("pressed");
    };
    console.log(await device.getTempHumidWait());
  }
};
await obniz.ble.scan.startWait();

```


## [await]disconnectWait()

Disconnect from device.

```javascript
// Javascript Example
await obniz.ble.initWait();
const RS_Seek3 = Obniz.getPartsClass("RS_Seek3");
obniz.ble.scan.onfind = async (peripheral) => {
  if (RS_Seek3.isDevice(peripheral) ) {
    console.log("find");
    const device = new RS_Seek3(peripheral);
    await device.connectWait();
    console.log("connected");
    await device.disconnectWait();
    console.log("disconnected");
  }
};
await obniz.ble.scan.startWait();

```


## onpressed

Callback when the button is pressed.
Does not support when released.

```javascript
// Javascript Example
await obniz.ble.initWait();
const RS_Seek3 = Obniz.getPartsClass("RS_Seek3");
obniz.ble.scan.onfind = async (peripheral) => {
  if (RS_Seek3.isDevice(peripheral)) {
    console.log("find");
    const device = new RS_Seek3(peripheral);
    await device.connectWait();
    console.log("connected");
    device.onpressed = () => {
      console.log("pressed");
    };
    console.log(await device.getTempHumidWait());
  }
};
await obniz.ble.scan.startWait();

```


## getTempHumidWait
Get temperature and humidity value built into the device.

```javascript
// Javascript Example
await obniz.ble.initWait();
const RS_Seek3 = Obniz.getPartsClass("RS_Seek3");
obniz.ble.scan.onfind = async (peripheral) => {
  if (RS_Seek3.isDevice(peripheral) && isFirst) {
    console.log("find");
    const device = new RS_Seek3(peripheral);
    await device.connectWait();
    console.log("connected");
    console.log(await device.getTempHumidWait());
  }
};
await obniz.ble.scan.startWait();


```
