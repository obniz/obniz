# iBS02IR
INGICS社製の温湿度センサーです。

![](image.jpg)


## wired(obniz)

```javascript
// Javascript Example
let ibs02ir = obniz.wired('iBS02IR');
```

## scan()

iBS01Tを検索し、発見した場合、その情報をCallback関数で返します。

```javascript
// Javascript Example
let ibs02ir = obniz.wired('iBS02IR');
ibs02ir.onNotification = (data => {
            console.log(`battery ${data.battery}V event ${data.event} address ${data.address}`);
        });
ibs02ir.scan();
```

## onNotification = function(data){}

発見した場合にその情報をCallback関数で返します。

- battery : 電池電圧
- event : event
- address : モジュールアドレス

```javascript
// Javascript Example
let ibs02ir = obniz.wired('iBS02IR');
ibs02ir.onNotification = (data => {
            console.log(`battery ${data.battery}V event ${data.event} address ${data.address}`);
        });
ibs02ir.scan();
```


## onChangeMoving = function(moved){}

動きがあれば、コールバック関数で返します。

```javascript
// Javascript Example
let ibs02ir = obniz.wired('iBS02IR');
ibs02ir.onChangeMoving = (moved =>{
                console.log(`moving state ${moved}`);
            });
ibs02ir.scan();
```

## end()

スキャンを終了します。

```javascript
// Javascript Example
let ibs02ir = obniz.wired('iBS02IR');
ibs02ir.end();
```
