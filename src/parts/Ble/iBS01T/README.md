# iBS01T
temperature & humidity made by INGICS.

![](image.jpg)


## wired(obniz)

```javascript
// Javascript Example
let ibs01t = obniz.wired('iBS01T');
```

## scan()

Search for iBS01T, and if found, return that information in the Callback function.

```javascript
// Javascript Example
let ibs01t = obniz.wired('iBS01T');
ibs01t.onNotification = (data => {
            console.log(`battery ${data.battery}V event ${data.event} temperature ${data.temperature} humidity ${data.humidity}`);
        });
ibs01t.scan();
```

## onNotification = function(data){}

If found, return the information in the Callback function.

- battery : Battery voltage
- event : event
- temperature : temperature(℃)
- humidity : humidity (%)
- address : module address

```javascript
// Javascript Example
let ibs01t = obniz.wired('iBS01T');
ibs01t.onNotification = (data => {
            console.log(`battery ${data.battery}V event ${data.event} temperature ${data.temperature} humidity ${data.humidity}`);
        });
ibs01t.scan();
```

## end()

Finish the scan.

```javascript
// Javascript Example
let ibs01t = obniz.wired('iBS01T');
ibs01t.end();
```
