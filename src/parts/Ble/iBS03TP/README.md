# iBS03TP
temperature made by INGICS.

![](image.jpg)


## wired(obniz)

```javascript
// Javascript Example
let ibs03tp = obniz.wired('iBS03TP');
```

## scan()

Search for iBS03TP, and if found, return that information in the Callback function.

```javascript
// Javascript Example
let ibs03tp = obniz.wired('iBS03TP');
ibs03tp.onNotification = (data => {
            console.log(`battery ${data.battery}V event ${data.event} temp ${data.temp} probe_temp ${data.probe_temp}`);
        });
ibs03tp.scan();
```

## onNotification = function(data){}

If found, return the information in the Callback function.

- battery : Battery voltage
- event : event
- temp : module sensor temperature
- probe_temp : probe sensor temperature

```javascript
// Javascript Example
let ibs03tp = obniz.wired('iBS03TP');
ibs03tp.onNotification = (data => {
            console.log(`battery ${data.battery}V event ${data.event} temp ${data.temp} probe_temp ${data.probe_temp}`);
        });
ibs03tp.scan();
```

## end()

Finish the scan.

```javascript
// Javascript Example
let ibs03tp = obniz.wired('iBS03TP');
ibs03tp.end();
```
