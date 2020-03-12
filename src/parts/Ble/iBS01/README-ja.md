# iBS01T
INGICS社製の温湿度センサーです。

![](image.jpg)


## wired(obniz)

```javascript
// Javascript Example
let ibs01 = obniz.wired('iBS01');
```

## scan()

iBS01Tを検索し、発見した場合、その情報をCallback関数で返します。

```javascript
// Javascript Example
let ibs01 = obniz.wired('iBS01');
ibs01.onNotification = (data => {
            console.log(`battery ${data.battery}V event ${data.event} address ${data.address}`);
        });
ibs01.scan();
```

## onNotification = function(data){}

発見した場合にその情報をCallback関数で返します。

- battery : 電池電圧
- event : event
- address : モジュールアドレス

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

スキャンを終了します。

```javascript
// Javascript Example
let ibs01 = obniz.wired('iBS01');
ibs01.end();
```
