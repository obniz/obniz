# iBS03 iBS04
event tag made by INGICS.

![](image.jpg)

support module 

- iBS03(H) : Button, Magnet Event
- iBS04 : Button Event


## wired(obniz)

```javascript
// Javascript Example
let ibs03 = obniz.wired('iBS03');
```

## scan()

Search for iBS03TP, and if found, return that information in the Callback function.

```javascript
// Javascript Example
let ibs03 = obniz.wired('iBS03');
ibs03.onNotification = (data => {
            console.log(`battery ${data.battery}V event ${data.event} address ${data.address}`);
        });
ibs03.scan();
```

## onNotification = function(data){}

If found, return the information in the Callback function.

- battery : Battery voltage
- event : event
- address : module address

```javascript
// Javascript Example
let ibs03 = obniz.wired('iBS03');
ibs03.onNotification = (data => {
            console.log(`battery ${data.battery}V event ${data.event} address ${data.address}`);
        });
ibs03.scan();
```

## end()

Finish the scan.

```javascript
// Javascript Example
let ibs03 = obniz.wired('iBS03');
ibs03.end();
```
