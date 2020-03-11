# iBS04i
beacon made by INGICS.

![](image.jpg)


## wired(obniz)

```javascript
// Javascript Example
let ibs04i = obniz.wired('iBS04i');
```

## scan()

Search for iBS04i, and if found, return that information in the Callback function.

```javascript
// Javascript Example
let ibs04i = obniz.wired('iBS04i');
ibs04i.onNotification = (data => {
            console.log(
                `battery ${data.battery}V event ${data.event} uuid ${data.uuid} major ${data.major} minor ${data.minor} rssi ${data.rssi}`,
            );
        });
ibs04i.scan();
```

## onNotification = function(data){}

If found, return the information in the Callback function.

- battery : Battery voltage
- event : Button pressed: 1
- uuid : iBeacon　UUID
- major : iBeacon　major
- minor : iBeacon　minor
- power : iBeacon　power
- rssi :  Signal strength

```javascript
// Javascript Example
let ibs04i = obniz.wired('iBS04i');
ibs04i.onNotification = (data => {
            console.log(
                `battery ${data.battery}V event ${data.event} uuid ${data.uuid} major ${data.major} minor ${data.minor} rssi ${data.rssi} power ${data.power}`,
            );
        });
ibs04i.scan();
```

## end()

Finish the scan.

```javascript
// Javascript Example
let ibs04i = obniz.wired('iBS04i');
ibs04i.end();
```
