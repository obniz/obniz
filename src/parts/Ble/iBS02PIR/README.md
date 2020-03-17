# iBS02PIR
iBS02PIR by INGICS.

![](image.jpg)


## wired(obniz)

```javascript
// Javascript Example
let ibs02pir = obniz.wired('iBS02PIR');
```

## scan()

Search for iBS02PIR, and if found, return that information in the Callback function.

```javascript
// Javascript Example
let ibs02pir = obniz.wired('iBS02PIR');
ibs02pir.onNotification = (data => {
            console.log(`battery ${data.battery}V event ${data.event} address ${data.address}`);
        });
ibs02pir.scan();
```

## onNotification = function(data){}

If found, return the information in the Callback function.

- battery : Battery voltage
- event : event
- address : module address

```javascript
// Javascript Example
let ibs02pir = obniz.wired('iBS02PIR');
ibs02pir.onNotification = (data => {
            console.log(`battery ${data.battery}V event ${data.event} address ${data.address}`);
        });
ibs02pir.scan();
```


## onChangeMoving = function(moved){}

Calls the callback function when the motion is moved or stopped.

```javascript
// Javascript Example
let ibs02pir = obniz.wired('iBS02PIR');
ibs02pir.onChangeMoving = (moved =>{
                console.log(`moving state ${moved}`);
            });
ibs02pir.scan();
```


## end()

Finish the scan.

```javascript
// Javascript Example
let ibs02pir = obniz.wired('iBS02PIR');
ibs02pir.end();
```
