# iBS02IR
INGICS社製の温湿度センサーです。

![](image.jpg)


## wired(obniz)

```javascript
// Javascript Example
let ibs02pir = obniz.wired('iBS02PIR');
```

## scan()

iBS01Tを検索し、発見した場合、その情報をCallback関数で返します。

```javascript
// Javascript Example
let ibs02pir = obniz.wired('iBS02PIR');
ibs02pir.onNotification = (data => {
            console.log(`battery ${data.battery}V event ${data.event} address ${data.address}`);
        });
ibs02pir.scan();
```

## onNotification = function(data){}

発見した場合にその情報をCallback関数で返します。

- battery : 電池電圧
- event : event
- address : モジュールアドレス

```javascript
// Javascript Example
let ibs02pir = obniz.wired('iBS02PIR');
ibs02pir.onNotification = (data => {
            console.log(`battery ${data.battery}V event ${data.event} address ${data.address}`);
        });
ibs02pir.scan();
```


## onChangeMoving = function(moved){}

動きがあれば、コールバック関数で返します。

```javascript
// Javascript Example
let ibs02pir = obniz.wired('iBS02PIR');
ibs02pir.onChangeMoving = (moved =>{
                console.log(`moving state ${moved}`);
            });
ibs02pir.scan();
```

## end()

スキャンを終了します。

```javascript
// Javascript Example
let ibs02pir = obniz.wired('iBS02PIR');
ibs02pir.end();
```
