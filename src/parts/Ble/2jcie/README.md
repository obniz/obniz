# 2JCIE
enviroment sensor made by OMRON. Battery powered. Temperature, Humidity, Brightness, UV, Air Pressure, Sound Level, Acceleration, VOC.

![](image.jpg)

## isDevice(BleRemotePeripheral)

Return if is device.

```javascript
// Javascript Example
const Device = Obniz.getPartsClass('2JCIE');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (Device.isDevice(p)) {
        let data = Device.getData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait();
```

## getData(BleRemotePeripheral)

Get a data from advertisement

2In case of advertisement with localName `IM` of JCIE-BU01 (bag shape)

- temperature: (degC)
- relative_humidity: (%RH)
- light: (lx)
- uv_index: 
- barometric_pressure: (hPa)
- soud_noise: (dB)
- acceleration_x: 
- acceleration_y: 
- acceleration_z: 
- battery: (V)

2In case of advertisement with localName `Rbt` of JCIE-BL01 (USB connection)

- temperature: (degC)
- relative_humidity: (%RH)
- light: (lx)
- barometric_pressure: (hPa)
- soud_noise: (dB)
- etvoc: eTVOC(ppb)
- eco2: CO2 (ppm)


```javascript
// Javascript Example
const Device = Obniz.getPartsClass('2JCIE');
await obniz.ble.initWait();
obniz.ble.scan.onfind = (p) => {
    if (Device.isDevice(p)) {
        let data = Device.getData(p);
        console.log(data);
    }
};
await obniz.ble.scan.startWait();
```

```javascript
// Example of "Rbt" pakcet
{
    barometric_pressure: 1015.755
    eco2: 719
    etvoc: 48
    light: 241
    relative_humidity: 30.46
    soud_noise: 77.52
    temperature: 24.16
}
```


## [await] findWait()

Search device and return obniz.ble.peripheral object.
If not found, return null.

```javascript
// Javascript Example
let omron = obniz.wired('2JCIE');
let results = await omron.findWait();

if(results){
  console.log("find");
}else{
  console.log("not find");
}
```

## connectWait()

Connect to the device.
Search device automatically, but if not found, throw error.

```javascript
// Javascript Example
let omron = obniz.wired('2JCIE');
let results = await omron.findWait();

if(results){
    console.log("find");
  
    omron.ondisconnect = (reason) => {
      console.log('disconnected');
    }
    await omron.connectWait();
    let data = await omron.getLatestData();
    
    console.log(data);
}else{
    console.log("not find");
}
```


## [await]disconnectWait()
Disconnect from device.

```javascript
// Javascript Example
let omron = obniz.wired('2JCIE');
let results = await omron.findWait();

if(results){
    console.log("find");
  
    await omron.connectWait();
    let data = await omron.getLatestData();
    
    console.log(data);
    
    await omron.disconnectWait();
}else{
    console.log("not find");
}

```


## [await]getLatestData()
Get Latest Data from device.

```javascript
// Javascript Example

let omron = obniz.wired('2JCIE');
let results = await omron.findWait();

if(results){
    console.log("find");
  
    await omron.connectWait();
    let data = await omron.getLatestData();
    
    console.log(data);
    
    await omron.disconnectWait();
}else{
    console.log("not find");
}

```

The format is below.
```javascript

//example response
{
  row_number: 0,
  temperature: 22.91,   //degC
  relative_humidity: 46.46, //%RH
  light: 75, //lx
  uv_index: 0.02, 
  barometric_pressure: 1010.4000000000001, // hPa
  soud_noise: 39.42, //dB
  discomfort_index: 68.75,  
  heatstroke_risk_factor: 19,  //degC
  battery_voltage: 30.12  // V
}

```
