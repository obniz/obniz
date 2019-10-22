# Sizuku 6x BLE device

Library for [Sizuku 6x](http://www.products.braveridge.com/sizuku-6x/) BLE device. This library is based on the specifications defined by Peripheral Device Link Profile. For more information on this protocol please visit [here](https://linkingiot.com/developer/LinkingProfile/device_profile.html).

![](./Sizuku6x.jpg)

This devices currently does not report any sensors.

## Usage

Using the obniz wired function we can get an instance of such an object. We need to pass the serial number as a parameter. This is mandatory and it allows the usage of multiple ble devices of same model. The serial number can be found taped on the battery holder, on the case or on the manual 6xt comes with the device.

![](./Sizuku_serial.jpg)

```javascript
let sizuku6x = obniz.wired('Sizuku6x', {serial:'0142095'});
```

Initialize connection as follows:

```javascript
await sizuku6x.connectWait();
```
