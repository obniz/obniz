# iBS01T
INGICS社製の温湿度センサーです。

![](image.jpg)


## wired(obniz)

```javascript
// Javascript Example
let ibs01t = obniz.wired('iBS01T');
```

## scan()

iBS01Tを検索し、発見した場合、その情報をCallback関数で返します。

```javascript
// Javascript Example
let ibs01t = obniz.wired('iBS01T');
ibs01t.onNotification = (data => {
            console.log(`battery ${data.battery}V event ${data.event} temperature ${data.temperature} humidity ${data.humidity} address ${data.address}`);
        });
ibs01t.scan();
```

## onNotification = function(data){}

発見した場合にその情報をCallback関数で返します。

- battery : 電池電圧
- event : event
- temperature : 温度センサの値
- humidity : 湿度センサの値
- address : モジュールアドレス

```javascript
// Javascript Example
let ibs01t = obniz.wired('iBS01T');
ibs01t.onNotification = (data => {
            console.log(`battery ${data.battery}V event ${data.event} temperature ${data.temperature} humidity ${data.humidity} address ${data.address}`);
        });
ibs01t.scan();
```

## end()

スキャンを終了します。

```javascript
// Javascript Example
let ibs01t = obniz.wired('iBS01T');
ibs01t.end();
```
