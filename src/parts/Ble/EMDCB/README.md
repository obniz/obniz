# EMDCB
EMDCB is a BLE-based human detection sensor and illuminance sensor.  
It can be attached to ceilings, etc., to measure the amount of light in a room and the number of people entering and leaving the room.  

![](./image.jpg)

## isDevice(peripheral)
Determine if the scanned peripheral is an EMDCB with BLE. 

```javascript
// Javascript Example
await obniz.ble.initWait();
const EMDCB = Obniz.getPartsClass("EMDCB");
obniz.ble.scan.onfind = async (peripheral) => {
  if (EMDCB.isDevice(peripheral)) {
    console.log("device find");
    console.log(peripheral);
  }
};
await obniz.ble.scan.startWait();
```


## getData()
Parses advertisement and retrieves data.  
There are two types of advertisements, Sensor Data and Commissioning Data, which differ in the data they return.  
(see data format)  
```javascript
// Javascript Example
await obniz.ble.initWait();
const EMDCB = Obniz.getPartsClass("EMDCB");
obniz.ble.scan.onfind = async (peripheral) => {
  if (EMDCB.isDevice(peripheral)) {
    const result = EMDCB.getData(peripheral);
    console.log(result)
  }
};
await obniz.ble.scan.startWait();

```

### Data format
Sensor Data
```
{
  address: string;
  energy_level?: number; //電池残量(%)
  light_level_solar_cell?: number; //太陽電池の光量(lx)
  light_level_sensor?: number; //センサーの光量(lx)
  occupancy_status?: boolean; //人がいるかどうか
}
```

Commissioning Data
```
{
  address: string;
  commissioning_info?: number[]; //AES key & device address(22byte)
}
```
