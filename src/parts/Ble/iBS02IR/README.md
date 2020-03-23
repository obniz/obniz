# iBS02IR
iBS02IR by INGICS.

![](image.jpg)


## wired(obniz)

```javascript
// Javascript Example
let ibs02ir = obniz.wired('iBS02IR');
```

## scan()

Search for iBS02IR, and if found, return that information in the Callback function.

```javascript
// Javascript Example
let ibs02ir = obniz.wired('iBS02IR');
ibs02ir.onNotification = (data => {
            console.log(`battery ${data.battery}V event ${data.event} address ${data.address}`);
        });
ibs02ir.scan();
```

## onNotification = function(data){}

If found, return the information in the Callback function.

- battery : Battery voltage
- event : event
- address : module address

```javascript
// Javascript Example
let ibs02ir = obniz.wired('iBS02IR');
ibs02ir.onNotification = (data => {
            console.log(`battery ${data.battery}V event ${data.event} address ${data.address}`);
        });
ibs02ir.scan();
```


## onChangeMoving = function(moved){}

Calls the callback function when the motion is moved or stopped.

```javascript
// Javascript Example
let ibs02ir = obniz.wired('iBS02IR');
ibs02ir.onChangeMoving = (moved =>{
                console.log(`moving state ${moved}`);
            });
ibs02ir.scan();
```


## end()

Finish the scan.

```javascript
// Javascript Example
let ibs02ir = obniz.wired('iBS02IR');
ibs02ir.end();
```
