# iBS01RG
Acceleration by INGICS.

![](image.jpg)


## wired(obniz)

```javascript
// Javascript Example
let ibs01rg = obniz.wired('iBS01RG');
```

## scan()

Search for iBS01RG, and if found, return that information in the Callback function.

```javascript
// Javascript Example
let ibs01rg = obniz.wired('iBS01RG');
ibs01rg.onNotification = (data => {
            console.log(`battery ${data.battery}V address ${data.address} button ${data.button} active ${data.active} acceleration ${data.acceleration[0].x},${data.acceleration[0].y},${data.acceleration[0].z} ${data.acceleration[1].x},${data.acceleration[1].y},${data.acceleration[1].z} ${data.acceleration[2].x},${data.acceleration[2].y},${data.acceleration[2].z}` ) ;
        });
ibs01rg.scan();
```

## onNotification = function(data){}

If found, return the information in the Callback function.

- battery : Battery voltage
- button : button status
- active : active status
- acceleration : acceleration array
- address : module address

```javascript
// Javascript Example
let ibs01rg = obniz.wired('iBS01RG');
ibs01rg.onNotification = (data => {
            console.log(`battery ${data.battery}V address ${data.address} button ${data.button} active ${data.active} acceleration ${data.acceleration[0].x},${data.acceleration[0].y},${data.acceleration[0].z} ${data.acceleration[1].x},${data.acceleration[1].y},${data.acceleration[1].z} ${data.acceleration[2].x},${data.acceleration[2].y},${data.acceleration[2].z}` ) ;
        });
ibs01rg.scan();
```

## onChangeButton = function(pressed){}

Calls the callback function when the button is pressed or released.

```javascript
// Javascript Example
let ibs01rg = obniz.wired('iBS01RG');
ibs01rg.onChangeButton = (pressed =>{
            console.log(`button state ${pressed}`);
        });
ibs01rg.scan();
```

## onChangeActive = function(closed){}

Calls the callback function when the active is active or in active.

```javascript
// Javascript Example
let ibs01rg = obniz.wired('iBS01RG');
ibs01rg.onChangeActive = (active =>{
            console.log(`active state ${active}`);
        });
ibs01rg.scan();
```

## end()

Finish the scan.

```javascript
// Javascript Example
let ibs01rg = obniz.wired('iBS01RG');
ibs01rg.end();
```
