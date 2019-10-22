# Oshieru BLE device

Library for [Oshieru](http://www.products.braveridge.com/oshieru/) BLE device. This library is based on the specifications defined by Peripheral Device Link Profile. For more information on this protocol please visit [here](https://linkingiot.com/developer/LinkingProfile/device_profile.html).

![](./Oshieru.jpg)

This device has a door/window sensor.

## Usage

Using the obniz wired function we can get an instance of such an object. We need to pass the serial number as a parameter. This is mandatory and it allows the usage of multiple ble devices of same model. The serial number can be found taped on the battery holder, on the case or on the manual that comes with the device.

![](./Oshieru_serial.jpg)

```javascript
let Oshieru = obniz.wired('Oshieru', {serial:'0142095'});
```

Initialize connection as follows:

```javascript
await Oshieru.connectWait();
```

After this period we can get some initial sensor values with:

```javascript
sizukutha.getSensors()
```

We can update these sensor values by calling updateSensors and have the device deliver them in our callback. We define the callback as onSensorData and can be used as below:

```javascript
sizukutha.onSensorData = function(data) {
  console.log('Sizuku callback', data);
}
sizukutha.updateSensors();
```

We can use setInterval to update regularly. The return data is a dictionary in the form like below. The state can be 'open' or 'closed' and the count value represents the count of 'open' states only

```json
{
  'Open/Close information': { state: 'open', count: 120 }
}
```
