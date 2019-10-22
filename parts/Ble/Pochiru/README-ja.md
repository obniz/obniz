# Pochiru BLE device

Library for [Pochiru](http://www.products.braveridge.com/pochiru/) BLE device. This library is based on the specifications defined by Peripheral Device Link Profile. For more information on this protocol please visit [here](https://linkingiot.com/developer/LinkingProfile/device_profile.html).

![](./Pochiru.jpg)

This devices has no sensors.

## Usage

Using the obniz wired function we can get an instance of such an object. We need to pass the serial number as a parameter. This is mandatory and it allows the usage of multiple ble devices of same model. The serial number can be found taped on the battery holder, on the case or on the manual that comes with the device.

![](./Pochiru_serial.jpg)

```javascript
let Pochiru = obniz.wired('Pochiru', {serial:'0142095'});
```

Initialize connection as follows:

```javascript
await Pochiru.connectWait();
```
