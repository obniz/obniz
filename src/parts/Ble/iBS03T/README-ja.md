# iBS03T
INGICS社製の温度センサーです。

![](image.jpg)


## wired(obniz)

```javascript
// Javascript Example
let ibs03t = obniz.wired('iBS03T');
```

## scan()

iBS03Tを検索し、発見した場合、その情報をCallback関数で返します。

```javascript
// Javascript Example
let ibs03t = obniz.wired('iBS03T');
ibs03t.onNotification = (data => {
            console.log(`battery ${data.battery}V event ${data.event} temperature ${data.temperature} address ${data.address}`);
        });
ibs03t.scan();
```

## onNotification = function(data){}

発見した場合にその情報をCallback関数で返します。

- battery : 電池電圧
- event : event
- temperature : モジュール内の温度センサの値
- address : モジュールのアドレス

```javascript
// Javascript Example
let ibs03t = obniz.wired('iBS03T');
ibs03t.onNotification = (data => {
            console.log(`battery ${data.battery}V event ${data.event} temperature ${data.temperature} address ${data.address}`);
        });
ibs03t.scan();
```

## end()

スキャンを終了します。

```javascript
// Javascript Example
let ibs03t = obniz.wired('iBS03T');
ibs03t.end();
```
