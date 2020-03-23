# Logtta Accel

http://www.uni-elec.co.jp/logtta_accel_3_0_torisetsu.pdf

This library operates in the beacon mode referring to the above document.

Search Logtta Accel and get the data.

![](image.jpg)

## wired(obniz)

```javascript
// Javascript Example
let logtta = obniz.wired('Logtta_Accel');
```

## scan()

Search Logtta Accel, and if found, return the information with Callback function.

```javascript
// Javascript Example
let logtta = obniz.wired('Logtta_Accel');
logtta.onNotification = (data => {
            console.log(
                `battery ${data.battery}% sequence ${data.sequence} revision ${data.revision} name:${data.name}\n` +
                `setting ${data.setting.temp_cycle}s ${data.setting.accel_sampling}Hz HPF:${data.setting.hpf} ${data.setting.accel_range}G ${data.setting.accel_axis} ${data.setting.accel_resolution}bit\n` +
                `temperature ${data.temperature} humidity ${data.humidity} alert ${data.alert} address ${data.address}`,
              );
        });
logtta.scan();;
```

## onNotification = function(data){}

If found, return the information in the Callback function.

- battery : Battery voltage
- sequence : Sequence number
- revision : module version
- name : Module name
- setting
    - temp_cycle : Temperature and humidity measurement cycle (seconds)
    - accel_sampling : acceleration sampling frequency (Hz)
    - hpf : High pass filter
    - accel_range : acceleration range (G)
    - accel_axis : acceleration measurement axis (0b001: Z, 0b010: Y, 0b011: Y / Z, 0b100: X, 0b101: X / Z, 0b110: X / Y, 0b111: X / Y / Z)
    - accel_resolution : acceleration resolution (bit)
- temperature: temperature
- humidity: Humidity
- alert: Alert status of the last four alerts
- address: Address of the module

```javascript
// Javascript Example
let logtta = obniz.wired('Logtta_Accel');
logtta.onNotification = (data => {
            console.log(
                `battery ${data.battery}% sequence ${data.sequence} revision ${data.revision} name:${data.name}\n` +
                `setting ${data.setting.temp_cycle}s ${data.setting.accel_sampling}Hz HPF:${data.setting.hpf} ${data.setting.accel_range}G ${data.setting.accel_axis} ${data.setting.accel_resolution}bit\n` +
                `temperature ${data.temperature} humidity ${data.humidity} alert ${data.alert} address ${data.address}`,
              );
        });
logtta.scan();
```

## onAcceleration = function(data){}

If found, return the information in the Callback function.

- peak : Acceleration peak data
- rms : Acceleration RMS data
- address : Address of the module

```javascript
// Javascript Example
let logtta = obniz.wired('Logtta_Accel');
logtta.onAcceleration = (data => {
        console.log(`x peak ${data.x.peak} rms ${data.x.rms} y peak ${data.y.peak} rms ${data.y.rms} z peak ${data.z.peak} rms ${data.z.rms} address ${data.address}`);
    });
logtta.scan();
```

## end()

スキャンを終了します。

```javascript
// Javascript Example
let logtta = obniz.wired('Logtta_Accel');
logtta.end();
```
