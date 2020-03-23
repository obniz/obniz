# S-CBTGAAAC
S-CBTGAAAC by ABLIC.

![](image.jpg)


## wired(obniz)

```javascript
// Javascript Example
let tag = obniz.wired('S-CBTGAAAC');
```

## scan()

Search for S-CBTGAAAC, and if found, return that information in the Callback function.

```javascript
// Javascript Example
let tag = obniz.wired('S-CBTGAAAC');
tag.onNotification = (deviceId => {
            console.log(`deviceID ${deviceId}`);
        });
tag.scan();
```

## onNotification = function(deviceId){}

If found, return the information in the Callback function.

```javascript
// Javascript Example
let tag = obniz.wired('S-CBTGAAAC');
tag.onNotification = (deviceId => {
            console.log(`deviceID ${deviceId}`);
        });
tag.scan();
```


## end()

Finish the scan.

```javascript
// Javascript Example
let tag = obniz.wired('S-CBTGAAAC');
tag.end();
```
