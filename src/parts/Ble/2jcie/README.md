# 2JCIE
enviroment sensor made by OMRON. Battery powered. Temperature, Humidity, Brightness, UV, Air Pressure, Sound Level, Acceleration, VOC.

The 2JCIE-BL01 (bag shape) and 2JCIE-BU01 (USB connection) are available in two different shapes (and each has its mode). (Also, each of them has its mode.) The data that can be acquired and the corresponding functions are different for each of them, so please check before using them.

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

2In case of advertisement with localName `IM` of 2JCIE-BL01 (bag shape)

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

2In case of advertisement with localName `Rbt` of 2JCIE-BU01 (USB connection)

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

Connect to the device.Search device automatically, but if not found, throw error.
The following shapes & modes are supported.  

* 2JCIE-BL01 (bag shape) mode with localName `Env`
* 2JCIE-BU01 (USB connection) mode with localName `Rbt`


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
    let data = await omron.getLatestDataBAGWait();
    
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
    let data = await omron.getLatestDataBAGWait();
    
    console.log(data);
    
    await omron.disconnectWait();
}else{
    console.log("not find");
}

```


## [await]getLatestDataWait()
Get the latest data of the sensor of 2JCIE-BL01 (bag shape).

```javascript
// Javascript Example

let omron = obniz.wired('2JCIE');
let results = await omron.findWait();

if(results){
    console.log("find");
  
    await omron.connectWait();
    let data = await omron.getLatestDataWait();
    
    console.log(data);
    
    await omron.disconnectWait();
}else{
    console.log("not find");
}

```   

The return format is below.

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

## [await]getLatestSensorDataUSBWait()
Get the latest sensor data from 2JCIE-BU01 (USB connection).

```javascript
// Javascript Example

let omron = obniz.wired('2JCIE');
let results = await omron.findWait();

if(results){
    console.log("find");
  
    await omron.connectWait();
    let data = await omron.getLatestSensorDataUSBWait();
    
    console.log(data);
    
    await omron.disconnectWait();
}else{
    console.log("not find");
}

```   

The return format is below. 

```javascript
//example response
{
  sequence_number: 0,
  temperature: 22.91,   //degC
  relative_humidity: 46.46, //%RH
  light: 75, //lx
  barometric_pressure: 1010.4000000000001, // hPa
  soud_noise: 39.42, //dB
  etvoc: 1463,	//ppb
  eco2: 2353	//ppm
}

```


## [await]getLatestCalculationDataUSBWait()
Get the latest index data and acceleration data from 2JCIE-BU01 (USB connection).

```javascript
// Javascript Example

let omron = obniz.wired('2JCIE');
let results = await omron.findWait();

if(results){
    console.log("find");
  
    await omron.connectWait();
    let data = await omron.getLatestCalculationDataUSBWait();
    
    console.log(data);
    
    await omron.disconnectWait();
}else{
    console.log("not find");
}

```   

The return format is below.  

```javascript
//example response
{
  sequence_number: 0,
  disconfort_index: 68.78,
  heatstroke_risk_factor: 18.29, //degC
  vibration_information: "NONE",
  si_value: 0, //kine
  pga: 0, //gal
  seismic_intensity: 0,
  acceleration_x: 185	//gal
  acceleration_y: -9915	//gal
  acceleration_z: -191	//gal
}

```
