# iBS01
iBS01T or iBS01G by INGICS.

![](image.jpg)


## wired(obniz)

```javascript
// Javascript Example
let ibs01 = obniz.wired('iBS01');
```

## scan()

Search for iBS01, and if found, return that information in the Callback function.

```javascript
// Javascript Example
let ibs01 = obniz.wired('iBS01');
ibs01.onNotification = (data => {
            console.log(`battery ${data.battery}V event ${data.event} address ${data.address}`);
        });
ibs01.scan();
```

## onNotification = function(data){}

If found, return the information in the Callback function.

- battery : Battery voltage
- event : event
- address : module address

```javascript
// Javascript Example
let ibs01 = obniz.wired('iBS01');
ibs01.onNotification = (data => {
            console.log(`battery ${data.battery}V event ${data.event} address ${data.address}`);
        });
ibs01.scan();
```

## onChangeButton = function(pressed){}

Calls the callback function when the button is pressed or released.

```javascript
// Javascript Example
let ibs01 = obniz.wired('iBS01');
ibs01.onChangeButton = (pressed =>{
            console.log(`button state ${pressed}`);
        });
ibs01.scan();
```

## onChangeHallSensor = function(closed){}

Calls the callback function when the hall sensor is closed or opened.

```javascript
// Javascript Example
let ibs01 = obniz.wired('iBS01');
ibs01.onChangeHallSensor = (closed =>{
            console.log(`hall sensor state ${closed}`);
        });
ibs01.scan();
```


## onChangeMoving = function(moved){}

Calls the callback function when the motion is moved or stopped.

```javascript
// Javascript Example
let ibs01 = obniz.wired('iBS01');
ibs01.onChangeMoving = (moved =>{
                console.log(`moving state ${moved}`);
            });
ibs01.scan();
```


## end()

Finish the scan.

```javascript
// Javascript Example
let ibs01 = obniz.wired('iBS01');
ibs01.end();
```
