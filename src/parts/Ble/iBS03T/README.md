# iBS03T
temperature made by INGICS.

![](image.jpg)


## wired(obniz)

```javascript
// Javascript Example
let ibs03t = obniz.wired('iBS03T');
```

## scan()

Search for iBS03T, and if found, return that information in the Callback function.

```javascript
// Javascript Example
let ibs03t = obniz.wired('iBS03T');
ibs03t.onNotification = (data => {
            console.log(`battery ${data.battery}V event ${data.event} temperature ${data.temperature} address ${data.address}`);
        });
ibs03t.scan();
```

## onNotification = function(data){}

If found, return the information in the Callback function.

- battery : Battery voltage
- event : event
- temperature : module sensor temperature
- address : module address

```javascript
// Javascript Example
let ibs03t = obniz.wired('iBS03T');
ibs03t.onNotification = (data => {
            console.log(`battery ${data.battery}V event ${data.event} temperature ${data.temperature} address ${data.address}`);
        });
ibs03t.scan();
```

## end()

Finish the scan.

```javascript
// Javascript Example
let ibs03t = obniz.wired('iBS03T');
ibs03t.end();
```
